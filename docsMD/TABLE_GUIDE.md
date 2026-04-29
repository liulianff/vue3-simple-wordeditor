# 表格编辑教程

本教程介绍如何在 VueWordEditor 中使用表格编辑功能。

***

## 插入表格

### 使用网格选择器

1. 将鼠标悬停在工具栏的表格图标上
2. 会弹出一个 8×10 的网格选择器
3. 拖动鼠标选择所需的行数和列数（如 3×4）
4. 点击即可插入表格

```vue
<template>
  <VueWordEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue3-simple-wordeditor'

const content = ref('')
</script>
```

***

## 编辑表格

### 方式一：表格控制按钮

表格下方会显示两个按钮：

- **＋ 蓝色按钮**：在表格末尾添加新行
- **＿ 红色按钮**：删除当前行

### 方式二：右键上下文菜单

在表格单元格中右键，会弹出编辑菜单，支持：

- 在左侧/右侧插入列
- 在上方/下方插入行
- 删除行/列
- 合并/拆分单元格
- 切换表头行/列
- 删除整个表格

### 方式三：键盘快捷键

- 选中整个表格后，按 `Backspace` 键可删除表格

***

## 表格操作详解

### 行操作

| 操作 | 说明 |
|------|------|
| 在上方插入行 | 在当前行上方插入新行 |
| 在下方插入行 | 在当前行下方插入新行 |
| 删除行 | 删除当前行 |

### 列操作

| 操作 | 说明 |
|------|------|
| 在左侧插入列 | 在当前列左侧插入新列 |
| 在右侧插入列 | 在当前列右侧插入新列 |
| 删除列 | 删除当前列 |

### 单元格操作

| 操作 | 说明 |
|------|------|
| 合并单元格 | 将选中的多个单元格合并为一个 |
| 拆分单元格 | 将合并的单元格拆分为多个 |

### 表头操作

| 操作 | 说明 |
|------|------|
| 切换表头行 | 将当前行切换为表头或普通行 |
| 切换表头列 | 将当前列切换为表头或普通列 |

***

## 自定义表格样式

使用 CSS 变量自定义表格外观：

```vue
<style>
.vue-word-editor {
  --editor-table-border: #d1d5db;
  --editor-table-header-bg: #f1f3f5;
  --editor-table-selected-bg: rgba(59, 130, 246, 0.15);
}
</style>
```

### 可用的 CSS 变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `--editor-table-border` | 表格边框颜色 | `#d1d5db` |
| `--editor-table-header-bg` | 表头背景色 | `#f1f3f5` |
| `--editor-table-selected-bg` | 选中单元格背景色 | `rgba(59, 130, 246, 0.15)` |

***

## 表格相关 CSS 类名

| 类名 | 说明 |
|------|------|
| `.tiptap table` | 表格容器 |
| `.tiptap table td` | 普通单元格 |
| `.tiptap table th` | 表头单元格 |
| `.tiptap table .selectedCell` | 选中的单元格 |
| `.tiptap table .column-resize-handle` | 列宽拖拽手柄 |
| `.tiptap .resize-cursor` | 调整列宽时的光标 |
| `.table-controls-container` | 表格控制按钮容器 |
| `.table-control-btn` | 表格控制按钮 |
| `.table-control-add-row` | 添加行按钮 |
| `.table-control-delete-row` | 删除行按钮 |
| `.table-context-menu` | 右键上下文菜单 |
| `.table-context-menu-item` | 上下文菜单项 |
| `.table-context-menu-danger` | 危险操作菜单项（如删除） |
| `.table-grid-picker` | 网格选择器 |
| `.table-grid-picker-cell` | 网格选择器单元格 |

***

## 常见问题

### Q: 如何调整列宽？

A: 将鼠标放在列边框上，光标会变为调整大小的形状，拖动即可调整列宽。

### Q: 如何选中多个单元格？

A: 按住鼠标左键拖动，可以选中多个单元格，然后进行合并等操作。

### Q: 表格后面无法输入文字？

A: 表格后面会自动添加一个空段落，点击该段落即可输入文字。

### Q: 如何删除整个表格？

A: 三种方式：
1. 右键表格，选择"删除表格"
2. 选中整个表格后按 `Backspace` 键
3. 使用工具栏中的表格菜单

***

## 相关文档

- [样式自定义指南](./STYLING_GUIDE.md)
- [完整使用指南](./USAGE_GUIDE.md)
- [所有 CSS 类名参考](./CLASS_REFERENCE.md)
