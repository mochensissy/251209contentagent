/**
 * 文本处理工具类
 * 用于文本清洗、图文分离等功能
 */

/**
 * 从 Markdown 内容中提取图片 URL
 */
export function extractImagesFromMarkdown(markdown: string): string[] {
  const imageRegex = /!\[.*?\]\((.*?)\)/g
  const images: string[] = []
  let match

  while ((match = imageRegex.exec(markdown)) !== null) {
    if (match[1]) {
      images.push(match[1])
    }
  }

  return images
}

/**
 * 将 Markdown 转换为纯文本
 * 移除所有 Markdown 标记符号，保留文本内容和换行结构
 */
export function markdownToPlainText(markdown: string): string {
  let text = markdown

  // 1. 移除图片标记 ![alt](url)
  text = text.replace(/!\[.*?\]\(.*?\)/g, '')

  // 2. 移除链接，保留链接文本 [text](url) -> text
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1')

  // 3. 移除标题标记 # ## ###
  text = text.replace(/^#{1,6}\s+/gm, '')

  // 4. 移除加粗和斜体标记 **text** *text* __text__ _text_
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '$1')  // 加粗+斜体
  text = text.replace(/\*\*(.*?)\*\*/g, '$1')      // 加粗
  text = text.replace(/\*(.*?)\*/g, '$1')          // 斜体
  text = text.replace(/___(.*?)___/g, '$1')        // 加粗+斜体
  text = text.replace(/__(.*?)__/g, '$1')          // 加粗
  text = text.replace(/_(.*?)_/g, '$1')            // 斜体

  // 5. 移除删除线 ~~text~~
  text = text.replace(/~~(.*?)~~/g, '$1')

  // 6. 移除行内代码 `code`
  text = text.replace(/`([^`]+)`/g, '$1')

  // 7. 移除代码块 ```code```
  text = text.replace(/```[\s\S]*?```/g, '')

  // 8. 移除引用标记 >
  text = text.replace(/^>\s+/gm, '')

  // 9. 移除水平线 --- *** ___
  text = text.replace(/^[-*_]{3,}$/gm, '')

  // 10. 移除列表标记 - * + 1.
  text = text.replace(/^[\s]*[-*+]\s+/gm, '')
  text = text.replace(/^[\s]*\d+\.\s+/gm, '')

  // 11. 移除 HTML 标签（如果有）
  text = text.replace(/<[^>]+>/g, '')

  // 12. 清理多余的空行（保留段落结构）
  text = text.replace(/\n{3,}/g, '\n\n')

  // 13. 清理首尾空白
  text = text.trim()

  return text
}

/**
 * 图文分离 - 从文章中提取文本和图片
 */
export function separateTextAndImages(params: {
  content: string
  existingImages?: string[]
}): {
  plainText: string
  images: string[]
  coverImage: string | null
} {
  const { content, existingImages = [] } = params

  // 1. 从 Markdown 中提取图片
  const markdownImages = extractImagesFromMarkdown(content)

  // 2. 合并已有图片和提取的图片（去重）
  const allImages = Array.from(new Set([...existingImages, ...markdownImages]))

  // 3. 清洗文本
  const plainText = markdownToPlainText(content)

  // 4. 确定封面图（取第一张）
  const coverImage = allImages.length > 0 ? allImages[0] : null

  return {
    plainText,
    images: allImages,
    coverImage,
  }
}

/**
 * 从文章标题或内容中提取标签（简单实现）
 */
export function extractTags(title: string, content: string): string[] {
  // 这里可以根据业务需求实现更复杂的标签提取逻辑
  // 目前返回一些通用标签
  const tags: string[] = []

  // 如果标题或内容包含特定关键词，添加相关标签
  const keywords = {
    '效率': ['效率', '职场'],
    '管理': ['管理', '职场'],
    '技术': ['技术', '开发'],
    '设计': ['设计', '创意'],
    '营销': ['营销', '运营'],
  }

  const text = (title + ' ' + content).toLowerCase()

  for (const [keyword, relatedTags] of Object.entries(keywords)) {
    if (text.includes(keyword)) {
      tags.push(...relatedTags)
    }
  }

  // 去重并限制数量
  return Array.from(new Set(tags)).slice(0, 5)
}
