<template>
  <div class="app-page" :class="{ dark: effectiveTheme === 'dark' }">
    <div class="app-min-height app-transition app-background">
      <div class="app-container app-padding">
        <div class="app-header app-margin-bottom">
          <h1 class="app-h1 app-title">vue3-simple-wordeditor Demo</h1>

          <div class="app-button-group">
            <button
              v-for="t in themeOptions"
              :key="t.value"
              @click="pageTheme = t.value"
              class="app-btn theme-btn"
              :class="{ active: pageTheme === t.value }"
            >
              {{ t.label }}
            </button>
            <div class="app-divider"></div>
            <button
              v-for="opt in localeOptions"
              :key="opt.value"
              @click="currentLocale = opt.value"
              class="app-btn theme-btn"
              :class="{ active: currentLocale === opt.value }"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="app-editor-wrapper app-shadow">
          <VueWordEditor
            ref="editorRef"
            v-model="content"
            :theme="pageTheme"
            :locale="currentLocale"
            placeholder="开始编辑您的文档..."
            class="app-editor-height"
          />
        </div>

        <div class="app-section app-card">
          <h2 class="app-h2 app-card-title">HTML 输出</h2>
          <textarea
            v-model="content"
            class="app-textarea app-textarea-input"
            placeholder="HTML content..."
          ></textarea>
        </div>

        <div class="app-section app-card">
          <h2 class="app-h2 app-card-title">图片上传测试</h2>
          <button
            @click="testUpload"
            class="app-btn-primary"
          >
            模拟上传图片
          </button>
          <p class="app-status app-text-secondary">
            {{ uploadStatus }}
          </p>
        </div>

        <div class="app-section app-card">
          <h2 class="app-h2 app-card-title">JSON 导入测试</h2>
          <textarea
            v-model="jsonContent"
            class="app-textarea app-textarea-input app-margin-bottom-sm"
            placeholder="粘贴导出的 JSON 数据..."
          ></textarea>
          <button
            @click="importFromJSON"
            class="app-btn-success"
          >
            从 JSON 导入
          </button>
          <p class="app-status app-text-secondary">
            {{ importStatus }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VueWordEditor from './components/VueWordEditor.vue'

const pageTheme = ref<'light' | 'dark' | 'auto'>('light')
const currentLocale = ref<'zh-CN' | 'en-US'>('zh-CN')
const editorRef = ref<InstanceType<typeof VueWordEditor> | null>(null)
const uploadStatus = ref('')
const jsonContent = ref('')
const importStatus = ref('')

const effectiveTheme = computed(() => {
  if (pageTheme.value !== 'auto') return pageTheme.value
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
})

const themeOptions = [
  { label: '☀️ 亮色', value: 'light' as const },
  { label: '🌙 暗色', value: 'dark' as const },
  { label: '🖥️ 跟随系统', value: 'auto' as const },
]

const localeOptions = [
  { label: '中文', value: 'zh-CN' as const },
  { label: 'English', value: 'en-US' as const },
]

const content = ref(`<h1>欢迎使用 vue3-simple-wordeditor</h1>
<p>这是一个基于 Vue3 + TipTap3 构建的富文本编辑器。</p>
<h2>功能特点</h2>
<ul>
<li><strong>字体设置</strong> - 支持粗细，大小、颜色、背景色</li>
<li><strong>标题</strong> - 支持 H1-H6 多级标题</li>
<li><strong>对齐</strong> - 支持左对齐、居中、右对齐，两端对齐</li>
<li><strong>图片编辑</strong> - 支持插入和编辑图片</li>
<li><strong>引用</strong> - 支持引用块</li>
<li><strong>列表</strong> - 支持有序和无序列表</li>
<li><strong>链接</strong> - 支持插入文本链接</li>
</ul>
<blockquote>这是一段引用文本，用于引用他人的话语或重要信息。</blockquote>
<p><em>支持斜体</em>、<u>下划线</u>、<s>删除线</s>等文本格式。</p>
<p>支持 <span style="color: #3b82f6;">自定义颜色</span> 和 <mark style="background-color: #ffff00;">高亮标记</mark>。</p>`)

async function testUpload() {
  if (!editorRef.value) {
    uploadStatus.value = '编辑器未初始化'
    return
  }

  uploadStatus.value = '正在获取图片...'

  try {
    const images = await editorRef.value.getImagesForUpload()
    console.log('找到的图片:', images)

    if (images.length === 0) {
      uploadStatus.value = '没有图片需要上传'
      return
    }

    uploadStatus.value = `找到 ${images.length} 张图片，开始模拟上传...`

    const uploadResults = images.map((img, index) => ({
      originalSrc: img.originalSrc,
      url: `https://fake-upload.example.com/image-${index + 1}.jpg`
    }))

    await new Promise(resolve => setTimeout(resolve, 1000))

    uploadStatus.value = '图片上传完成，正在替换 URL...'

    const srcMapping = new Map(uploadResults.map(r => [r.originalSrc, r.url]))
    editorRef.value.replaceMultipleImages(srcMapping)

    await new Promise(resolve => setTimeout(resolve, 500))

    const finalHTML = editorRef.value.getHTML()
    const fakeUrlCount = (finalHTML.match(/fake-upload\.example\.com/g) || []).length

    uploadStatus.value = `✅ 完成！已替换 ${fakeUrlCount} 张图片为模拟 URL`
    content.value = finalHTML
  } catch (e) {
    console.error('上传失败:', e)
    uploadStatus.value = '上传失败: ' + (e as Error).message
  }
}

async function importFromJSON() {
  if (!editorRef.value) {
    importStatus.value = '编辑器未初始化'
    return
  }

  if (!jsonContent.value.trim()) {
    importStatus.value = '请输入JSON数据'
    return
  }

  importStatus.value = '正在解析JSON数据...'

  try {
    const json = JSON.parse(jsonContent.value)
    editorRef.value.setJSON(json)
    importStatus.value = '✅ 导入成功！'

    const finalHTML = editorRef.value.getHTML()
    content.value = finalHTML
  } catch (e) {
    console.error('JSON解析失败:', e)
    importStatus.value = 'JSON解析失败: ' + (e as Error).message
  }
}
</script>

<style scoped>
/* Page layout */
.app-page {
  min-height: 100vh;
}

.app-min-height {
  min-height: 100vh;
}

.app-transition {
  transition: background-color 0.2s, color 0.2s;
}

.app-background {
  background-color: var(--editor-toolbar-bg, #f3f4f6);
}

.app-container {
  max-width: 896px;
  margin-left: auto;
  margin-right: auto;
}

.app-padding {
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.app-margin-bottom {
  margin-bottom: 1.5rem;
}

.app-margin-bottom-sm {
  margin-bottom: 1rem;
}

.app-h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.app-h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.app-title {
  color: var(--editor-text-color, #1f2937);
}

.app-button-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-divider {
  width: 1px;
  height: 1.5rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  background-color: var(--editor-border-color, #d1d5db);
}

.app-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

/* Editor wrapper */
.app-editor-wrapper {
  border-radius: 0.5rem;
  overflow: hidden;
}

.app-shadow {
  box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));
}

.app-editor-height {
  height: 500px;
}

/* Cards */
.app-section {
  margin-top: 1.5rem;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: background-color 0.2s;
}

.app-card {
  background-color: var(--editor-bg-color, #ffffff);
  box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));
}

.app-card-title {
  color: var(--editor-text-color, #374151);
}

/* Textarea */
.app-textarea {
  width: 100%;
  height: 10rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.875rem;
  resize: none;
  outline: none;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.app-textarea-input {
  background-color: var(--editor-bg-color, #ffffff);
  color: var(--editor-text-color, #374151);
  border: 1px solid var(--editor-border-color, #e5e7eb);
}

.app-textarea-input:focus {
  border-color: var(--editor-primary-color, #3b82f6);
  box-shadow: 0 0 0 2px var(--editor-primary-color, #3b82f6);
}

/* Status text */
.app-status {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.app-text-secondary {
  color: var(--editor-text-secondary, #6b7280);
}

/* Buttons */
.app-btn-primary {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.app-btn-primary:hover {
  background-color: #2563eb;
}

.app-btn-success {
  padding: 0.5rem 1rem;
  background-color: #22c55e;
  color: #ffffff;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.app-btn-success:hover {
  background-color: #16a34a;
}

/* Theme buttons */
.theme-btn {
  background: transparent;
  color: var(--editor-text-secondary, #6b7280);
  border: 1px solid var(--editor-border-color, #d1d5db);
}

.theme-btn.active {
  background-color: var(--editor-primary-color, #3b82f6);
  color: #ffffff;
  border-color: var(--editor-primary-color, #3b82f6);
}

.theme-btn:hover:not(.active) {
  background-color: var(--editor-toolbar-bg, #f3f4f6);
}
</style>
