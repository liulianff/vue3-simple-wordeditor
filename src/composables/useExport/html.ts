import type { ShallowRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { downloadFile, generateFilename, processImagesWithCrop } from './utils'

export function useExporterHTML(editor: ShallowRef<Editor | undefined>) {
  async function exportAsHTML() {
    const rawHtml = editor.value?.getHTML() || ''
    const { html: processedHtml } = await processImagesWithCrop(rawHtml)
    
    // 处理空段落，用 &nbsp; 填充
    const finalHtml = processedHtml
      .replace(/<p\s*>\s*<\/p>/gi, '<p>&nbsp;</p>')
      .replace(/<p\s+[^>]*>\s*<\/p>/gi, (match) => match.replace(/><\/p>/, '>&nbsp;</p>'))
    
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
      color: #1f2937;
      background-color: #ffffff;
    }
    h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
    h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
    h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
    h4 { font-size: 1em; font-weight: bold; margin: 0.5em 0; }
    h5 { font-size: 0.875em; font-weight: bold; margin: 0.5em 0; }
    h6 { font-size: 0.75em; font-weight: bold; margin: 0.5em 0; }
    p { margin: 0.5em 0; min-height: 1.2em; }
    ul, ol { padding-left: 1.5rem; margin: 0.5em 0; }
    li { margin: 0.25em 0; }
    blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 1rem;
      margin: 1em 0;
      color: #6b7280;
      background-color: #f3f4f6;
      padding: 0.5rem 1rem;
      border-radius: 0 0.25rem 0.25rem 0;
    }
    img { max-width: 100%; height: auto; border-radius: 0.25rem; }
    img.wrap-left { float: left; margin-right: 1rem; margin-bottom: 0.5rem; }
    img.wrap-right { float: right; margin-left: 1rem; margin-bottom: 0.5rem; }
    img.block { display: block; margin: 1em auto; }
    mark { background-color: #ffff00; padding: 0 0.2em; color: inherit; }
    a { color: #3b82f6; text-decoration: underline; }
    strong { font-weight: bold; }
    em { font-style: italic; }
    s { text-decoration: line-through; }
    u { text-decoration: underline; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 1em 0; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
    th { background-color: #f3f4f6; font-weight: bold; }
  </style>
</head>
<body>
${finalHtml}
</body>
</html>`
    downloadFile(html, generateFilename('html'), 'text/html')
  }

  return { exportAsHTML }
}
