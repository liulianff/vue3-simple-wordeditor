# Vue Word Editor

基于 Vue 3 + TipTap 3 构建的富文本编辑器组件，支持图片编辑、亮暗主题、样式自定义。

### 依赖

- `vue` ^3.4.0（peer dependency）
- `lucide-vue-next` ^0.294.0（peer dependency，图标库）

## 方式一：安装(未发布,无法使用)

```bash
npm install vue-word-editor
```

<br />

## 方式二：本地构建 + 本地路径引用（当前使用方法）

### 1. 构建库

在 VueEditorTools 目录下执行：

```bash
npm run build:lib
```

这会在 dist/ 目录生成：

- dist/vue-word-editor.es.js — ES Module 格式
- dist/vue-word-editor.umd.js — UMD 格式
- dist/vue-word-editor.css — 样式文件

### 2. 在其他项目中引用 方法 A：通过 package.json 的本地路径依赖

在目标项目的 package.json 中添加：

```JSON
{
  "dependencies": {
    "vue-word-editor": "file:../
    VueEditorTools"
  }
}
```

然后执行 npm install ，之后就可以正常 import：

## 快速开始

```vue
<template>
  <VueWordEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue-word-editor'
import 'vue-word-editor/dist/style.css'

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
editorRef.getHTML(): string        // 获取当前 HTML 内容
editorRef.setHTML(html: string)    // 设置 HTML 内容
editorRef.editor                   // TipTap 编辑器实例
```

#### 示例

```vue
<template>
  <VueWordEditor
    v-model="content"
    :theme="theme"
    :placeholder="'开始编辑您的文档...'"
    :editable="true"
    class="custom-editor"
    style="height: 500px;"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue-word-editor'
import 'vue-word-editor/dist/style.css'

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

通过 CSS 变量覆盖默认颜色。CSS 变量定义在 `.vue-word-editor` 作用域内。

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

## 样式自定义

### CSS 变量方式（推荐）

所有颜色、阴影、圆角、字体都通过 CSS 变量控制，覆盖即可自定义。

### CSS 工具类

编辑器使用以下 CSS 类，你可以覆盖它们来自定义样式：

| 类名                            | 用途       | 默认样式                                                                                                                      |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `.editor-btn-default`         | 工具栏按钮默认态 | `color: var(--editor-text-color); background: transparent`                                                                |
| `.editor-btn-default:hover`   | 工具栏按钮悬停态 | `background-color: var(--editor-toolbar-bg)`                                                                              |
| `.editor-btn-active`          | 工具栏按钮激活态 | `background-color: var(--editor-primary-color); color: #ffffff`                                                           |
| `.editor-btn-danger`          | 危险操作按钮   | `color: var(--editor-danger-color)`                                                                                       |
| `.editor-btn-danger:hover`    | 危险操作按钮悬停 | `background-color: var(--editor-danger-hover)`                                                                            |
| `.editor-divider`             | 工具栏分隔线   | `background-color: var(--editor-border-color)`                                                                            |
| `.editor-text-secondary`      | 次要文字     | `color: var(--editor-text-secondary)`                                                                                     |
| `.editor-slider`              | 滑块轨道     | `background-color: var(--editor-border-color)`                                                                            |
| `.editor-select`              | 下拉选择框    | `background-color: var(--editor-bg-color); border: 1px solid var(--editor-border-color); color: var(--editor-text-color)` |
| `.editor-select:hover`        | 下拉选择框悬停  | `background-color: var(--editor-toolbar-bg)`                                                                              |
| `.editor-select:focus`        | 下拉选择框聚焦  | `box-shadow: 0 0 0 2px var(--editor-primary-color)`                                                                       |
| `.editor-input`               | 文本输入框    | `background-color: var(--editor-bg-color); border: 1px solid var(--editor-border-color); color: var(--editor-text-color)` |
| `.editor-input:focus`         | 文本输入框聚焦  | `box-shadow: 0 0 0 2px var(--editor-primary-color)`                                                                       |
| `.editor-btn-primary`         | 主要按钮     | `background-color: var(--editor-primary-color); color: #ffffff`                                                           |
| `.editor-btn-primary:hover`   | 主要按钮悬停   | `background-color: var(--editor-primary-hover)`                                                                           |
| `.editor-btn-secondary`       | 次要按钮     | `background-color: var(--editor-toolbar-bg); color: var(--editor-text-color)`                                             |
| `.editor-btn-secondary:hover` | 次要按钮悬停   | `background-color: var(--editor-border-color)`                                                                            |
| `.editor-color-swatch`        | 颜色选择色块   | `border-color: var(--editor-border-color)`                                                                                |

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
} from 'vue-word-editor'
```

| 类型                | 说明                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `EditorConfig`    | 编辑器配置 `{ placeholder?, content?, editable? }`                                                                       |
| `ImageLayoutType` | 图片布局 `'inline' \| 'block' \| 'wrap-left' \| 'wrap-right'`                                                           |
| `CropData`        | 裁剪数据 `{ x: number; y: number; width: number; height: number }`                                                      |
| `ImageAttributes` | 图片属性 `{ src, alt?, title?, width?, height?, layout?, crop?, marginTop?, marginRight?, marginBottom?, marginLeft? }` |
| `LinkData`        | 链接数据 `{ href: string; target?: string }`                                                                            |
| `FontStyle`       | 字体样式 `{ family?, size?, weight?, color?, backgroundColor? }`                                                        |

## 高级用法

### 使用 useEditor composable

```vue
<script setup lang="ts">
import { useEditor } from 'vue-word-editor'

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
import { DraggableImage } from 'vue-word-editor'
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
import { VueWordEditor, useEditor } from 'vue-word-editor'
import type { ImageAttributes } from 'vue-word-editor'

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

