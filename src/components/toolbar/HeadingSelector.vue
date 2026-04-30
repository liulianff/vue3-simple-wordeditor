<template>
  <select
    :value="currentHeadingLevel"
    @change="onHeadingChange"
    class="editor-select"
    style="min-width: 90px;"
  >
    <option value="0">{{ t('toolbar.heading.paragraph') }}</option>
    <option value="1">{{ t('toolbar.heading.h1') }}</option>
    <option value="2">{{ t('toolbar.heading.h2') }}</option>
    <option value="3">{{ t('toolbar.heading.h3') }}</option>
    <option value="4">{{ t('toolbar.heading.h4') }}</option>
    <option value="5">{{ t('toolbar.heading.h5') }}</option>
    <option value="6">{{ t('toolbar.heading.h6') }}</option>
  </select>
</template>

<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

defineProps<{
  currentHeadingLevel: number
}>()

const emit = defineEmits<{
  setHeading: [level: number]
}>()

const { t } = useI18n()

function onHeadingChange(event: Event) {
  const value = parseInt((event.target as HTMLSelectElement).value)
  emit('setHeading', value)
}
</script>
