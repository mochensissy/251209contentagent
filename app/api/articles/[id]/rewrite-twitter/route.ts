import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { aiClient } from '@/lib/ai-client'
import { markdownToPlainText } from '@/lib/text-utils'

const TWITTER_PROMPT = `# Role

你是一位社交媒体爆款文案专家，专精于 Twitter (X) 平台的短内容创作。你擅长将长篇大论的文字提炼为简练、有力且极具吸引力的短文案，深谙“黄金前三秒”法则，能够通过精妙的排版和钩子（Hook）吸引读者读完。



# Goals

1.  **极简浓缩**：将用户提供的长文本内容压缩至 140 个中文字符以内（或 280 个英文字符以内）。

2.  **保留原意**：确保核心观点、关键信息和情感色彩不丢失。

3.  **吸引眼球**：使用引人入胜的开头和清晰的节奏感，提高内容的完读率和互动率。

4. 要像个活人，杜绝说这种“不是”，“而是”之类的AI术语。



# Skills

* **提炼核心**：快速识别文本中的高价值信息，果断去除冗余铺垫。

* **情绪调动**：使用反问、金句、对比等修辞手法制造情绪共鸣。

* **视觉优化**：熟练运用 Emoji、空行和列表符号，避免“文字墙”，优化阅读体验。



# Rules

* **严控字数**：中文绝对不超过 140 字，确保能一条推文发完。

* **拒绝废话**：去掉所有客套话、过渡词，直击重点。

* **排版清晰**：看着清爽，句子太长可以换一行。



# Workflow

1.  **分析**：阅读用户提供的原始文本，提取核心观点和关键词。

2.  **重构**：

  * **开头**：用一句强有力的“钩子”或结论前置，抓住注意力。

  * **中间**：用简练的语言或要点叙述核心内容。

  * **结尾**：如有必要，添加金句或引导互动（CTA）。

3.  **润色**：加入适量的 Emoji（😄/🔥/👇）增强视觉重点。

4.  **检查**：严格核对字数限制（中文 < 140 字）。



# Output Format

请直接输出推文内容，不需要解释你的思考过程。



**输出结构示例：**

[吸睛标题/反直觉结论/痛点] 💥

[空行]

[核心内容简述，保留原意]

[空行]

[金句/观点]



# Initialization

请将我选定的内容立即为你生成符合 朋友圈/推特风格的短文案。`

const MAX_TWITTER_LENGTH = 280

/**
 * 将 AI 输出清洗为可直接使用的推特文案，并确保长度不超限
 */
function normalizeTweet(raw: string): string {
  // 保留代码块内容，去掉包裹
  const codeBlock = raw.match(/```[\w-]*\n?([\s\S]*?)```/)
  const content = codeBlock ? codeBlock[1] : raw
  const trimmed = content.trim()

  if (trimmed.length <= MAX_TWITTER_LENGTH) {
    return trimmed
  }

  // 超长时截断，优先保留完整结尾句号
  const slice = trimmed.slice(0, MAX_TWITTER_LENGTH)
  const breakpoints = ['。', '！', '？', '!', '?', '\n']
  const lastBreak = breakpoints
    .map((p) => slice.lastIndexOf(p))
    .reduce((a, b) => Math.max(a, b), -1)

  const safe = lastBreak >= 80 ? slice.slice(0, lastBreak + 1) : slice
  return safe.trim()
}

/**
 * 构建向大模型发送的改写请求内容
 */
function buildPrompt(title: string, content: string): string {
  const safeContent = content.slice(0, 6000)
  return `${TWITTER_PROMPT}

原始标题：${title}

原始正文：
${safeContent}`
}

// POST /api/articles/[id]/rewrite-twitter - 将文章改写为推特文案
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = parseInt(params.id)

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: '无效的文章ID' }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { id },
    })

    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    const plainText = markdownToPlainText(article.content || '')
    if (!plainText) {
      return NextResponse.json({ error: '文章内容为空，无法改写' }, { status: 400 })
    }

    const prompt = buildPrompt(article.title, plainText)

    console.log('🚀 开始改写推特文案', { articleId: id, title: article.title })

    const response = await aiClient.chat(
      [
        {
          role: 'system',
          content:
            '你是精通 Twitter (X) 的爆款文案专家。必须在一条推文内完成输出（中文不超过140字），禁止客套废话，保证排版清爽。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        temperature: 0.55,
        maxTokens: 320,
      }
    )

    const tweet = normalizeTweet(response)

    return NextResponse.json({
      success: true,
      data: {
        tweet,
      },
    })
  } catch (error) {
    console.error('❌ 推特改写失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '改写失败' },
      { status: 500 }
    )
  }
}
