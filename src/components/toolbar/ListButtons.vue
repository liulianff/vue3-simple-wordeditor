<template>
  <div class="toolbar-group">
    <button
      @click="toggleBulletList"
      :class="['editor-button', { active: isBulletList }]"
      @mouseenter="showTooltip($event, t('toolbar.bulletList'))"
      @mouseleave="hideTooltip"
    >
      <List class="icon" />
    </button>
    <button
      @click="toggleOrderedList"
      :class="['editor-button', { active: isOrderedList }]"
      @mouseenter="showTooltip($event, t('toolbar.orderedList'))"
      @mouseleave="hideTooltip"
    >
      <ListOrdered class="icon" />
    </button>
    <button
      @click="toggleBlockquote"
      :class="['editor-button', { active: isBlockquote }]"
      @mouseenter="showTooltip($event, t('toolbar.blockquote'))"
      @mouseleave="hideTooltip"
    >
      <Quote class="icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { List, ListOrdered, Quote } from 'lucide-vue-next'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  editor: any
  isBulletList: boolean
  isOrderedList: boolean
  isBlockquote: boolean
}>()

const emit = defineEmits<{
  showTooltip: [event: MouseEvent, text: string]
  hideTooltip: []
}>()

const { t } = useI18n()

function toggleBulletList() {
  props.editor?.chain().focus().toggleBulletList().run()
}

function toggleOrderedList() {
  props.editor?.chain().focus().toggleOrderedList().run()
}

function toggleBlockquote() {
  props.editor?.chain().focus().toggleBlockquote().run()
}

function showTooltip(event: MouseEvent, text: string) {
  emit('showTooltip', event, text)
}

function hideTooltip() {
  emit('hideTooltip')
}
</script>
