<template>
  <div
    class="table-grid-picker-button"
    @mouseenter="showTableGridPickerFn($event)"
    @mouseleave="startHideTableGridPickerFn"
  >
    <button
      :class="['editor-button', { active: isInTable }]"
    >
      <Table2 class="icon" />
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="showTableGridPicker"
      class="editor-popup-fixed editor-popup table-grid-picker"
      :style="{ left: tableGridPickerPosition.x + 'px', top: tableGridPickerPosition.y + 'px' }"
      @click.stop
      @mouseenter="onGridPickerMouseEnter"
      @mouseleave="onGridPickerMouseLeave"
    >
      <div class="table-grid-picker-content">
        <div class="table-grid-picker-grid">
          <div
            v-for="row in 8"
            :key="'row-' + row"
            class="table-grid-picker-row"
          >
            <div
              v-for="col in 10"
              :key="'cell-' + row + '-' + col"
              class="table-grid-picker-cell"
              :class="{
                'active': row <= hoveredRow && col <= hoveredCol
              }"
              @mouseenter="onGridCellHover(row, col)"
              @click="onGridCellClick(row, col)"
            ></div>
          </div>
        </div>
        <div class="table-grid-picker-label">
          {{ hoveredRow }} × {{ hoveredCol }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Table2 } from 'lucide-vue-next'

defineProps<{
  isInTable: boolean
}>()

const emit = defineEmits<{
  insertTable: [rows: number, cols: number]
}>()

const showTableGridPicker = ref(false)
const tableGridPickerPosition = ref({ x: 0, y: 0 })
const hoveredRow = ref(0)
const hoveredCol = ref(0)
let hideGridTimer: ReturnType<typeof setTimeout> | null = null

function showTableGridPickerFn(event: MouseEvent) {
  if (hideGridTimer) {
    clearTimeout(hideGridTimer)
    hideGridTimer = null
  }
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  tableGridPickerPosition.value = {
    x: rect.left,
    y: rect.bottom + 8
  }
  showTableGridPicker.value = true
}

function startHideTableGridPickerFn() {
  hideGridTimer = setTimeout(() => {
    showTableGridPicker.value = false
    hoveredRow.value = 0
    hoveredCol.value = 0
  }, 300)
}

function onGridCellHover(row: number, col: number) {
  hoveredRow.value = row
  hoveredCol.value = col
}

function onGridCellClick(row: number, col: number) {
  emit('insertTable', row, col)
  showTableGridPicker.value = false
  hoveredRow.value = 0
  hoveredCol.value = 0
}

function onGridPickerMouseEnter() {
  if (hideGridTimer) {
    clearTimeout(hideGridTimer)
    hideGridTimer = null
  }
}

function onGridPickerMouseLeave() {
  showTableGridPicker.value = false
  hoveredRow.value = 0
  hoveredCol.value = 0
}

function closeGridPicker() {
  showTableGridPicker.value = false
  hoveredRow.value = 0
  hoveredCol.value = 0
}

defineExpose({
  closeGridPicker
})
</script>

<style scoped>
.table-grid-picker-button {
  display: inline-block;
}

.table-grid-picker-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.table-grid-picker-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.table-grid-picker-row {
  display: flex;
  gap: 2px;
}

.table-grid-picker-cell {
  width: 16px;
  height: 16px;
  border: 1px solid var(--editor-border-color, #e5e7eb);
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.1s;
}

.table-grid-picker-cell.active {
  background-color: var(--editor-primary-color, #3b82f6);
  border-color: var(--editor-primary-color, #3b82f6);
}

.table-grid-picker-label {
  font-size: 12px;
  color: var(--editor-text-secondary, #6b7280);
}
</style>
