<template>
  <div class="app-page" :class="{ dark: effectiveTheme === 'dark' }">
    <div class="min-h-screen transition-colors duration-200" style="background-color: var(--editor-toolbar-bg, #f3f4f6);">
      <div class="max-w-4xl mx-auto py-8 px-4">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold transition-colors" style="color: var(--editor-text-color, #1f2937);">Vue Word Editor</h1>
          
          <div class="flex items-center gap-2">
            <button
              v-for="t in themeOptions"
              :key="t.value"
              @click="pageTheme = t.value"
              class="px-3 py-1.5 text-sm rounded-lg transition-all theme-btn"
              :class="{ active: pageTheme === t.value }"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <div class="rounded-lg overflow-hidden" style="box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));">
          <VueWordEditor
            v-model="content"
            :theme="pageTheme"
            placeholder="开始编辑您的文档..."
            class="h-[500px]"
          />
        </div>

        <div class="mt-6 rounded-lg p-6 transition-colors" style="background-color: var(--editor-bg-color, #ffffff); box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));">
          <h2 class="text-lg font-semibold mb-4 transition-colors" style="color: var(--editor-text-color, #374151);">HTML 输出</h2>
          <textarea
            v-model="content"
            class="w-full h-40 p-3 rounded-lg font-mono text-sm resize-none focus:outline-none transition-colors"
            style="background-color: var(--editor-bg-color, #ffffff); color: var(--editor-text-color, #374151); border: 1px solid var(--editor-border-color, #e5e7eb);"
            placeholder="HTML content..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VueWordEditor from './components/VueWordEditor.vue'

const pageTheme = ref<'light' | 'dark' | 'auto'>('light')

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

const content = ref(`<h1>欢迎使用 Vue Word Editor</h1>
<p>这是一个基于 Vue3 + TipTap3 构建的富文本编辑器。</p>
<h2>功能特点</h2>
<ul>
<li><strong>字体设置</strong> - 支持粗细、大小、颜色、背景色</li>
<li><strong>标题</strong> - 支持 H1-H6 多级标题</li>
<li><strong>对齐</strong> - 支持左对齐、居中、右对齐、两端对齐</li>
<li><strong>图片编辑</strong> - 支持插入和编辑图片</li>
<li><strong>引用</strong> - 支持引用块</li>
<li><strong>列表</strong> - 支持有序和无序列表</li>
<li><strong>链接</strong> - 支持插入文本链接</li>
</ul>
<blockquote>这是一段引用文本，用于引用他人的话语或重要信息。</blockquote>
<p><em>支持斜体</em>、<u>下划线</u>、<s>删除线</s>等文本格式。</p>
<p>支持 <span style="color: #3b82f6;">自定义颜色</span> 和 <mark style="background-color: #ffff00;">高亮标记</mark>。</p>`)
</script>

<style scoped>
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
