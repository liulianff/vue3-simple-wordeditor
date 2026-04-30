<template>
  <div class="toolbar-group">
    <button
      @click="insertLink($event)"
      :class="['editor-button', { active: isLink }]"
      @mouseenter="showTooltip($event, t('toolbar.insertLink'))"
      @mouseleave="hideTooltip"
    >
      <Link class="icon" />
    </button>
    <button
      @click="removeLink"
      :class="['editor-button']"
      @mouseenter="showTooltip($event, t('toolbar.removeLink'))"
      @mouseleave="hideTooltip"
    >
      <Unlink class="icon" />
    </button>
    <button
      @click="insertImage"
      :class="['editor-button']"
      @mouseenter="showTooltip($event, t('toolbar.insertImage'))"
      @mouseleave="hideTooltip"
    >
      <Image class="icon" />
    </button>
  </div>

  <Teleport to="body">
    <div v-if="showLinkDialog" class="editor-popup-fixed editor-popup link-dialog" :style="{ left: linkDialogPosition.x + 'px', top: linkDialogPosition.y + 'px' }" @click.stop>
      <div class="link-dialog-content">
        <input
          v-model="linkUrl"
          type="url"
          placeholder="https://..."
          class="editor-input link-input"
        />
        <div class="link-dialog-buttons">
          <button @click="showLinkDialog = false" class="link-dialog-btn editor-btn-secondary">
            {{ t('toolbar.linkDialog.cancel') }}
          </button>
          <button @click="confirmLink" class="link-dialog-btn editor-btn-primary">
            {{ t('toolbar.linkDialog.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Link, Unlink, Image } from 'lucide-vue-next'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  editor: any
  isLink: boolean
}>()

const emit = defineEmits<{
  insertImage: []
  setLink: [url: string]
  showTooltip: [event: MouseEvent, text: string]
  hideTooltip: []
}>()

const { t } = useI18n()

const showLinkDialog = ref(false)
const linkUrl = ref('')
const linkDialogPosition = ref({ x: 0, y: 0 })

function insertLink(event: MouseEvent) {
  event.stopPropagation()
  const selection = props.editor?.state.selection
  if (selection) {
    showLinkDialog.value = true
    const target = event.currentTarget as HTMLElement
    if (target) {
      const rect = target.getBoundingClientRect()
      linkDialogPosition.value = {
        x: rect.left + rect.width / 2 - 100,
        y: rect.bottom + 8
      }
    }
  }
}

function confirmLink() {
  if (linkUrl.value) {
    props.editor?.chain().focus().setLink({ href: linkUrl.value, target: '_blank' }).run()
    emit('setLink', linkUrl.value)
    showLinkDialog.value = false
    linkUrl.value = ''
  }
}

function insertImage() {
  emit('insertImage')
}

function removeLink() {
  props.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
}

function showTooltip(event: MouseEvent, text: string) {
  emit('showTooltip', event, text)
}

function hideTooltip() {
  emit('hideTooltip')
}
</script>

<style scoped>
.link-dialog {
  width: 200px;
}

.link-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-input {
  width: 100%;
}

.link-dialog-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.link-dialog-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
</style>
