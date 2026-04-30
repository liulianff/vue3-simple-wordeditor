<template>
  <div class="toolbar-group">
    <button
      @click="toggleBold"
      :class="['editor-button', { active: isBold }]"
      @mouseenter="showTooltip($event, t('toolbar.bold'))"
      @mouseleave="hideTooltip"
    >
      <Bold class="icon" />
    </button>
    <button
      @click="toggleItalic"
      :class="['editor-button', { active: isItalic }]"
      @mouseenter="showTooltip($event, t('toolbar.italic'))"
      @mouseleave="hideTooltip"
    >
      <Italic class="icon" />
    </button>
    <button
      @click="toggleUnderline"
      :class="['editor-button', { active: isUnderline }]"
      @mouseenter="showTooltip($event, t('toolbar.underline'))"
      @mouseleave="hideTooltip"
    >
      <Underline class="icon" />
    </button>
    <button
      @click="toggleStrike"
      :class="['editor-button', { active: isStrike }]"
      @mouseenter="showTooltip($event, t('toolbar.strike'))"
      @mouseleave="hideTooltip"
    >
      <Strikethrough class="icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Bold, Italic, Underline, Strikethrough } from 'lucide-vue-next'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  editor: any
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrike: boolean
}>()

const emit = defineEmits<{
  showTooltip: [event: MouseEvent, text: string]
  hideTooltip: []
}>()

const { t } = useI18n()

function toggleBold() {
  props.editor?.chain().focus().toggleBold().run()
}

function toggleItalic() {
  props.editor?.chain().focus().toggleItalic().run()
}

function toggleUnderline() {
  props.editor?.chain().focus().toggleUnderline().run()
}

function toggleStrike() {
  props.editor?.chain().focus().toggleStrike().run()
}

function showTooltip(event: MouseEvent, text: string) {
  emit('showTooltip', event, text)
}

function hideTooltip() {
  emit('hideTooltip')
}
</script>
