# JSON 导入指南

本指南详细介绍如何将导出的 JSON 数据或从服务器获取的 JSON 数据重新导入到 Vue Word Editor 中并显示为 HTML 内容。

## 目录

- [基本概念](#基本概念)
- [基本用法](#基本用法)
- [从服务器获取 JSON 数据](#从服务器获取-json-数据)
- [处理复杂内容](#处理复杂内容)
- [错误处理](#错误处理)
- [性能优化](#性能优化)
- [完整示例](#完整示例)

## 基本概念

Vue Word Editor 使用 TipTap 编辑器作为底层实现，其 JSON 格式遵循 TipTap 的文档结构。当你导出 JSON 格式时，得到的是一个包含完整文档结构的 JSON 对象，包括所有的文本、格式、图片等信息。

### JSON 结构示例

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "标题"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "这是一段文本，"
          "marks": [
            {
              "type": "bold"
            }
          ]
        },
        {
          "type": "text",
          "text": "包含加粗格式"
        }
      ]
    },
    {
      "type": "draggableImage",
      "attrs": {
        "src": "https://example.com/image.jpg",
        "alt": "图片描述",
        "width": 400,
        "layout": "block"
      }
    }
  ]
}
```

## 基本用法

通过组件 `ref` 调用 `setJSON` 方法，可以将 JSON 数据导入到编辑器中：

```vue
<template>
  <VueWordEditor ref="editorRef" />
  <button @click="loadJSON">加载 JSON 数据</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue-word-editor'
import 'vue-word-editor/dist/style.css'

const editorRef = ref()

function loadJSON() {
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
</script>
```

## 从服务器获取 JSON 数据

在实际应用中，你可能需要从服务器获取已保存的 JSON 数据并导入到编辑器中。以下是一个完整的示例：

### 步骤 1：从服务器获取数据

```typescript
async function loadFromServer(articleId) {
  try {
    const response = await fetch(`/api/articles/${articleId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch article')
    }
    const data = await response.json()
    return data.content // 假设服务器返回的数据中 content 字段是 JSON 格式的文档内容
  } catch (error) {
    console.error('Error loading article:', error)
    throw error
  }
}
```

### 步骤 2：导入到编辑器

```typescript
async function loadArticle(articleId) {
  try {
    const jsonContent = await loadFromServer(articleId)
    editorRef.value.setJSON(jsonContent)
    console.log('Article loaded successfully')
  } catch (error) {
    console.error('Error loading article:', error)
  }
}
```

## 处理复杂内容

当导入包含复杂内容的 JSON 数据时，需要注意以下几点：

### 1. 图片处理

如果 JSON 数据中包含图片，确保图片的 `src` 属性是有效的 URL 或 base64 数据：

```json
{
  "type": "draggableImage",
  "attrs": {
    "src": "https://example.com/image.jpg", // 有效的 URL
    "alt": "图片描述",
    "width": 400,
    "layout": "block"
  }
}
```

### 2. 格式处理

JSON 数据中包含完整的格式信息，包括：
- 文本格式（加粗、斜体、下划线等）
- 段落格式（对齐方式、列表、引用等）
- 标题级别
- 链接
- 高亮

这些格式会被自动转换为相应的 HTML 格式。

### 3. 嵌套结构

JSON 数据支持嵌套结构，例如在列表项中包含其他格式：

```json
{
  "type": "listItem",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "列表项 1，",
          "marks": [
            {
              "type": "bold"
            }
          ]
        },
        {
          "type": "text",
          "text": "包含加粗格式"
        }
      ]
    }
  ]
}
```

## 错误处理

在导入 JSON 数据时，可能会遇到各种错误，需要进行适当的错误处理：

### 1. JSON 解析错误

```typescript
function loadJSON(jsonString) {
  try {
    const jsonData = JSON.parse(jsonString)
    editorRef.value.setJSON(jsonData)
  } catch (error) {
    console.error('JSON parsing error:', error)
    alert('无效的 JSON 数据')
  }
}
```

### 2. 编辑器未初始化

```typescript
function loadJSON(jsonData) {
  if (!editorRef.value) {
    console.error('Editor not initialized')
    alert('编辑器未初始化')
    return
  }
  
  editorRef.value.setJSON(jsonData)
}
```

### 3. 数据结构错误

如果 JSON 数据结构不符合 TipTap 的要求，可能会导致导入失败：

```typescript
async function loadJSON(jsonData) {
  try {
    editorRef.value.setJSON(jsonData)
  } catch (error) {
    console.error('Error loading JSON:', error)
    alert('数据结构错误，导入失败')
  }
}
```

## 性能优化

当处理大型 JSON 数据时，可以采取以下措施优化性能：

### 1. 延迟加载

对于大型文档，可以使用 `setTimeout` 延迟加载，避免阻塞主线程：

```typescript
function loadLargeJSON(jsonData) {
  setTimeout(() => {
    editorRef.value.setJSON(jsonData)
  }, 0)
}
```

### 2. 分块加载

对于非常大的文档，可以考虑分块加载：

```typescript
function loadLargeJSONInChunks(jsonData) {
  // 简化版分块加载，实际应用中可能需要更复杂的逻辑
  const chunks = splitJSONIntoChunks(jsonData, 100) // 假设 splitJSONIntoChunks 是一个将 JSON 分割成块的函数
  
  let index = 0
  function loadNextChunk() {
    if (index < chunks.length) {
      editorRef.value.setJSON(chunks[index])
      index++
      setTimeout(loadNextChunk, 100) // 每 100ms 加载一块
    }
  }
  
  loadNextChunk()
}
```

### 3. 缓存机制

如果需要频繁加载相同的 JSON 数据，可以使用缓存机制：

```typescript
const jsonCache = new Map()

async function loadJSONWithCache(key, fetchFunction) {
  if (jsonCache.has(key)) {
    const cachedData = jsonCache.get(key)
    editorRef.value.setJSON(cachedData)
    return
  }
  
  const jsonData = await fetchFunction()
  jsonCache.set(key, jsonData)
  editorRef.value.setJSON(jsonData)
}
```

## 完整示例

以下是一个完整的示例，展示如何从服务器获取 JSON 数据并导入到编辑器中：

### 1. 组件定义

```vue
<template>
  <div class="editor-container">
    <h1>文章编辑器</h1>
    
    <div class="controls">
      <input v-model="articleId" type="number" placeholder="文章 ID" />
      <button @click="loadArticle" :disabled="loading">
        {{ loading ? '加载中...' : '加载文章' }}
      </button>
      <button @click="clearEditor">清空</button>
    </div>
    
    <VueWordEditor
      ref="editorRef"
      v-model="content"
      class="editor"
    />
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue-word-editor'
import 'vue-word-editor/dist/style.css'

const editorRef = ref()
const content = ref('')
const articleId = ref('1')
const loading = ref(false)
const error = ref('')

async function loadArticle() {
  if (!articleId.value) {
    error.value = '请输入文章 ID'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 模拟从服务器获取数据
    const response = await fetch(`/api/articles/${articleId.value}`)
    if (!response.ok) {
      throw new Error('Failed to fetch article')
    }
    
    const data = await response.json()
    
    // 导入 JSON 数据到编辑器
    editorRef.value.setJSON(data.content)
    
    console.log('Article loaded successfully')
  } catch (err) {
    error.value = `加载失败: ${(err as Error).message}`
    console.error('Error loading article:', err)
  } finally {
    loading.value = false
  }
}

function clearEditor() {
  editorRef.value.setJSON({ type: 'doc', content: [] })
  content.value = ''
  error.value = ''
}
</script>

<style scoped>
.editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-height: 400px;
}

.error {
  margin-top: 10px;
  color: red;
  font-size: 14px;
}
</style>
```

## 总结

通过本指南，你应该已经了解了如何将 JSON 数据导入到 Vue Word Editor 中，包括：

1. 基本的 JSON 导入方法
2. 从服务器获取 JSON 数据
3. 处理复杂内容
4. 错误处理
5. 性能优化
6. 完整的使用示例

这些技巧可以帮助你在实际应用中更好地使用 Vue Word Editor 的 JSON 导入功能，实现数据的持久化存储和加载。