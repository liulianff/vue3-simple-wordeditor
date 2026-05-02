# vue3-simple-wordeditor

基于 Vue 3 + TipTap 3 构建的富文本编辑器组件，支持图片编辑、亮暗主题、样式自定义。

***

## 功能特性

- ✅ **文本格式**：加粗、斜体、下划线、删除线，选中文本时工具栏按钮自动高亮
- ✅ **标题**：H1 - H6
- ✅ **对齐**：左对齐、居中、右对齐、两端对齐
- ✅ **列表**：有序、无序列表
- ✅ **引用**：引用块
- ✅ **图片**：插入、裁剪、缩放、布局（左环绕、右环绕、居中）
- ✅ **颜色**：文字颜色、背景高亮
- ✅ **表格**：插入、行列增删、合并拆分单元格、表头切换、右键菜单编辑
- ✅ **导出**：HTML、JSON、Markdown、PDF、Word (docx)
- ✅ **主题**：亮色、暗色、跟随系统
- ✅ **预览**：独立的预览组件（支持内联模式），编辑与导出样式统一
- ✅ **国际化**：中文、英文（可扩展）

***

## 快速开始

### 安装

```bash
npm install vue3-simple-wordeditor
```

### 基本使用

**方式一：npm 包引用（推荐）**

```vue
<template>
  <VueWordEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue3-simple-wordeditor'
import 'vue3-simple-wordeditor/dist/vue3-simple-wordeditor.css'

const content = ref('')
</script>
```

**方式二：本地路径引用（推荐用于本地开发）**

如果这个项目在本地，你可以在 `package.json` 中直接引用本地路径：

```json
{
  "dependencies": {
    "vue3-simple-wordeditor": "file:///D:/.../VueEditorTools"
  }
}
```

<br />

```bash
npm install
```

然后正常使用：

```vue
<template>
  <VueWordEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue3-simple-wordeditor'
import 'vue3-simple-wordeditor/dist/vue3-simple-wordeditor.css'

const content = ref('')
</script>
```

**方式三：本地源码直接引用**

如果你把这个项目作为子目录在你的项目中，可以直接引用源码：

```vue
<template>
  <VueWordEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from '.../VueEditorTools/src/components/VueWordEditor.vue'
import '.../VueEditorTools/src/styles/editor.css'

const content = ref('')
</script>
```

### 编辑器与预览并排

```vue
<template>
  <div class="grid">
    <VueWordEditor v-model="content" :theme="theme" />
    <EditorPreview :html="content" :theme="theme" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueWordEditor, EditorPreview } from 'vue3-simple-wordeditor'

const content = ref('')
const theme = ref<'light' | 'dark' | 'auto'>('light')
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
</style>
```

***

## 组件 API

### VueWordEditor

| 属性            | 类型                             | 默认值       | 说明          |
| ------------- | ------------------------------ | --------- | ----------- |
| `modelValue`  | `string`                       | `''`      | 编辑器 HTML 内容 |
| `placeholder` | `string`                       | `''`      | 占位符文本       |
| `editable`    | `boolean`                      | `true`    | 是否可编辑       |
| `theme`       | `'light' \| 'dark' \| 'auto'`  | `'light'` | 主题设置        |
| `locale`      | `'zh-CN' \| 'en-US' \| string` | `'zh-CN'` | 语言设置        |

| 方法                                | 说明               |
| --------------------------------- | ---------------- |
| `getHTML()`                       | 获取当前 HTML 内容     |
| `getJSON()`                       | 获取当前 JSON 内容     |
| `getMarkdown()`                   | 获取当前 Markdown 内容 |
| `setHTML(html)`                   | 设置 HTML 内容       |
| `setJSON(json)`                   | 设置 JSON 内容       |
| `getImagesForUpload()`            | 获取所有图片用于上传       |
| `replaceImageSrc(oldSrc, newSrc)` | 替换单个图片 URL       |
| `replaceMultipleImages(mapping)`  | 批量替换图片 URL       |

### EditorPreview

| 属性       | 类型                            | 默认值       | 说明                   |
| -------- | ----------------------------- | --------- | -------------------- |
| `html`   | `string`                      | -         | 要显示的 HTML 内容         |
| `theme`  | `'light' \| 'dark' \| 'auto'` | `'light'` | 主题设置                 |
| `inline` | `boolean`                     | `false`   | 内联模式，不渲染外层容器（用于嵌入弹窗） |

***

## 文档目录

详细文档请查看：

| 文档                                                             | 说明          |
| -------------------------------------------------------------- | ----------- |
| [docsmd/STYLING\_GUIDE.md](./docsmd/STYLING_GUIDE.md)          | 样式自定义指南 ⭐   |
| [docsmd/TABLE\_GUIDE.md](./docsmd/TABLE_GUIDE.md)              | 表格编辑教程 ⭐    |
| [docsmd/PREVIEW\_COMPONENT.md](./docsmd/PREVIEW_COMPONENT.md)  | 预览组件完整指南    |
| [docsmd/USAGE\_GUIDE.md](./docsmd/USAGE_GUIDE.md)              | 完整使用指南      |
| [docsmd/JSON\_IMPORT\_GUIDE.md](./docsmd/JSON_IMPORT_GUIDE.md) | JSON 导入教程   |
| [docsmd/LOCALE\_GUIDE.md](./docsmd/LOCALE_GUIDE.md)            | 国际化和自定义语言包  |
| [docsmd/CLASS\_REFERENCE.md](./docsmd/CLASS_REFERENCE.md)      | 所有 CSS 类名参考 |

***

## 样式自定义（快速）

使用 CSS 变量（最推荐）：

```vue
<style>
.vue-word-editor {
  --editor-primary-color: #8b5cf6;
  --editor-primary-hover: #a78bfa;
  --editor-bg-color: #faf5ff;
  --editor-toolbar-bg: #f3e8ff;
  --editor-border-color: #ddd6fe;
}
</style>
```

完整的样式教程请参考 [docsmd/STYLING\_GUIDE.md](./docsmd/STYLING_GUIDE.md)

***

## 表格编辑

### 插入表格

鼠标悬停在工具栏的表格图标上，会弹出一个 8×10 的网格选择器。拖动鼠标选择所需的行数和列数（如 3×4），点击即可插入表格。

### 编辑表格

**方式一：表格控制按钮**

表格下方会显示两个按钮：

- ＋ 蓝色按钮：在表格末尾添加新行
- ＿ 红色按钮：删除当前行

**方式二：右键上下文菜单**

在表格单元格中右键，会弹出编辑菜单，支持：

- 在左侧/右侧插入列
- 在上方/下方插入行
- 删除行/列
- 合并/拆分单元格
- 切换表头行/列
- 删除整个表格

**方式三：键盘快捷键**

- 选中整个表格后，按 `Backspace` 键可删除表格

### 自定义表格样式

使用 CSS 变量自定义表格外观：

```vue
<style>
.vue-word-editor {
  --editor-border-color: #d1d5db;
  --editor-toolbar-bg: #f1f3f5;
}
</style>
```

***

## 导出

### 通过组件 ref 获取

```typescript
const editorRef = ref()
const html = editorRef.value.getHTML()
const json = await editorRef.value.getJSON()
const md = await editorRef.value.getMarkdown()
```

### 通过 useExport 组合函数

```typescript
import { useExport } from 'vue3-simple-wordeditor'

const editor = useEditor({ ... })  // editor 是 ShallowRef
const {
  exportAsHTML,
  exportAsJSON,
  exportAsPDF,
  exportAsDocx,
  getJSON,
  getMarkdown,
  getHTML,
} = useExport(editor)

const html = getHTML()
const json = await getJSON()
await exportAsPDF()
```

***

## 图片裁剪

### 进入裁剪模式

**悬浮菜单方式**：选中图片 → 点击 BubbleMenu 中的裁剪按钮 → 进入裁剪模式 → BubbleMenu 切换为裁剪工具栏。

**双击方式**：直接双击编辑器中的图片进入裁剪模式。

### 裁剪操作

进入裁剪模式后，图片上会覆盖半透明遮罩和白色裁剪框：

- **拖拽调整**：拖拽裁剪框四角和边缘的 8 个手柄调整范围
- **拖拽移动**：拖拽裁剪框内部移动位置

BubbleMenu 会显示三个按钮：

| 按钮   | 说明         |
| ---- | ---------- |
| 重置裁剪 | 恢复裁剪框到完整图片 |
| 取消   | 退出裁剪，不保存   |
| 确认裁剪 | 保存裁剪结果并退出  |

点击裁剪区域外部也会自动确认裁剪。

***

## 图片上传（外部处理）

由于这是富文本编辑器库，**不自动上传图片**。图片在本地以 base64 形式存储，外部项目需要在发布/提交时自行上传。

### 1. 获取所有图片用于上传

通过组件 ref 直接调用暴露的方法：

```typescript
const editorRef = ref()

// 在发布时调用
const images = await editorRef.value.getImagesForUpload()
// images 是 ImageUploadItem[] 数组，包含：
// [
//   {
//     tempId: "img-...",                        // 临时 ID
//     originalSrc: "data:image/png;base64,...",  // 原始 src
//     base64Data: "data:image/png;base64,...",   // 用于上传的数据（已裁剪）
//   },
//   ...
// ]
```

### 2. 上传图片到服务器

获取图片后，用户自行实现上传逻辑（可使用任何上传方式）：

```typescript
// 辅助函数：将 base64 转为 Blob
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

// 批量上传
const uploadResults = await Promise.all(
  images.map(async (img) => {
    const formData = new FormData()
    formData.append('file', dataURLtoBlob(img.base64Data))
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    return { tempId: img.tempId, url: result.url }
  })
)
```

### 3. 替换编辑器中的图片为服务器 URL

上传完成后，调用组件方法替换图片 src：

```typescript
// 创建映射：tempId -> 新 url
const srcMapping = new Map(
  uploadResults.map(r => [r.tempId, r.url])
)

// 一次性替换所有图片
editorRef.value.replaceMultipleImages(srcMapping)

// 获取最终 HTML（现在所有图片 src 都已是服务器 URL）
const finalHTML = editorRef.value.getHTML()
```

### 完整示例

```typescript
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

// 发布文章
async function publishArticle() {
  const editorRef = ref()

  // 1. 获取所有图片
  const images = await editorRef.value.getImagesForUpload()

  if (images.length > 0) {
    // 2. 上传到服务器
    const uploadResults = await Promise.all(
      images.map(async (img) => {
        const formData = new FormData()
        formData.append('file', dataURLtoBlob(img.base64Data))
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const result = await res.json()
        return { tempId: img.tempId, url: result.url }
      })
    )

    // 3. 替换所有图片 URL
    const srcMapping = new Map(uploadResults.map(r => [r.tempId, r.url]))
    editorRef.value.replaceMultipleImages(srcMapping)
  }

  // 4. 获取最终内容（所有图片已是服务器 URL）
  const finalHTML = editorRef.value.getHTML()       // HTML（全样式）
  const finalJSON = await editorRef.value.getJSON()  // JSON（全样式）
  const finalMD = await editorRef.value.getMarkdown() // Markdown（纯文本推荐）

  // 5. 提交到后端
  await fetch('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ content: finalMD }), // finalHTML 或 finalJSON
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### 关键说明

- **不自动上传**：插入图片时仅存储为 base64，不会自动触发上传
- **裁剪处理**：如果图片被裁剪过，上传的会是裁剪后的 base64 数据
- **批量替换**：通过 `replaceMultipleImages(mapping)` 一次性替换所有图片
- **单独替换**：也可使用 `replaceImageSrc(oldSrc, newSrc)` 逐个替换
- **编辑回显**：从服务器加载已发布的内容时，图片 src 已经是 URL，无需额外处理

***

## 开发

```bash
npm install
npm run dev
npm run build:lib
```

***

## License

[MIT License](./LICENSE)
