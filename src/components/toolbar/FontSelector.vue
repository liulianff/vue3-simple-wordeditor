<template>
  <div class="toolbar-group">
    <select
      :value="currentFontFamily"
      @change="onFontFamilyChange"
      class="editor-select"
      style="min-width: 100px;"
    >
      <option value="none">{{ t('toolbar.fontFamily.none') }}</option>
      <option value="sans-serif">{{ t('toolbar.fontFamily.sansSerif') }}</option>
      <option value="serif">{{ t('toolbar.fontFamily.serif') }}</option>
      <option value="monospace">{{ t('toolbar.fontFamily.monospace') }}</option>
      <option value="Microsoft+YaHei">{{ t('toolbar.fontFamily.microsoftYaHei') }}</option>
      <option value="SimSun">{{ t('toolbar.fontFamily.simSun') }}</option>
      <option value="SimHei">{{ t('toolbar.fontFamily.simHei') }}</option>
      <option value="KaiTi">{{ t('toolbar.fontFamily.kaiTi') }}</option>
    </select>
    <select
      :value="currentFontSize"
      @change="onFontSizeChange"
      class="editor-select"
      style="min-width: 60px;"
    >
      <option value="none">{{ t('toolbar.fontSizeNone') }}</option>
      <option value="12">12px</option>
      <option value="14">14px</option>
      <option value="16">16px</option>
      <option value="18">18px</option>
      <option value="20">20px</option>
      <option value="24">24px</option>
      <option value="28">28px</option>
      <option value="32">32px</option>
      <option value="36">36px</option>
      <option value="48">48px</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

defineProps<{
  currentFontFamily: string
  currentFontSize: string
}>()

const emit = defineEmits<{
  setFontSize: [size: string]
  setFontFamily: [family: string]
}>()

const { t } = useI18n()

function onFontFamilyChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('setFontFamily', value)
}

function onFontSizeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('setFontSize', value)
}
</script>
