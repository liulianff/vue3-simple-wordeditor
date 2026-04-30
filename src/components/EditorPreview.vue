<template>
  <div
    v-if="!inline"
    class="vue-word-editor editor-container editor-preview-only"
    :class="{ dark: isDark }"
  >
    <div class="editor-content-wrapper">
      <div class="editor-content tiptap" v-html="html"></div>
    </div>
  </div>
  <div v-else class="editor-content tiptap" :class="{ dark: isDark }" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  html: string
  theme?: 'light' | 'dark' | 'auto'
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  inline: false
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
  padding: 0;
}
</style>
