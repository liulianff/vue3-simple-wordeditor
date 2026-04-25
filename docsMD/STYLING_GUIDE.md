# 样式自定义指南

本文档详细介绍如何自定义 vue3-simple-wordeditor 的样式。

## 目录

- [CSS 变量（推荐）](#css-变量推荐)
- [亮色主题变量](#亮色主题变量)
- [暗色主题变量](#暗色主题变量)
- [覆盖特定组件样式](#覆盖特定组件样式)
- [内容区域样式](#内容区域样式)
- [常见问题](#常见问题)

---

## CSS 变量（推荐）

所有样式都通过 CSS 变量控制，这是最简单、最推荐的方式！

### 基础使用

```vue
<template>
  <VueWordEditor 
    v-model="content"
    class="custom-editor" 
  />
</template>

<style>
.custom-editor {
  /* 主色 */
  --editor-primary-color: #8b5cf6;
  --editor-primary-hover: #a78bfa;
  
  /* 背景色 */
  --editor-bg-color: #faf5ff;
  --editor-toolbar-bg: #f3e8ff;
  
  /* 边框 */
  --editor-border-color: #ddd6fe;
  
  /* 文本 */
  --editor-text-color: #1f2937;
  --editor-text-secondary: #6d28d9;
  
  /* 圆角 */
  --editor-radius: 0.5rem;
}
</style>
```

---

## 亮色主题变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--editor-primary-color` | `#3b82f6` | 主色（按钮激活、链接、边框高亮） |
| `--editor-primary-hover` | `#2563eb` | 主色悬停态 |
| `--editor-border-color` | `#e5e7eb` | 边框颜色 |
| `--editor-bg-color` | `#ffffff` | 背景色 |
| `--editor-text-color` | `#1f2937` | 文本颜色 |
| `--editor-text-secondary` | `#6b7280` | 次要文本颜色 |
| `--editor-toolbar-bg` | `#f9fafb` | 工具栏背景色 |
| `--editor-danger-color` | `#ef4444` | 危险操作颜色（删除按钮） |
| `--editor-danger-hover` | `#fee2e2` | 危险操作悬停 |
| `--editor-selection-color` | `#4a90d9` | 选中区域颜色 |
| `--editor-mask-color` | `rgba(0,0,0,0.5)` | 遮罩颜色 |
| `--editor-shadow` | `0 1px 3px rgba(0,0,0,0.1)` | 普通阴影 |
| `--editor-shadow-lg` | `0 4px 6px -1px rgba(0,0,0,0.1)` | 大阴影 |
| `--editor-radius` | `0.5rem` | 圆角 |
| `--editor-font-family` | `-apple-system,...` | 字体族 |

---

## 暗色主题变量

| 变量名 | 暗色默认值 |
|--------|------------|
| `--editor-primary-color` | `#60a5fa` |
| `--editor-primary-hover` | `#93bbfd` |
| `--editor-border-color` | `#374151` |
| `--editor-bg-color` | `#1f2937` |
| `--editor-text-color` | `#f3f4f6` |
| `--editor-text-secondary` | `#9ca3af` |
| `--editor-toolbar-bg` | `#111827` |
| `--editor-danger-color` | `#f87171` |
| `--editor-danger-hover` | `#7f1d1d` |
| `--editor-selection-color` | `#60a5fa` |
| `--editor-mask-color` | `rgba(0,0,0,0.6)` |
| `--editor-shadow` | `0 1px 3px rgba(0,0,0,0.3)` |
| `--editor-shadow-lg` | `0 4px 6px -1px rgba(0,0,0,0.4)` |

---

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

---

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
.tiptap ul,
.tiptap ol {
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.tiptap li {
  margin: 0.25em 0;
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

---

## 完整 CSS 类名索引

查看所有可用的类名和详细说明，请参考 [CLASS_REFERENCE.md](./CLASS_REFERENCE.md)

### 快速查找

| 功能区域 | 相关类名 |
|---------|---------|
| **根容器** | `.vue-word-editor`、`.editor-container`、`.editor-content-wrapper` |
| **工具栏** | `.editor-toolbar`、`.toolbar-group`、`.editor-button`、`.editor-divider` |
| **按钮状态** | `.editor-btn-default`、`.editor-btn-active`、`.editor-btn-primary`、`.editor-btn-danger` |
| **下拉选择** | `.editor-select`、`.heading-select` |
| **气泡菜单** | `.bubble-menu`、`.slider-container`、`.editor-slider`、`.slider-label` |
| **颜色选择器** | `.editor-color-picker`、`.color-picker-grid`、`.color-swatch` |
| **链接菜单/对话框** | `.link-menu-popup`、`.link-dialog`、`.link-input` |
| **导出菜单** | `.export-menu`、`.export-menu-item` |
| **图片节点** | `.image-node-view`、`.crop-wrapper`、`.crop-mask`、`.crop-handle` |
| **内容区域** | `.tiptap`、`.editor-content` |
| **内容格式** | `.tiptap h1-h6`、`.tiptap p`、`.tiptap blockquote`、`.tiptap img.wrap-left` |
| **其他工具** | `.editor-text-secondary`、`.editor-overlay`、`.editor-tooltip` |

---

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

**A:** 可以创建自己的主题 CSS 文件：

```css
/* my-theme.css */
.vue-word-editor.my-theme {
  --editor-primary-color: #f472b6;
  --editor-primary-hover: #ec4899;
  /* ... 更多变量 */
}

.vue-word-editor.my-theme.dark {
  --editor-primary-color: #f472b6;
  /* ... 暗色主题 */
}
```

然后使用：

```vue
<VueWordEditor class="my-theme" />
```

---

## 完整示例

这是一个完整的自定义主题示例：

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
.my-custom-editor {
  /* 主题变量 */
  --editor-primary-color: #ec4899;
  --editor-primary-hover: #f472b6;
  --editor-bg-color: #fdf2f8;
  --editor-toolbar-bg: #fce7f3;
  --editor-border-color: #fbcfe8;
  --editor-text-color: #1f2937;
  --editor-text-secondary: #be185d;
  --editor-radius: 0.75rem;
}

/* 自定义内容样式 */
.my-custom-editor :deep(.tiptap) h1 {
  border-bottom-color: #f472b6;
}

.my-custom-editor :deep(.tiptap) blockquote {
  border-left-color: #f472b6;
  background-color: #fdf2f8;
}
</style>
```
