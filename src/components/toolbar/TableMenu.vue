<template>
  <Teleport to="body">
    <div
      v-if="showTableMenu"
      class="editor-popup-fixed editor-popup table-menu"
      :style="{ left: tableMenuPosition.x + 'px', top: tableMenuPosition.y + 'px' }"
      @click.stop
    >
      <div class="table-menu-content">
        <button
          @click="handleInsertTable"
          class="table-menu-item editor-btn-default"
        >
          <Table2 class="icon" />
          <span>{{ t('toolbar.table.insertTable') }}</span>
        </button>
        <template v-if="isInTable">
          <div class="editor-divider"></div>
          <button
            @click="handleTableAction('addColumnBefore')"
            class="table-menu-item editor-btn-default"
          >
            <Plus class="icon" />
            <span>{{ t('toolbar.table.addColumnBefore') }}</span>
          </button>
          <button
            @click="handleTableAction('addColumnAfter')"
            class="table-menu-item editor-btn-default"
          >
            <Plus class="icon" />
            <span>{{ t('toolbar.table.addColumnAfter') }}</span>
          </button>
          <button
            @click="handleTableAction('deleteColumn')"
            class="table-menu-item editor-btn-default"
          >
            <Minus class="icon" />
            <span>{{ t('toolbar.table.deleteColumn') }}</span>
          </button>
          <div class="editor-divider"></div>
          <button
            @click="handleTableAction('addRowBefore')"
            class="table-menu-item editor-btn-default"
          >
            <Plus class="icon" />
            <span>{{ t('toolbar.table.addRowBefore') }}</span>
          </button>
          <button
            @click="handleTableAction('addRowAfter')"
            class="table-menu-item editor-btn-default"
          >
            <Plus class="icon" />
            <span>{{ t('toolbar.table.addRowAfter') }}</span>
          </button>
          <button
            @click="handleTableAction('deleteRow')"
            class="table-menu-item editor-btn-default"
          >
            <Minus class="icon" />
            <span>{{ t('toolbar.table.deleteRow') }}</span>
          </button>
          <div class="editor-divider"></div>
          <button
            @click="handleTableAction('mergeCells')"
            class="table-menu-item editor-btn-default"
          >
            <Merge class="icon" />
            <span>{{ t('toolbar.table.mergeCells') }}</span>
          </button>
          <button
            @click="handleTableAction('splitCell')"
            class="table-menu-item editor-btn-default"
          >
            <Split class="icon" />
            <span>{{ t('toolbar.table.splitCell') }}</span>
          </button>
          <div class="editor-divider"></div>
          <button
            @click="handleTableAction('toggleHeaderColumn')"
            class="table-menu-item editor-btn-default"
          >
            <Columns class="icon" />
            <span>{{ t('toolbar.table.toggleHeaderColumn') }}</span>
          </button>
          <button
            @click="handleTableAction('toggleHeaderRow')"
            class="table-menu-item editor-btn-default"
          >
            <Rows class="icon" />
            <span>{{ t('toolbar.table.toggleHeaderRow') }}</span>
          </button>
          <div class="editor-divider"></div>
          <button
            @click="handleTableAction('deleteTable')"
            class="table-menu-item editor-btn-danger"
          >
            <Trash2 class="icon" />
            <span>{{ t('toolbar.table.deleteTable') }}</span>
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Table2, Plus, Minus, Trash2, Merge, Split, Columns, Rows } from 'lucide-vue-next'
import { useI18n } from '../../composables/useI18n'

defineProps<{
  showTableMenu: boolean
  tableMenuPosition: { x: number; y: number }
  isInTable: boolean
}>()

const emit = defineEmits<{
  insertTable: []
  addColumnBefore: []
  addColumnAfter: []
  deleteColumn: []
  addRowBefore: []
  addRowAfter: []
  deleteRow: []
  deleteTable: []
  mergeCells: []
  splitCell: []
  toggleHeaderColumn: []
  toggleHeaderRow: []
  closeMenu: []
}>()

const { t } = useI18n()

function handleInsertTable() {
  emit('insertTable')
  emit('closeMenu')
}

function handleTableAction(action: string) {
  emit(action as any)
  emit('closeMenu')
}
</script>

<style scoped>
.table-menu-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.table-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  text-align: left;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--editor-text-color, #1f2937);
}

.table-menu-item:hover {
  background-color: var(--editor-border-color, #e5e7eb);
}

.table-menu-item.editor-btn-danger {
  color: #ef4444;
}

.table-menu-item.editor-btn-danger:hover {
  background-color: #fef2f2;
}

.editor-divider {
  width: 100%;
  height: 1px;
  background-color: var(--editor-border-color, #e5e7eb);
  margin: 0.25rem 0;
}
</style>
