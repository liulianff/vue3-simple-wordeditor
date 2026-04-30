import { processImagesWithCrop } from './useExport/utils'

export function useEditorPreview() {
  async function getHTMLFromContent(html: string): Promise<string> {
    let processedHtml = html
      .replace(/ data-crop="[^"]*"/g, '')
      .replace(/<p\s*>\s*<\/p>/gi, '<p>&nbsp;</p>')
      .replace(/<p\s+[^>]*>\s*<\/p>/gi, (match) => match.replace(/><\/p>/, '>&nbsp;</p>'))
    return processedHtml
  }

  async function getMarkdownFromHTML(html: string): Promise<string> {
    // 重用 export 模块里的转换逻辑，只需要 HTML
    const { html: processedHtml } = await processImagesWithCrop(html)
    
    let mdHtml = processedHtml
      .replace(/<p\s*>\s*&nbsp;\s*<\/p>/gi, '\n\n')
      .replace(/<p\s*>\s*<\/p>/gi, '\n\n')
    
    let md = mdHtml
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')
      .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
      .replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~')
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
      .replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<img[^>]*src=["'](.*?)["'][^>]*alt=["'](.*?)["'][^>]*>/gi, `![$2]($1)`)
      .replace(/<img[^>]*alt=["'](.*?)["'][^>]*src=["'](.*?)["'][^>]*>/gi, `![$1]($2)`)
      .replace(/<img[^>]*src=["'](.*?)["'][^>]*>/gi, `![]($1)`)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    
    return md
  }

  return {
    getHTMLFromContent,
    getMarkdownFromHTML
  }
}
