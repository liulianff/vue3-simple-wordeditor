# EditorPreview 预览组件使用指南

EditorPreview 是一个独立的、可复用的预览组件，用于显示编辑器保存的内容，保证编辑和预览效果完全一致！

## 目录

- [快速开始](#快速开始)
- [Props](#props)
- [编辑器与预览并排示例](#编辑器与预览并排示例)
- [useEditorPreview composable](#useeditorpreview-composable)
- [样式自定义](#样式自定义)

---

## 快速开始

### 安装导入

```vue
<template>
  <EditorPreview :html="content" :theme="theme" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EditorPreview } from 'vue3-simple-wordeditor'

const content = ref('<h1>标题</h1><p>内容...</p>')
const theme = ref<'light' | 'dark' | 'auto'>('light')
</script>
```

---

## Props

| 属性 | 类型 | 默认值 | 必需 | 说明 |
|------|------|--------|-----|
| `html` | `string` | - | ✅ | 要显示的 HTML 内容 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | - | 主题设置 |
| `inline` | `boolean` | `false` | - | 内联模式，不渲染外层容器（用于嵌入弹窗等场景） |

---

## 编辑器与预览并排示例

```vue
<template>
  <div class="editor-demo">
    <div class="editor-section">
      <h2>📝 编辑器</h2>
      <VueWordEditor
        ref="editorRef"
        v-model="content"
        :theme="theme"
        :locale="locale"
      />
    </div>

    <div class="preview-section">
      <h2>👁️ 实时预览</h2>
      <EditorPreview :html="content" :theme="theme" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueWordEditor, EditorPreview } from 'vue3-simple-wordeditor'

const editorRef = ref()

const content = ref('')
const theme = ref<'light' | 'dark' | 'auto'>('light')
const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
</script>

<style>
.editor-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .editor-demo {
    grid-template-columns: 1fr;
  }
}
</style>
```

---

## useEditorPreview composable

提供用于处理 HTML 转换的工具函数。

### 导入

```typescript
import { useEditorPreview } from 'vue3-simple-wordeditor'

const {
  getHTMLFromContent,
  getMarkdownFromHTML,
} = useEditorPreview()
```

### API

#### `getHTMLFromContent(html)`

对 HTML 进行预处理（如处理空段落）

```typescript
const rawHtml = '<p>...</p>'
const processedHtml = await getHTMLFromContent(rawHtml)
```

#### `getMarkdownFromHTML(html)`

将 HTML 转换为 Markdown

```typescript
const markdown = await getMarkdownFromHTML(html)
```

---

## 样式自定义

EditorPreview 组件与 VueWordEditor 使用完全相同的样式体系！

### 使用 CSS 变量（推荐）

```vue
<style>
.custom-preview {
  /* 主题变量 */
  --editor-primary-color: #8b5cf6;
  --editor-bg-color: #faf5ff;
  --editor-border-color: #ddd6fe;
}
</style>
```

或者直接覆盖内容样式：

```vue
<style>
.custom-preview :deep(.tiptap) h1 {
  font-size: 2.5em;
}

.custom-preview :deep(.tiptap) blockquote {
  border-left-color: #8b5cf6;
}
</style>
```

详细的样式自定义文档请参考 [STYLING_GUIDE.md](./STYLING_GUIDE.md)

---

## 完整的预览页面示例

这是一个完整的示例，包含编辑器、预览、HTML 输出：

```vue
<template>
  <div class="app">
    <header class="header">
      <h1>VueWordEditor 演示</h1>
      
      <div class="controls">
        <select v-model="theme">
          <option value="light">☀️ 亮色</option>
          <option value="dark">🌙 暗色</option>
          <option value="auto">🖥️ 跟随系统</option>
        </select>
      </div>
    </header>

    <main class="main">
      <section class="section">
        <h2>📝 编辑器</h2>
        <VueWordEditor
          v-model="content"
          :theme="theme"
        />
      </section>

      <section class="section">
        <h2>👁️ 预览</h2>
        <EditorPreview :html="content" :theme="theme" />
      </section>

      <section class="section">
        <h2>📄 HTML 输出</h2>
        <pre><code>{{ content }}</code></pre>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueWordEditor, EditorPreview } from 'vue3-simple-wordeditor'

const content = ref('')
const theme = ref<'light' | 'dark' | 'auto'>('light')
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.section pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow: auto;
  margin: 0;
}
</style>
```
