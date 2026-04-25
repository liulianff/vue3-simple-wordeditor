# vue3-simple-wordeditor

基于 Vue 3 + TipTap 3 构建的富文本编辑器组件，支持图片编辑、亮暗主题、样式自定义。

### 依赖

- `vue` ^3.4.0（peer dependency）
- `lucide-vue-next` ^0.294.0（peer dependency，图标库）

## 方式一：安装(未发布,无法使用)

```bash
npm install vue3-simple-wordeditor
```

<br />

## 方式二：本地构建 + 本地路径引用（当前使用方法）

### 1. 构建库

在 Vue3-Simple-WordEditor 目录下执行：

```bash
npm run build:lib
```

这会在 dist/ 目录生成：

- dist/vue3-simple-wordeditor.es.js — ES Module 格式
- dist/vue3-simple-wordeditor.umd.js — UMD 格式
- dist/vue3-simple-wordeditor.css — 样式文件

### 2. 在其他项目中引用 方法 A：通过 package.json 的本地路径依赖

在目标项目的 package.json 中添加：

```JSON
{
  "dependencies": {
    "vue3-simple-wordeditor": "file:../Vue3-Simple-WordEditor"
  }
}
```

然后执行 npm install ，之后就可以正常 import：

## 快速开始

```vue
<template>
  <Vue3SimpleWordEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Vue3SimpleWordEditor from 'vue3-simple-wordeditor'
import 'vue3-simple-wordeditor/dist/style.css'

const content = ref('<p>Hello World</p>')
</script>
```

## 组件 API

### VueWordEditor

主编辑器组件，通过 `v-model` 双向绑定 HTML 内容。

#### Props

| 属性            | 类型                            | 默认值         | 说明                   |
| ------------- | ----------------------------- | ----------- | -------------------- |
| `modelValue`  | `string`                      | `''`        | 编辑器 HTML 内容（v-model） |
| `placeholder` | `string`                      | `'开始编辑...'` | 占位符文本                |
| `editable`    | `boolean`                     | `true`      | 是否可编辑                |
| `theme`       | `'light' \| 'dark' \| 'auto'` | `'light'`   | 主题模式                 |
| `locale`      | `'zh-CN' \| 'en-US' \| string` | `'zh-CN'`  | 语言设置                 |

#### Events

| 事件                  | 参数              | 说明                 |
| ------------------- | --------------- | ------------------ |
| `update:modelValue` | `value: string` | 内容变化时触发，用于 v-model |

#### Expose

通过 `ref` 获取组件实例后可以访问：

```typescript
const editorRef = ref()
// 模板中: <VueWordEditor ref="editorRef" />

// 可用方法:
editorRef.getHTML(): string                            // 获取当前 HTML 内容
editorRef.setHTML(html: string)                        // 设置 HTML 内容
editorRef.setJSON(json: any)                           // 设置 JSON 内容
editorRef.editor                                       // TipTap 编辑器实例
editorRef.getImagesForUpload(): Promise<ImageUploadItem[]>  // 获取所有图片用于上传
editorRef.replaceImageSrc(oldSrc: string, newSrc: string): boolean  // 替换单个图片 src
editorRef.replaceMultipleImages(srcMapping: Map<string, string>): boolean  // 批量替换图片 src
```

#### 示例

```vue
<template>
  <Vue3SimpleWordEditor
    v-model="content"
    :theme="theme"
    :placeholder="'开始编辑您的文档...'"
    :editable="true"
    :editor-class="'my-custom-class'"
    class="custom-editor"
    style="height: 500px;"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Vue3SimpleWordEditor from 'vue3-simple-wordeditor'
import 'vue3-simple-wordeditor/dist/style.css'

const content = ref('')
const theme = ref<'light' | 'dark' | 'auto'>('light')
</script>
```

## 主题

支持三种主题模式：亮色、暗色、跟随系统。

### 使用方式

通过 `theme` prop 控制：

```vue
<!-- 亮色主题（默认） -->
<VueWordEditor theme="light" />

<!-- 暗色主题 -->
<VueWordEditor theme="dark" />

<!-- 跟随系统 -->
<VueWordEditor theme="auto" />
```

### 自定义主题

通过 CSS 变量覆盖默认颜色。CSS 变量定义在 `.vue-word-editor` 作用域内。详见[样式自定义](#css-变量方式推荐)章节。

## 国际化（i18n）

编辑器内置国际化支持，默认提供中文（zh-CN）和英文（en-US）两种语言包，并开放接口允许用户自定义其他语言。

### Props

| 属性     | 类型                          | 默认值     | 说明       |
| -------- | ----------------------------- | ---------- | ---------- |
| `locale` | `'zh-CN' \| 'en-US' \| string` | `'zh-CN'` | 语言设置 |

### 使用方式

通过 `locale` prop 切换语言：

```vue
<template>
  <Vue3SimpleWordEditor v-model="content" locale="en-US" />
</template>
```

### 自定义语言包

> 完整的自定义语言包教程（包括完整示例、日语/韩语语言包、类型定义、高级用法、常见问题）请查看 [LOCALE_GUIDE.md](./LOCALE_GUIDE.md)。

### 导出

```typescript
import {
  useI18n,        // 国际化 composable
  registerLocale, // 注册自定义语言包
  zhCN,           // 中文语言包
  enUS,           // 英文语言包
} from 'vue3-simple-wordeditor'
import type { LocaleMessages, Locale } from 'vue3-simple-wordeditor'
```

## 样式自定义

### CSS 变量方式（推荐）

所有颜色、阴影、圆角、字体都通过 CSS 变量控制，覆盖即可自定义。编辑器所有组件（包括图片裁剪、缩放等）的样式均已通过 CSS 变量暴露，无需侵入式修改。

#### 亮色主题变量

| CSS 变量                     | 默认值                              | 说明                |
| -------------------------- | -------------------------------- | ----------------- |
| `--editor-primary-color`   | `#3b82f6`                        | 主色（按钮激活态、链接、边框高亮） |
| `--editor-primary-hover`   | `#2563eb`                        | 主色悬停态             |
| `--editor-border-color`    | `#e5e7eb`                        | 边框颜色              |
| `--editor-bg-color`        | `#ffffff`                        | 背景色               |
| `--editor-text-color`      | `#1f2937`                        | 文字颜色              |
| `--editor-text-secondary`  | `#6b7280`                        | 次要文字颜色            |
| `--editor-toolbar-bg`      | `#f3f4f6`                        | 工具栏背景色            |
| `--editor-danger-color`    | `#ef4444`                        | 危险操作颜色（删除按钮）      |
| `--editor-danger-hover`    | `#fee2e2`                        | 危险操作悬停背景          |
| `--editor-selection-color` | `#4a90d9`                        | 选中区域颜色            |
| `--editor-mask-color`      | `rgba(0,0,0,0.5)`                | 裁剪遮罩颜色            |
| `--editor-shadow`          | `0 1px 3px rgba(0,0,0,0.1)`      | 普通阴影              |
| `--editor-shadow-lg`       | `0 4px 6px -1px rgba(0,0,0,0.1)` | 大阴影（弹出层）          |
| `--editor-radius`          | `0.5rem`                         | 圆角大小              |
| `--editor-font-family`     | `-apple-system, ...`             | 字体                |

#### 暗色主题变量

暗色主题通过以下选择器触发：

- `.vue-word-editor.dark`
- `.vue-word-editor[data-theme="dark"]`
- `.dark .vue-word-editor`

暗色主题默认值：

| CSS 变量                     | 暗色默认值                            |
| -------------------------- | -------------------------------- |
| `--editor-primary-color`   | `#60a5fa`                        |
| `--editor-primary-hover`   | `#93bbfd`                        |
| `--editor-border-color`    | `#374151`                        |
| `--editor-bg-color`        | `#1f2937`                        |
| `--editor-text-color`      | `#f3f4f6`                        |
| `--editor-text-secondary`  | `#9ca3af`                        |
| `--editor-toolbar-bg`      | `#111827`                        |
| `--editor-danger-color`    | `#f87171`                        |
| `--editor-danger-hover`    | `#7f1d1d`                        |
| `--editor-selection-color` | `#60a5fa`                        |
| `--editor-mask-color`      | `rgba(0,0,0,0.6)`                |
| `--editor-shadow`          | `0 1px 3px rgba(0,0,0,0.3)`      |
| `--editor-shadow-lg`       | `0 4px 6px -1px rgba(0,0,0,0.4)` |

#### 自定义示例

```css
/* 覆盖亮色主题变量 */
.vue-word-editor {
  --editor-primary-color: #8b5cf6;
  --editor-border-color: #d1d5db;
  --editor-radius: 0.25rem;
  --editor-font-family: 'Noto Sans SC', sans-serif;
}

/* 覆盖暗色主题变量 */
.vue-word-editor.dark {
  --editor-primary-color: #a78bfa;
  --editor-bg-color: #0f172a;
  --editor-toolbar-bg: #1e293b;
}
```

### CSS 工具类

编辑器使用以下 CSS 类，你可以覆盖它们来自定义样式。

> 完整的 CSS 类参考手册请查看 [CLASS_REFERENCE.md](./CLASS_REFERENCE.md)，包含所有组件的类名、用途和默认样式。

#### 自定义示例

```css
/* 修改工具栏按钮样式 */
.editor-btn-default {
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

/* 修改激活态按钮 */
.editor-btn-active {
  background-color: #8b5cf6;
  border-radius: 0.375rem;
}

/* 修改下拉选择框 */
.editor-select {
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
}

/* 修改图片裁剪框手柄颜色 */
.crop-handle {
  background: #8b5cf6;
  border-color: #6d28d9;
}

/* 修改裁剪遮罩透明度 */
.crop-mask {
  background: rgba(0, 0, 0, 0.4);
}
```

### 编辑器内容区域样式

编辑器内容区域使用 `.tiptap` 类，内部元素样式如下：

| 选择器                          | 说明                                      |
| ---------------------------- | --------------------------------------- |
| `.tiptap`                    | 编辑器内容容器，设置 `color` 和 `background-color` |
| `.tiptap h1` \~ `.tiptap h6` | 标题样式                                    |
| `.tiptap p`                  | 段落样式                                    |
| `.tiptap ul` / `.tiptap ol`  | 列表样式                                    |
| `.tiptap li`                 | 列表项样式                                   |
| `.tiptap blockquote`         | 引用块样式                                   |
| `.tiptap a`                  | 链接样式                                    |
| `.tiptap mark`               | 高亮标记样式                                  |
| `.tiptap img`                | 图片样式                                    |
| `.tiptap img.wrap-left`      | 左环绕图片                                   |
| `.tiptap img.wrap-right`     | 右环绕图片                                   |
| `.tiptap img.block`          | 块级图片                                    |

#### 自定义示例

```css
/* 自定义引用块样式 */
.tiptap blockquote {
  border-left-width: 3px;
  border-left-color: #8b5cf6;
  font-style: italic;
}

/* 自定义标题样式 */
.tiptap h1 {
  font-size: 1.75em;
  border-bottom: 2px solid var(--editor-border-color);
  padding-bottom: 0.3em;
}
```

## 图片功能

### 插入图片

点击工具栏的图片按钮上传图片，或通过 API 插入：

```typescript
// 通过编辑器实例插入
editorRef.value.editor.commands.setDraggableImage({
  src: 'https://example.com/image.jpg',
  alt: '描述',
  width: 400,
})
```

### 图片布局

支持四种布局模式，通过 BubbleMenu 切换：

| 布局  | 类名           | 说明           |
| --- | ------------ | ------------ |
| 嵌入型 | `inline`     | 图片与文字同行      |
| 左环绕 | `wrap-left`  | 图片浮动在左侧，文字环绕 |
| 右环绕 | `wrap-right` | 图片浮动在右侧，文字环绕 |
| 块级  | `block`      | 图片独占一行，居中显示  |

### 图片裁剪

双击图片进入裁剪模式，支持：

- 拖动裁剪框移动位置
- 8 个方向手柄调整裁剪区域
- 点击图片外部确认裁剪
- Ctrl+Z 撤销裁剪

### 图片上传（外部处理）

由于这是富文本编辑器库，**不自动上传图片**。图片在本地以 base64 形式存储，外部项目需要在发布/提交时自行上传。

#### 1. 获取所有图片用于上传

通过组件 ref 直接调用暴露的方法：

```typescript
const editorRef = ref()

// 在发布时调用
const images = await editorRef.value.getImagesForUpload()
// images 是 ImageUploadItem[] 数组，包含：
// [
//   {
//     originalSrc: "data:image/png;base64,...",  // 原始src
//     base64Data: "data:image/png;base64,...", // 用于上传的数据（已裁剪）
//     crop: { x, y, width, height }           // 裁剪数据（如有）
//   },
//   ...
// ]
```

#### 2. 上传图片到服务器

获取图片后，用户自行实现上传逻辑（可使用任何上传方式）：

```typescript
// 辅助函数：将 base64 转为 Blob（自行实现）
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// 批量上传（自行实现）
const uploadResults = await Promise.all(
  images.map(async (img) => {
    const formData = new FormData()
    formData.append('file', dataURLtoBlob(img.base64Data))
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    return { originalSrc: img.originalSrc, url: result.url }
  })
)
```

#### 3. 替换编辑器中的图片为服务器 URL

上传完成后，调用组件方法替换图片 src：

```typescript
// 创建映射：旧src -> 新url
const srcMapping = new Map(
  uploadResults.map(r => [r.originalSrc, r.url])
)

// 一次性替换所有图片
editorRef.value.replaceMultipleImages(srcMapping)

// 获取最终 HTML（现在所有图片src都已是服务器URL）
const finalHTML = editorRef.value.getHTML()
```

#### 完整示例

```typescript
// 辅助函数：将 base64 转为 Blob（自行实现）
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

//发布文章
async function publishArticle() {
  const editorRef = ref()

  // 1. 获取所有图片
  const images = await editorRef.value.getImagesForUpload()

  if (images.length > 0) {
    // 2. 上传到服务器（自行实现）
    const uploadResults = await Promise.all(
      images.map(async (img) => {
        const formData = new FormData()
        formData.append('file', dataURLtoBlob(img.base64Data))
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const result = await res.json()
        return { originalSrc: img.originalSrc, url: result.url }
      })
    )

    // 3. 替换所有图片URL
    const srcMapping = new Map(uploadResults.map(r => [r.originalSrc, r.url]))
    editorRef.value.replaceMultipleImages(srcMapping)
  }

  // 4. 最终获取的完整内容（所有图片已是服务器URL）
  const finalHTML = editorRef.value.getHTML()//html(全样式)
  const finalJSON = editorRef.value.getJSON()//json(全样式)
  const finalMD = editorRef.value.getMarkdown()//markdown(纯文本推荐)

  // 5. 提交到后端
  await fetch('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ content: finalMD }),//finalHTML或者finalJSON
    headers: { 'Content-Type': 'application/json' }
  })
}
```

#### 关键说明

- **不自动上传**：插入图片时仅存储为 base64，不会自动触发上传
- **裁剪处理**：如果图片被裁剪过，上传的会是裁剪后的 base64 数据
- **批量替换**：可以一次性替换所有图片，也可以单独替换
- **编辑回显**：从服务器加载已发布的内容时，图片 src 已经是 URL，无需额外处理

### 图片调整

- 拖拽右下角手柄调整图片大小
- BubbleMenu 中滑块调整宽度（30-800px）

## 编辑器功能

### 文本格式

- **加粗**、*斜体*、<u>下划线</u>、~~删除线~~
- 标题 H1-H6（下拉选择）
- 字体选择（无衬线、衬线、等宽、微软雅黑、宋体、黑体、楷体）
- 字号选择（12px - 48px）
- 文字颜色（18 种预设 + 自定义颜色选择器）
- 背景高亮（12 种预设 + 自定义颜色选择器）

### 段落格式

- 左对齐、居中、右对齐、两端对齐
- 有序列表、无序列表
- 引用块

### 链接

- 插入链接（弹出输入框）
- 删除链接
- 点击已存在的链接可修改或取消

## TypeScript 类型

```typescript
import type {
  EditorConfig,
  ImageLayoutType,
  CropData,
  ImageAttributes,
  LinkData,
  FontStyle,
  ExportFormat,
  ImageUploadItem,
} from 'vue3-simple-wordeditor'
```

| 类型                | 说明                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `EditorConfig`    | 编辑器配置 `{ placeholder?, content?, editable? }`                                                                       |
| `ImageLayoutType` | 图片布局 `'inline' \| 'block' \| 'wrap-left' \| 'wrap-right'`                                                           |
| `CropData`        | 裁剪数据 `{ x: number; y: number; width: number; height: number }`                                                      |
| `ImageAttributes` | 图片属性 `{ src, alt?, title?, width?, height?, layout?, crop?, marginTop?, marginRight?, marginBottom?, marginLeft? }` |
| `LinkData`        | 链接数据 `{ href: string; target?: string }`                                                                            |
| `FontStyle`       | 字体样式 `{ family?, size?, weight?, color?, backgroundColor? }`                                                        |
| `ExportFormat`    | 导出格式 `'html' \| 'json' \| 'md' \| 'pdf' \| 'docx'`                                                                  |
| `ImageUploadItem` | 上传图片项 `{ originalSrc: string; base64Data: string; crop?: CropData }`                                                |

## 高级用法

### 使用 useEditor composable

```vue
<script setup lang="ts">
import { useEditor } from 'vue3-simple-wordeditor'

const {
  editor,
  isReady,
  isBold,
  isItalic,
  headingLevel,
  toggleBold,
  toggleItalic,
  setHeading,
  getHTML,
  setHTML,
} = useEditor({
  placeholder: '开始编辑...',
  content: '<p>初始内容</p>',
  editable: true,
})
</script>
```

### 使用 DraggableImage 扩展

```typescript
import { DraggableImage } from 'vue3-simple-wordeditor'
import { Editor } from '@tiptap/core'

const editor = new Editor({
  extensions: [
    StarterKit,
    DraggableImage,
    // ... 其他扩展
  ],
})
```

### 自定义编辑器实例

```vue
<script setup lang="ts">
import { Vue3SimpleWordEditor, useEditor } from 'vue3-simple-wordeditor'
import type { ImageAttributes } from 'vue3-simple-wordeditor'

// 通过 ref 访问编辑器实例
const editorRef = ref()

function insertImage() {
  editorRef.value.editor.commands.setDraggableImage({
    src: 'https://example.com/image.jpg',
    width: 300,
    layout: 'wrap-left',
  })
}

function getContent() {
  const html = editorRef.value.getHTML()
  console.log(html)
}
</script>
```

## 导出文档

编辑器支持多种格式导出，点击工具栏右侧的下载图标即可选择导出格式：

| 格式           | 说明                 |
| ------------ | ------------------ |
| HTML         | 导出完整的 HTML 文件，包含样式 |
| JSON         | 导出 TipTap JSON 格式  |
| Markdown     | 导出 Markdown 格式     |
| PDF          | 导出 PDF 文件（A4 格式）   |
| Word (.docx) | 导出 Word 文档         |

## JSON 导入

编辑器支持将导出的 JSON 数据或从服务器获取的 JSON 数据重新导入并显示为 HTML 内容。

### 基本用法

通过组件 `ref` 调用 `setJSON` 方法：

```typescript
const editorRef = ref()

// 从服务器获取 JSON 数据
async function loadFromServer() {
  const response = await fetch('/api/article/123')
  const data = await response.json()
  
  // 导入 JSON 数据到编辑器
  editorRef.value.setJSON(data.content)
}

// 导入本地 JSON 数据
function loadFromLocal() {
  const jsonData = {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Hello World"
          }
        ]
      }
    ]
  }
  
  editorRef.value.setJSON(jsonData)
}
```

### 详细教程

完整的 JSON 导入教程（包括从服务器获取数据、处理复杂内容、错误处理、性能优化等）请查看 [JSON_IMPORT_GUIDE.md](./JSON_IMPORT_GUIDE.md)。

### 使用 useExport composable

如果需要直接使用 `useExport`，需要传入组件实例（不是 editor 实例）：

```typescript
import { useExport } from 'vue3-simple-wordeditor'

const editorRef = ref()

// ✅ 正确：传入组件实例 ref
const { exportAs, getImagesForUpload, replaceMultipleImages, getHTML } = useExport(editorRef.value)

// ❌ 错误：传入 editor 实例本身
// const { ... } = useExport(editorRef.value.editor)
```

### 单独使用导出方法

```typescript
const {
  exportAs,       // 通用导出方法
  exportAsHTML,   // 导出 HTML
  exportAsJSON,  // 导出 JSON
  exportAsMD,    // 导出 Markdown
  exportAsPDF,   // 导出 PDF
  exportAsDocx,  // 导出 Word
  getHTML,       // 获取 HTML 内容
  getJSON,       // 获取 JSON 内容
  getMarkdown,   // 获取 Markdown 内容
  getImagesForUpload,    // 获取所有图片用于上传
  replaceMultipleImages,  // 批量替换图片 src
} = useExport(editorRef.value)
```

### 推荐：直接使用组件暴露的方法

更简单的方式是直接通过组件 ref 调用：

```typescript
const editorRef = ref()

// 直接调用，无需 useExport
const images = await editorRef.value.getImagesForUpload()
editorRef.value.replaceMultipleImages(srcMapping)
const html = editorRef.value.getHTML()
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build:lib

# 构建演示页面
npm run build
```

## 项目结构

```
src/
  components/
    VueWordEditor.vue      # 主编辑器组件
    EditorToolbar.vue       # 工具栏组件
    ImageNodeView.vue       # 图片节点视图（渲染、裁剪、缩放）
    ImageEditor.vue         # 图片裁剪弹窗（备用）
  composables/
    useEditor.ts            # 编辑器核心逻辑
  extensions/
    DraggableImage.ts       # 自定义图片 Node 扩展
  styles/
    editor.css              # 编辑器样式 + CSS 变量
  types/
    editor.ts               # TypeScript 类型定义
  utils/
    throttle.ts             # 节流工具函数
  index.ts                  # 库入口
```

