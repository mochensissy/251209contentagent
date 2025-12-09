import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { xiaohongshuClient } from '@/lib/xiaohongshu-client'
import { separateTextAndImages, extractTags } from '@/lib/text-utils'

// POST /api/publish/xiaohongshu - 发布文章到小红书
export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json() as { articleId: number }

    if (!articleId) {
      return NextResponse.json(
        { error: '缺少文章ID' },
        { status: 400 }
      )
    }

    console.log('\n🚀 开始发布文章到小红书...')
    console.log(`- 文章ID: ${articleId}`)

    // ========== 步骤1: 验证配置 ==========
    if (!xiaohongshuClient.isConfigured()) {
      return NextResponse.json(
        { error: '小红书 API 配置未设置，请检查环境变量' },
        { status: 500 }
      )
    }

    // ========== 步骤2: 获取文章内容 ==========
    console.log('\n📖 步骤1/4: 获取文章内容...')

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    console.log(`✅ 文章标题: ${article.title}`)
    console.log(`✅ 文章长度: ${article.content.length} 字符`)

    // ========== 步骤3: 图文分离和文本清洗 ==========
    console.log('\n🔄 步骤2/4: 图文分离和文本清洗...')

    // 解析已有的图片
    const existingImages = article.images ? JSON.parse(article.images) : []

    // 分离文本和图片
    const { plainText, images, coverImage } = separateTextAndImages({
      content: article.content,
      existingImages,
    })

    console.log(`✅ 清洗后文本长度: ${plainText.length} 字符`)
    console.log(`✅ 提取图片数量: ${images.length}`)
    console.log(`✅ 封面图: ${coverImage || '无'}`)

    // 检查封面图
    if (!coverImage) {
      return NextResponse.json(
        { error: '文章缺少封面图片，无法发布到小红书' },
        { status: 400 }
      )
    }

    // ========== 步骤4: 提取标签 ==========
    const tags = extractTags(article.title, plainText)
    console.log(`✅ 提取标签: ${tags.join(', ')}`)

    // ========== 步骤5: 调用小红书 API ==========
    console.log('\n📤 步骤3/4: 调用小红书发布 API...')

    const publishResult = await xiaohongshuClient.publishNote({
      title: article.title,
      content: plainText,
      coverImage,
      images: images.slice(1), // 除封面外的其他图片
      tags,
      noteId: `article_${articleId}_${Date.now()}`, // 自定义笔记ID
    })

    if (!publishResult.success || !publishResult.data) {
      throw new Error(publishResult.error || '发布失败')
    }

    console.log('✅ 小红书 API 调用成功')

    // ========== 步骤6: 保存发布记录 ==========
    console.log('\n💾 步骤4/4: 保存发布记录...')

    await prisma.article.update({
      where: { id: articleId },
      data: {
        status: 'published',
      },
    })

    await prisma.publishRecord.create({
      data: {
        articleId,
        platform: 'xiaohongshu',
        platformId: publishResult.data.note_id,
        status: 'success',
        publishedAt: new Date(),
      },
    })

    console.log('✅ 发布记录已保存\n')

    return NextResponse.json({
      success: true,
      data: {
        noteId: publishResult.data.note_id,
        publishUrl: publishResult.data.publish_url,
        qrCodeUrl: publishResult.data.xiaohongshu_qr_image_url,
        message: '文章已成功发布到小红书',
      },
    })

  } catch (error) {
    console.error('\n❌ 发布失败:', error)

    // 如果有 articleId，记录失败状态
    try {
      const { articleId } = await request.json() as { articleId: number }
      if (articleId) {
        await prisma.publishRecord.create({
          data: {
            articleId,
            platform: 'xiaohongshu',
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : '发布失败',
          },
        })
      }
    } catch (e) {
      // 忽略记录失败的错误
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : '发布失败' },
      { status: 500 }
    )
  }
}
