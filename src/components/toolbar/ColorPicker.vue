<template>
  <div class="toolbar-group">
    <button
      @click="toggleTextColorPicker"
      :class="['editor-button']"
      @mouseenter="showTooltip($event, t('toolbar.textColor'))"
      @mouseleave="hideTooltip"
    >
      <div class="color-indicator" :style="{ backgroundColor: textColor }">
        <Palette class="icon" :style="{ color: getContrastColor(textColor) }" />
      </div>
    </button>
    <button
      @click="toggleHighlightColorPicker"
      :class="['editor-button']"
      @mouseenter="showTooltip($event, t('toolbar.highlightColor'))"
      @mouseleave="hideTooltip"
    >
      <div class="color-indicator" :style="{ backgroundColor: highlightColor }">
        <Highlighter class="icon" :style="{ color: getContrastColor(highlightColor) }" />
      </div>
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="showTextColorPicker"
      class="editor-popup-fixed editor-popup editor-color-picker text-color-picker"
      :style="{ left: textColorPickerPosition.x + 'px', top: textColorPickerPosition.y + 'px' }"
      @click.stop
    >
      <div class="color-picker-grid text-color-grid">
        <button
          v-for="color in textColorOptions"
          :key="color"
          class="color-swatch"
          :style="{ backgroundColor: color }"
          @click="setColor(color)"
        />
        <button
          class="color-swatch transparent-color"
          @click="removeTextColor"
        >
          <div class="transparent-indicator"></div>
        </button>
      </div>
      <div class="color-picker-divider"></div>
      <div class="custom-color-section">
        <label class="custom-color-label">{{ t('toolbar.customColor') }}</label>
        <input
          v-model="customTextColor"
          type="color"
          @input="setColor(customTextColor)"
          class="custom-color-input editor-input"
        />
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="showHighlightColorPicker"
      class="editor-popup-fixed editor-popup editor-color-picker highlight-color-picker"
      :style="{ left: highlightColorPickerPosition.x + 'px', top: highlightColorPickerPosition.y + 'px' }"
      @click.stop
    >
      <div class="color-picker-grid highlight-color-grid">
        <button
          v-for="color in highlightColorOptions"
          :key="color"
          class="color-swatch"
          :style="{ backgroundColor: color }"
          @click="setHighlightColor(color)"
        />
        <button
          class="color-swatch transparent-color"
          @click="removeHighlightColor"
        >
          <div class="transparent-indicator"></div>
        </button>
      </div>
      <div class="color-picker-divider"></div>
      <div class="custom-color-section">
        <label class="custom-color-label">{{ t('toolbar.customColor') }}</label>
        <input
          v-model="customHighlightColor"
          type="color"
          @input="setHighlightColor(customHighlightColor)"
          class="custom-color-input editor-input"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Palette, Highlighter } from 'lucide-vue-next'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  editor: any
}>()

const emit = defineEmits<{
  closeOtherPopups: []
  showTooltip: [event: MouseEvent, text: string]
  hideTooltip: []
}>()

const { t } = useI18n()

const showTextColorPicker = ref(false)
const textColor = ref('#000000')
const customTextColor = ref('#000000')
const textColorOptions = [
  '#000000', '#666666', '#999999', '#ff0000', '#ff9900',
  '#ffff00', '#00ff00', '#0066cc', '#9933ff', '#ff66cc'
]
const textColorPickerPosition = ref({ x: 0, y: 0 })

const showHighlightColorPicker = ref(false)
const highlightColor = ref('#ffff00')
const customHighlightColor = ref('#ffff00')
const highlightColorOptions = [
  '#ffff00', '#ffcc00', '#ff9900', '#ff6600', '#ff0000',
  '#ff66cc', '#9933ff', '#0066cc', '#00ff00', '#00ffff'
]
const highlightColorPickerPosition = ref({ x: 0, y: 0 })

function toggleTextColorPicker(event: MouseEvent) {
  event.stopPropagation()
  emit('closeOtherPopups')
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  textColorPickerPosition.value = {
    x: rect.left - 100,
    y: rect.bottom + 8
  }
  showTextColorPicker.value = !showTextColorPicker.value
  showHighlightColorPicker.value = false
}

function toggleHighlightColorPicker(event: MouseEvent) {
  event.stopPropagation()
  emit('closeOtherPopups')
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  highlightColorPickerPosition.value = {
    x: rect.left - 100,
    y: rect.bottom + 8
  }
  showHighlightColorPicker.value = !showHighlightColorPicker.value
  showTextColorPicker.value = false
}

function setColor(color: string) {
  props.editor?.chain().focus().setColor(color).run()
  textColor.value = color
  customTextColor.value = color
}

function removeTextColor() {
  props.editor?.chain().focus().unsetColor().run()
  textColor.value = '#000000'
  customTextColor.value = '#000000'
  showTextColorPicker.value = false
}

function setHighlightColor(color: string) {
  props.editor?.chain().focus().setHighlight({ color }).run()
  highlightColor.value = color
  customHighlightColor.value = color
}

function removeHighlightColor() {
  props.editor?.chain().focus().unsetHighlight().run()
  highlightColor.value = '#ffff00'
  customHighlightColor.value = '#ffff00'
  showHighlightColorPicker.value = false
}

function getContrastColor(backgroundColor: string): string {
  let r: number, g: number, b: number;

  if (backgroundColor.startsWith('#')) {
    const hex = backgroundColor.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (backgroundColor.startsWith('rgb')) {
    const match = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      r = 0;
      g = 0;
      b = 0;
    }
  } else {
    r = 0;
    g = 0;
    b = 0;
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

function showTooltip(event: MouseEvent, text: string) {
  emit('showTooltip', event, text)
}

function hideTooltip() {
  emit('hideTooltip')
}

function closeAllPickers() {
  showTextColorPicker.value = false
  showHighlightColorPicker.value = false
}

defineExpose({
  closeAllPickers
})
</script>

<style scoped>
.color-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
  overflow: hidden;
}

.color-indicator .icon {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.editor-color-picker {
  width: 200px;
  padding: 0.5rem;
}

.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border: 1px solid var(--editor-border-color, #e5e7eb);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.transparent-color {
  position: relative;
  background-color: #ffffff;
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}

.transparent-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid var(--editor-border-color, #e5e7eb);
  border-radius: 50%;
  background-color: transparent;
}

.color-picker-divider {
  height: 1px;
  background-color: var(--editor-border-color, #e5e7eb);
  margin: 0.5rem 0;
}

.custom-color-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.custom-color-label {
  font-size: 12px;
}

.custom-color-input {
  width: 28px;
  height: 28px;
  padding: 0;
  cursor: pointer;
}
</style>
