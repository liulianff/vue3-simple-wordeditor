# JavaScript 兼容与使用指南

本文档说明 vue3-simple-wordeditor 如何在不同类型的项目中使用，包括 JavaScript 项目。

## 目录

- [兼容性说明](#兼容性说明)
- [在不同项目中的使用方法](#在不同项目中的使用方法)
  - [Vue 3 + TypeScript 项目](#vue-3--typescript-项目)
  - [Vue 3 + JavaScript 项目](#vue-3--javascript-项目)
  - [普通 HTML 页面](#普通-html-页面)
- [示例文件位置](#示例文件位置)
- [常见问题](#常见问题)

***

## 兼容性说明

**vue3-simple-wordeditor 完全兼容 JavaScript**。

- 项目使用 TypeScript 开发，但编译后生成标准 JavaScript 文件
- 支持以下模块系统：
  - ES 模块（import/export）
  - CommonJS（require）
  - UMD（浏览器直接使用）

***

## 在不同项目中的使用方法

### Vue 3 + TypeScript 项目

**文件位置**：通常在 `src/components/` 或 `src/views/` 中。

**安装**：

```bash
npm install vue3-simple-wordeditor
```

**使用示例**：

```vue
<!-- src/components/EditorComponent.vue -->
<template>
  <div class="editor-container">
    <h2>编辑器示例</h2>
    <Vue3SimpleWordEditor v-model="content" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Vue3SimpleWordEditor from 'vue3-simple-wordeditor'
import 'vue3-simple-wordeditor/dist/vue3-simple-wordeditor.css'

const content = ref('<p>Hello World!</p>')
</script>

<style scoped>
.editor-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
```

### Vue 3 + JavaScript 项目

**文件位置**：通常在 `src/components/` 或 `src/views/` 中。

**安装**：

```bash
npm install vue3-simple-wordeditor
```

**使用示例**：

```vue
<!-- src/components/EditorComponent.vue -->
<template>
  <div class="editor-container">
    <h2>编辑器示例</h2>
    <Vue3SimpleWordEditor v-model="content" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Vue3SimpleWordEditor from 'vue3-simple-wordeditor'
import 'vue3-simple-wordeditor/dist/vue3-simple-wordeditor.css'

const content = ref('<p>Hello World!</p>')
</script>

<style scoped>
.editor-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
```

### 普通 HTML 页面

**文件位置**：任何 `.html` 文件。

**使用方法**：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue3SimpleWordEditor 示例</title>
  <!-- 引入 Vue 3 -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <!-- 引入 Vue3SimpleWordEditor -->
  <script src="https://unpkg.com/vue3-simple-wordeditor/dist/vue3-simple-wordeditor.umd.js"></script>
  <!-- 引入样式 -->
  <link rel="stylesheet" href="https://unpkg.com/vue3-simple-wordeditor/dist/vue3-simple-wordeditor.css">
</head>
<body>
  <div id="app">
    <h1>Vue3SimpleWordEditor 示例</h1>
    <vue3-simple-wordeditor v-model="content"></vue3-simple-wordeditor>
    <pre>{{ content }}</pre>
  </div>

  <script>
    const { createApp, ref } = Vue
    const { Vue3SimpleWordEditor } = window['vue3-simple-wordeditor']

    createApp({
      components: {
        Vue3SimpleWordEditor
      },
      setup() {
        const content = ref('<p>Hello World!</p>')
        return { content }
      }
    }).mount('#app')
  </script>
</body>
</html>
```

***

## 示例文件位置

### 项目自带的示例

**文件**：`src/App.vue`
**位置**：`.\Vue3-Simple-WordEditor\src\App.vue`

这个文件是项目的演示页面，包含了：

- 基本编辑器使用
- 主题切换（亮色/暗色）
- 语言切换（中文/英文）
- 各种编辑功能的演示

### 语言包示例

### **位置**：`.\Vue3-Simple-WordEditor\src\locales\`

**文件**：

- `src/locales/zhCN.ts` - 中文语言包
- `src/locales/enUS.ts` - 英文语言包

这些文件可以作为自定义语言包的参考。

### 样式文件

**文件**：

- `src/style.css` - 主样式文件
- `src/styles/editor.css` - 编辑器工具类样式
  **位置**：`.\VueEditorTools\src\`

***

## 常见问题

### Q: 在 JavaScript 项目中使用时，TypeScript 类型报错怎么办？

**A:** 这是正常的，因为 TypeScript 类型定义文件存在但你的项目是 JavaScript。你可以：

- 忽略这些类型提示（它们不会影响运行）
- 在 VS Code 中设置 `"javascript.validate.enable": false`

### Q: 如何在 JavaScript 项目中使用 `registerLocale`？

**A:** 可以直接使用，不需要类型定义：

```javascript
// src/main.js
import { registerLocale } from 'vue3-simple-wordeditor'

// 注册自定义语言包
registerLocale('ja-JP', {
  toolbar: {
    heading: {
      paragraph: '段落',
      h1: '見出し 1',
      // ... 其他字段
    },
    // ... 其他模块
  },
  placeholder: '編集を開始...',
})
```

### Q: 普通 HTML 页面中如何使用语言包？

**A:** 在普通 HTML 页面中，需要通过全局对象访问：

```html
<script>
  const { registerLocale } = window['vue3-simple-wordeditor']
  
  registerLocale('ja-JP', {
    // 语言包内容
  })
</script>
```

### Q: 如何查看编译后的 JavaScript 文件？

**A:** 编译后的文件在 `dist/` 目录中：

- `dist/vue3-simple-wordeditor.umd.js` - 浏览器和 CommonJS 兼容
- `dist/vue3-simple-wordeditor.es.js` - ES 模块格式

### Q: 项目中使用的图标库是什么？

**A:** 使用的是 `lucide-vue-next`，这是一个 Vue 3 兼容的图标库。在 JavaScript 项目中也可以正常使用，因为它是作为依赖安装的。

***

## 最佳实践

1. **在 Vue 3 项目中**：
   - 使用 ES 模块导入（`import Vue3SimpleWordEditor from 'vue3-simple-wordeditor'`）
   - 确保安装了 `lucide-vue-next` 依赖
2. **在普通 HTML 页面中**：
   - 使用 UMD 格式（通过 CDN 或本地文件）
   - 确保先引入 Vue 3
3. **性能优化**：
   - 对于大型应用，考虑使用动态导入：
     ```javascript
     const Vue3SimpleWordEditor = await import('vue3-simple-wordeditor')
     ```
4. **样式自定义**：
   - 通过 CSS 变量覆盖默认样式
   - 参考 [CLASS\_REFERENCE.md](./CLASS_REFERENCE.md) 了解所有可用的 CSS 类

***

## 技术细节

### 打包产物

| 文件                          | 格式         | 用途                  |
| --------------------------- | ---------- | ------------------- |
| `vue3-simple-wordeditor.umd.js` | UMD        | 浏览器直接使用、CommonJS 项目 |
| `vue3-simple-wordeditor.es.js`  | ES Module  | ES 模块项目             |
| `vue3-simple-wordeditor.css`    | CSS        | 样式文件                |
| `index.d.ts`                | TypeScript | 类型定义文件              |

### 依赖要求

- **Vue 3**：^3.4.0
- **lucide-vue-next**：^0.294.0

这些依赖会自动安装（作为 peerDependencies）。
