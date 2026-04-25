# vue3-simple-wordeditor

基于 Vue 3 + TipTap 3 构建的富文本编辑器组件，支持图片编辑、亮暗主题、样式自定义。

***

## 功能特性

- ✅ **文本格式**：加粗、斜体、下划线、删除线
- ✅ **标题**：H1 - H6
- ✅ **对齐**：左对齐、居中、右对齐、两端对齐
- ✅ **列表**：有序、无序列表
- ✅ **引用**：引用块
- ✅ **图片**：插入、裁剪、缩放、布局（左环绕、右环绕、居中）
- ✅ **导出**：HTML、JSON、Markdown、PDF、Word (docx)
- ✅ **主题**：亮色、暗色、跟随系统
- ✅ **预览**：独立的预览组件，保证编辑预览一致
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

如果你对源码有改动

```bash
npm run build:lib
```

### 基本使用

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

| 属性            | 类型                             | 默认值         | 说明          |
| ------------- | ------------------------------ | ----------- | ----------- |
| `modelValue`  | `string`                       | `''`        | 编辑器 HTML 内容 |
| `placeholder` | `string`                       | `'开始编辑...'` | 占位符文本       |
| `editable`    | `boolean`                      | `true`      | 是否可编辑       |
| `theme`       | `'light' \| 'dark' \| 'auto'`  | `'light'`   | 主题设置        |
| `locale`      | `'zh-CN' \| 'en-US' \| string` | `'zh-CN'`   | 语言设置        |

| 方法                               | 说明           |
| -------------------------------- | ------------ |
| `getHTML()`                      | 获取当前 HTML 内容 |
| `setHTML(html)`                  | 设置 HTML 内容   |
| `setJSON(json)`                  | 设置 JSON 内容   |
| `getImagesForUpload()`           | 获取所有图片用于上传   |
| `replaceMultipleImages(mapping)` | 批量替换图片 URL   |

### EditorPreview

| 属性      | 类型                            | 默认值       | 说明           |
| ------- | ----------------------------- | --------- | ------------ |
| `html`  | `string`                      | -         | 要显示的 HTML 内容 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | 主题设置         |

***

## 文档目录

详细文档请查看：

| 文档                                                             | 说明          |
| -------------------------------------------------------------- | ----------- |
| [docsMD/STYLING\_GUIDE.md](./docsMD/STYLING_GUIDE.md)          | 样式自定义指南 ⭐   |
| [docsMD/PREVIEW\_COMPONENT.md](./docsMD/PREVIEW_COMPONENT.md)  | 预览组件完整指南    |
| [docsMD/USAGE\_GUIDE.md](./docsMD/USAGE_GUIDE.md)              | 完整使用指南      |
| [docsMD/JSON\_IMPORT\_GUIDE.md](./docsMD/JSON_IMPORT_GUIDE.md) | JSON 导入教程   |
| [docsMD/LOCALE\_GUIDE.md](./docsMD/LOCALE_GUIDE.md)            | 国际化和自定义语言包  |
| [docsMD/CLASS\_REFERENCE.md](./docsMD/CLASS_REFERENCE.md)      | 所有 CSS 类名参考 |

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

完整的样式教程请参考 [docsMD/STYLING\_GUIDE.md](./docsMD/STYLING_GUIDE.md)

***

## 导出

```typescript
import { useExport } from 'vue3-simple-wordeditor'

const {
  exportAsHTML,
  exportAsJSON,
  exportAsPDF,
  exportAsDocx,
  exportAsMarkdown,
} = useExport(editorRef.value)

await exportAsPDF()
```

***

## 图片上传

```typescript
const images = await editorRef.value.getImagesForUpload()

// 上传逻辑...

const mapping = new Map(images.map((img, i) => [
  img.tempId,
  `https://example.com/image-${i}.png`
]))

editorRef.value.replaceMultipleImages(mapping)
```

***

## 开发

```bash
npm install
npm run dev
npm run build:lib
```

***

## License

MIT
