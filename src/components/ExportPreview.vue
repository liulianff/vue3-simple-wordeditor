<template>
  <Teleport to="body">
    <div v-if="visible" class="vue-word-editor">
      <div class="editor-overlay" @click="close"></div>
      <div class="editor-popup editor-preview-popup">
        <div class="editor-preview-header">
          <span class="editor-preview-title">导出预览</span>
          <div class="editor-preview-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'editor-button',
                { 'editor-btn-active': activeTab === tab.id },
                { 'editor-btn-default': activeTab !== tab.id }
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
          <button class="editor-button editor-btn-default" @click="close">
            <span style="font-size: 18px;">×</span>
          </button>
        </div>
        
        <div class="editor-content-wrapper">
          <!-- HTML Preview - 直接使用编辑器的内容区域样式 -->
          <div v-if="activeTab === 'html'" class="editor-preview-content editor-content tiptap" v-html="previewData.html"></div>
          
          <!-- JSON Preview -->
          <div v-if="activeTab === 'json'" class="editor-preview-content">
            <pre><code>{{ previewData.json }}</code></pre>
          </div>
          
          <!-- Markdown Preview -->
          <div v-if="activeTab === 'markdown'" class="editor-preview-content">
            <pre><code>{{ previewData.markdown }}</code></pre>
          </div>
        </div>
        
        <div class="editor-preview-footer">
          <button class="editor-button editor-btn-primary" @click="copyCurrentContent">
            复制内容
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const activeTab = ref<'html' | 'json' | 'markdown'>('html')
const previewData = ref({
  html: '',
  json: '',
  markdown: ''
})

const tabs = [
  { id: 'html' as const, name: 'HTML' },
  { id: 'json' as const, name: 'JSON' },
  { id: 'markdown' as const, name: 'Markdown' }
]

function open(html: string, json: string, markdown: string) {
  console.log('Preview data received:', { html, json, markdown })
  previewData.value = { html, json, markdown }
}

function close() {
  emit('close')
}

function copyCurrentContent() {
  let content = ''
  
  switch (activeTab.value) {
    case 'html':
      content = previewData.value.html
      break
    case 'json':
      content = previewData.value.json
      break
    case 'markdown':
      content = previewData.value.markdown
      break
  }
  
  if (content) {
    navigator.clipboard.writeText(content).then(() => {
      console.log('已复制到剪贴板')
    })
  }
}

defineExpose({ open })
</script>

<style scoped>
.vue-word-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--editor-mask-color, rgba(0, 0, 0, 0.6));
  z-index: 1;
}

.editor-preview-popup {
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--editor-border-color, #e5e7eb);
  background-color: var(--editor-toolbar-bg, #f9fafb);
  flex-shrink: 0;
}

.editor-preview-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--editor-text-color, #1f2937);
  white-space: nowrap;
}

.editor-preview-tabs {
  display: flex;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.editor-preview-tabs .editor-button {
  width: auto;
  padding: 0.5rem 1rem;
  height: auto;
  min-height: 32px;
}

.editor-preview-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: var(--editor-bg-color, #ffffff);
}

.editor-preview-content pre {
  background-color: #1f2937;
  color: #e5e7eb;
  padding: 20px;
  border-radius: 4px;
  overflow: auto;
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.editor-preview-content code {
  display: block;
}

.editor-preview-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--editor-border-color, #e5e7eb);
  display: flex;
  justify-content: flex-end;
  background-color: var(--editor-toolbar-bg, #f9fafb);
  flex-shrink: 0;
}

.editor-preview-footer .editor-button {
  width: auto;
  padding: 0.5rem 1rem;
  height: auto;
  min-height: 32px;
}
</style>
