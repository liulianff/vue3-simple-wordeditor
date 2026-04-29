<template>
  <div class="vue-word-editor editor-container editor-preview-only" :class="{ dark: isDark }">
    <div class="editor-content-wrapper">
      <div class="editor-content tiptap" v-html="html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  html: string
  theme?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light'
})

const isDark = computed(() => {
  if (props.theme !== 'auto') return props.theme === 'dark'
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return false
})
</script>

<style scoped>
/* 继承编辑器的样式体系，独立预览也能完美复刻 */
.editor-preview-only {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--editor-bg-color, #ffffff);
  border-radius: var(--editor-radius, 0.5rem);
  border: 1px solid var(--editor-border-color, #e5e7eb);
  box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));
}

.editor-preview-only.editor-container {
  /* 预览模式只需要内容区域，不需要工具栏，调整 padding */
  padding: 0;
}
</style>
