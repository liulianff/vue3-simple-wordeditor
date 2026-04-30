# 样式自定义指南

本文档详细介绍如何自定义 vue3-simple-wordeditor 的样式。

## 目录

- [CSS 变量（推荐）](#css-变量推荐)
  - [基础使用（亮色主题）](#基础使用亮色主题)
  - [同时自定义亮色和暗色主题](#同时自定义亮色和暗色主题)
- [亮色主题变量](#亮色主题变量)
- [暗色主题变量](#暗色主题变量)
- [覆盖特定组件样式](#覆盖特定组件样式)
- [内容区域样式](#内容区域样式)
- [表格样式](#表格样式)
- [CSS 类名参考](#css-类名参考)
- [常见问题](#常见问题)

***

## CSS 变量（推荐）

所有样式都通过 CSS 变量控制，这是最简单、最推荐的方式！

### 基础使用（亮色主题）

```vue
<template>
  <VueWordEditor 
    v-model="content"
    class="custom-editor" 
  />
</template>

<style>
.custom-editor {
  --editor-primary-color: #8b5cf6;
  --editor-primary-hover: #a78bfa;
  --editor-bg-color: #faf5ff;
  --editor-toolbar-bg: #f3e8ff;
  --editor-border-color: #ddd6fe;
  --editor-text-color: #1f2937;
  --editor-text-secondary: #6d28d9;
  --editor-radius: 0.5rem;
}
</style>
```

### 同时自定义亮色和暗色主题

编辑器通过 `theme` 属性控制主题。当 `theme="dark"` 或 `theme="auto"` 时，根容器会自动添加 `.dark` class。因此你只需针对 `.dark` 选择器覆盖变量即可：

```vue
<template>
  <VueWordEditor 
    v-model="content"
    class="custom-editor"
    theme="auto"
  />
</template>

<style>
/* 亮色主题 */
.custom-editor {
  --editor-primary-color: #8b5cf6;
  --editor-primary-hover: #a78bfa;
  --editor-bg-color: #faf5ff;
  --editor-toolbar-bg: #f3e8ff;
  --editor-border-color: #ddd6fe;
  --editor-text-color: #1f2937;
  --editor-text-secondary: #6d28d9;
  --editor-radius: 0.5rem;
}

/* 暗色主题 — .dark 由 theme 属性自动添加 */
.custom-editor.dark {
  --editor-primary-color: #a78bfa;
  --editor-primary-hover: #c4b5fd;
  --editor-bg-color: #1a1025;
  --editor-toolbar-bg: #0f0a19;
  --editor-border-color: #3b2d50;
  --editor-text-color: #e8e0f0;
  --editor-text-secondary: #9b8ab8;
  --editor-radius: 0.5rem;
}
</style>
```

> **原理：** `theme="dark"` 时，根容器渲染为 `<div class="vue-word-editor dark">`；`theme="auto"` 时跟随系统 `prefers-color-scheme`。变量值的变化会自动传递给所有子组件。

***

## 亮色主题变量

| 变量名                        | 默认值                              | 说明               |
| -------------------------- | -------------------------------- | ---------------- |
| `--editor-primary-color`   | `#3b82f6`                        | 主色（按钮激活、链接、边框高亮） |
| `--editor-primary-hover`   | `#2563eb`                        | 主色悬停态            |
| `--editor-border-color`    | `#e5e7eb`                        | 边框颜色             |
| `--editor-bg-color`        | `#ffffff`                        | 背景色              |
| `--editor-text-color`      | `#1f2937`                        | 文本颜色             |
| `--editor-text-secondary`  | `#6b7280`                        | 次要文本颜色           |
| `--editor-toolbar-bg`      | `#f9fafb`                        | 工具栏背景色           |
| `--editor-danger-color`    | `#ef4444`                        | 危险操作颜色（删除按钮）     |
| `--editor-danger-hover`    | `#fee2e2`                        | 危险操作悬停           |
| `--editor-selection-color` | `#4a90d9`                        | 选中区域颜色           |
| `--editor-mask-color`      | `rgba(0,0,0,0.5)`                | 遮罩颜色             |
| `--editor-shadow`          | `0 1px 3px rgba(0,0,0,0.1)`      | 普通阴影             |
| `--editor-shadow-lg`       | `0 4px 6px -1px rgba(0,0,0,0.1)` | 大阴影              |
| `--editor-radius`          | `0.5rem`                         | 圆角               |
| `--editor-font-family`     | `-apple-system,...`              | 字体族              |

***

## 暗色主题变量

| 变量名                        | 暗色默认值                            |
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

***

## 覆盖特定组件样式

### 工具栏按钮样式

```css
.editor-button {
  border-radius: 8px;
  padding: 6px;
}

.editor-btn-active {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
```

### 下拉选择器样式

```css
.editor-select {
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
}
```

### 图片裁剪样式

```css
/* 裁剪控制点 */
.crop-handle {
  background-color: #8b5cf6;
  border-color: #6d28d9;
}

/* 裁剪遮罩 */
.crop-mask {
  background: rgba(0, 0, 0, 0.4);
}
```

### 气泡菜单样式

```css
.bubble-menu {
  background-color: #1f2937;
  border-radius: 8px;
  padding: 4px;
}
```

***

## 内容区域样式

内容区域使用 `.tiptap` 类名，你可以完全自定义富文本内容的样式。

### 标题样式

```css
.tiptap h1 {
  font-size: 2em;
  font-weight: bold;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.tiptap h2 {
  font-size: 1.5em;
  font-weight: bold;
}
```

### 段落样式

```css
.tiptap p {
  margin: 0.5em 0;
  line-height: 1.8;
}
```

### 引用块样式

```css
.tiptap blockquote {
  border-left: 4px solid #8b5cf6;
  padding-left: 1rem;
  margin: 1em 0;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
}
```

### 列表样式

```css
.tiptap ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.tiptap ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.tiptap li {
  margin: 0.25em 0;
  list-style-position: inside;
}

.tiptap li > p {
  display: inline;
  margin: 0;
}
```

### 图片布局样式

```css
/* 左环绕 */
.tiptap img.wrap-left {
  float: left;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

/* 右环绕 */
.tiptap img.wrap-right {
  float: right;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
}

/* 块级居中 */
.tiptap img.block {
  display: block;
  margin: 1em auto;
}
```

### 文本格式样式

```css
.tiptap strong {
  font-weight: bold;
}

.tiptap em {
  font-style: italic;
}

.tiptap u {
  text-decoration: underline;
}

.tiptap s {
  text-decoration: line-through;
}

.tiptap mark {
  background-color: #fef08a;
  padding: 0 0.2em;
}
```

***

## 表格样式

表格样式通过 CSS 变量控制，暗色主题下会自动跟随主题切换，无需额外编写 `.dark` 选择器。

### 表格相关 CSS 变量

所有表格样式复用通用 CSS 变量：

| 变量名                       | 用途                | 亮色默认值     | 暗色默认值     |
| ------------------------- | ----------------- | --------- | --------- |
| `--editor-border-color`   | 表格边框、菜单分隔线        | `#e5e7eb` | `#374151` |
| `--editor-bg-color`       | 控制按钮背景、网格单元格背景    | `#ffffff` | `#1f2937` |
| `--editor-text-color`     | 菜单项文本             | `#1f2937` | `#f3f4f6` |
| `--editor-text-secondary` | 控制按钮颜色、网格标签       | `#6b7280` | `#9ca3af` |
| `--editor-primary-color`  | 悬停高亮、网格选中、上下文菜单悬停 | `#3b82f6` | `#60a5fa` |
| `--editor-danger-color`   | 删除按钮、危险操作         | `#ef4444` | `#f87171` |
| `--editor-toolbar-bg`     | 表头背景色             | `#f1f3f5` | `#111827` |

### 自定义表格样式示例

```vue
<style>
.my-editor {
  --editor-primary-color: #8b5cf6;
  --editor-danger-color: #ec4899;
  --editor-border-color: #ddd6fe;
  --editor-toolbar-bg: #f3e8ff;
}
</style>
```

所有表格相关类名（`.table-control-btn`、`.table-menu-item`、`.table-grid-picker-cell` 等）都通过 CSS 变量自动跟随主题，无需为单个组件编写 `.dark` 选择器。只需覆盖顶层变量即可生效。

***

## CSS 类名参考

查看所有可用的 CSS 类名及其默认样式，请参考 [CLASS\_REFERENCE.md](./CLASS_REFERENCE.md)。

> **提示：** 所有组件样式都基于 CSS 变量。暗色主题通过根容器 `.vue-word-editor.dark` 切换变量值，子组件自动跟随，无需为单个组件编写 `.dark` 规则。

***

## 常见问题

### Q: 我的自定义样式被覆盖了怎么办？

**A:** 使用 scoped CSS 时，需要用 `:deep()`：

```vue
<style scoped>
/* ✅ 正确 */
:deep(.tiptap) blockquote {
  border-left-color: #8b5cf6;
}

/* ❌ 错误（会变成 .tiptap[data-v-xxx] blockquote）*/
.tiptap blockquote {
  border-left-color: #8b5cf6;
}
</style>
```

### Q: 如何在 EditorPreview 组件中应用同样的样式？

**A:** EditorPreview 组件也使用相同的 CSS 变量，同样的方式覆盖即可：

```vue
<template>
  <EditorPreview 
    :html="content" 
    class="custom-preview"
  />
</template>

<style>
.custom-preview {
  --editor-primary-color: #8b5cf6;
  /* ... 其他变量 */
}
</style>
```

### Q: 如何完全自定义主题？

**A:** 可以创建自己的主题 CSS 文件，然后在组件中使用：

```vue
<template>
  <VueWordEditor 
    v-model="content"
    class="my-theme"
    :theme="currentTheme"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueWordEditor } from 'vue3-simple-wordeditor'

const content = ref('')
const currentTheme = ref<'light' | 'dark' | 'auto'>('auto')
</script>

<style>
/* 亮色主题 */
.vue-word-editor.my-theme {
  --editor-primary-color: #f472b6;
  --editor-primary-hover: #ec4899;
  --editor-bg-color: #fdf2f8;
  --editor-border-color: #fbcfe8;
  --editor-text-color: #1f2937;
}

/* 暗色主题 */
.vue-word-editor.my-theme.dark {
  --editor-primary-color: #f9a8d4;
  --editor-primary-hover: #f472b6;
  --editor-bg-color: #1a0a12;
  --editor-border-color: #4a1930;
  --editor-text-color: #fce7f3;
}
</style>
```

> **说明：** 设置 `theme="auto"` 会自动跟随系统主题，`.dark` class 会在暗色模式下自动添加。也可以通过 `:theme` 动态切换 `'light'` / `'dark'` / `'auto'`。

***

## 完整示例

这是一个同时自定义亮色和暗色主题的完整示例：

```vue
<template>
  <div class="my-custom-editor">
    <VueWordEditor 
      v-model="content" 
      theme="auto" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueWordEditor } from 'vue3-simple-wordeditor'

const content = ref('')
</script>

<style>
/* 亮色主题 */
.my-custom-editor .vue-word-editor {
  --editor-primary-color: #ec4899;
  --editor-primary-hover: #f472b6;
  --editor-bg-color: #fdf2f8;
  --editor-toolbar-bg: #fce7f3;
  --editor-border-color: #fbcfe8;
  --editor-text-color: #1f2937;
  --editor-text-secondary: #be185d;
  --editor-radius: 0.75rem;
}

/* 暗色主题 */
.my-custom-editor .vue-word-editor.dark {
  --editor-primary-color: #f9a8d4;
  --editor-primary-hover: #f472b6;
  --editor-bg-color: #1a0a12;
  --editor-toolbar-bg: #0f0509;
  --editor-border-color: #4a1930;
  --editor-text-color: #fce7f3;
  --editor-text-secondary: #f9a8d4;
  --editor-radius: 0.75rem;
}

/* 自定义内容样式（亮色+暗色均生效） */
.my-custom-editor :deep(.tiptap) h1 {
  border-bottom-color: var(--editor-primary-color);
}

.my-custom-editor :deep(.tiptap) blockquote {
  border-left-color: var(--editor-primary-color);
  background-color: var(--editor-toolbar-bg);
}
</style>
```

