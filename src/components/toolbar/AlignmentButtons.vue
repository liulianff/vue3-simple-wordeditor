<template>
  <div class="toolbar-group">
    <button
      @click="toggleAlignment('left')"
      :class="['editor-button', { active: alignment === 'left' }]"
      @mouseenter="showTooltip($event, t('toolbar.align.left'))"
      @mouseleave="hideTooltip"
    >
      <AlignLeft class="icon" />
    </button>
    <button
      @click="toggleAlignment('center')"
      :class="['editor-button', { active: alignment === 'center' }]"
      @mouseenter="showTooltip($event, t('toolbar.align.center'))"
      @mouseleave="hideTooltip"
    >
      <AlignCenter class="icon" />
    </button>
    <button
      @click="toggleAlignment('right')"
      :class="['editor-button', { active: alignment === 'right' }]"
      @mouseleave="hideTooltip"
      @mouseenter="showTooltip($event, t('toolbar.align.right'))"
    >
      <AlignRight class="icon" />
    </button>
    <button
      @click="toggleAlignment('justify')"
      :class="['editor-button', { active: alignment === 'justify' }]"
      @mouseenter="showTooltip($event, t('toolbar.align.justify'))"
      @mouseleave="hideTooltip"
    >
      <AlignJustify class="icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-vue-next'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  editor: any
  alignment: string
}>()

const emit = defineEmits<{
  showTooltip: [event: MouseEvent, text: string]
  hideTooltip: []
}>()

const { t } = useI18n()

function toggleAlignment(align: string) {
  props.editor?.chain().focus().setTextAlign(align).run()
}

function showTooltip(event: MouseEvent, text: string) {
  emit('showTooltip', event, text)
}

function hideTooltip() {
  emit('hideTooltip')
}
</script>
