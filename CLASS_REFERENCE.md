# CSS 类参考手册

本文档列出 VueWordEditor 所有组件的 CSS 类名及其默认样式，方便你参考和覆盖。

## 通用工具类

| 类名                             | 用途           | 默认样式                                                                                                                      |
| ------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `.editor-btn-default`          | 工具栏按钮默认态     | `color: var(--editor-text-color); background: transparent`                                                                |
| `.editor-btn-default:hover`    | 工具栏按钮悬停态     | `background-color: var(--editor-toolbar-bg)`                                                                              |
| `.editor-btn-active`           | 工具栏按钮激活态     | `background-color: var(--editor-primary-color); color: #ffffff`                                                           |
| `.editor-btn-danger`           | 危险操作按钮       | `color: var(--editor-danger-color); background: transparent`                                                              |
| `.editor-btn-danger:hover`     | 危险操作按钮悬停     | `background-color: var(--editor-danger-hover)`                                                                            |
| `.editor-btn-primary`          | 主要按钮         | `background-color: var(--editor-primary-color); color: #ffffff`                                                           |
| `.editor-btn-primary:hover`    | 主要按钮悬停       | `background-color: var(--editor-primary-hover)`                                                                           |
| `.editor-btn-secondary`        | 次要按钮         | `background-color: var(--editor-toolbar-bg); color: var(--editor-text-color)`                                             |
| `.editor-btn-secondary:hover`  | 次要按钮悬停       | `background-color: var(--editor-border-color)`                                                                            |
| `.editor-divider`              | 工具栏分隔线       | `background-color: var(--editor-border-color)`                                                                            |
| `.editor-text-secondary`       | 次要文字         | `color: var(--editor-text-secondary)`                                                                                     |
| `.editor-slider`               | 滑块轨道         | `background-color: var(--editor-border-color); accent-color: var(--editor-primary-color)`                                 |
| `.editor-select`               | 下拉选择框        | `background-color: var(--editor-bg-color); border: 1px solid var(--editor-border-color); color: var(--editor-text-color)` |
| `.editor-select:hover`         | 下拉选择框悬停      | `background-color: var(--editor-toolbar-bg)`                                                                              |
| `.editor-select:focus`         | 下拉选择框聚焦      | `box-shadow: 0 0 0 2px var(--editor-primary-color)`                                                                       |
| `.editor-input`                | 文本输入框        | `background-color: var(--editor-bg-color); border: 1px solid var(--editor-border-color); color: var(--editor-text-color)` |
| `.editor-input:focus`          | 文本输入框聚焦      | `box-shadow: 0 0 0 2px var(--editor-primary-color)`                                                                       |
| `.editor-color-swatch`         | 颜色选择色块       | `border-color: var(--editor-border-color)`                                                                                |
| `.editor-color-picker-divider` | 颜色选择器分隔线     | `border-top: 1px solid var(--editor-border-color)`                                                                        |
| `.editor-color-input`          | 颜色选择器自定义颜色输入 | `border: 1px solid var(--editor-border-color)`                                                                            |

## 布局容器类

| 类名                  | 用途                    | 默认样式                                                                                                                                                               |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.vue-word-editor`  | 编辑器根容器                | `font-family: var(--editor-font-family, ...)`                                                                                                                      |
| `.editor-container` | 编辑器容器                 | `background-color: var(--editor-bg-color); border-radius: var(--editor-radius); border: 1px solid var(--editor-border-color); box-shadow: var(--editor-shadow)`    |
| `.editor-toolbar`   | 工具栏                   | `background-color: var(--editor-toolbar-bg); border-bottom: 1px solid var(--editor-border-color); padding: 0.5rem`                                                 |
| `.editor-popup`     | 弹出层（BubbleMenu、链接菜单等） | `background-color: var(--editor-bg-color); border: 1px solid var(--editor-border-color); border-radius: var(--editor-radius); box-shadow: var(--editor-shadow-lg)` |
| `.editor-tooltip`   | 提示框                   | `background-color: var(--editor-text-color); color: var(--editor-bg-color)`                                                                                        |
| `.editor-content`   | 编辑器内容区域               | `outline: none; min-height: 400px; padding: 1rem`                                                                                                                  |

## 图片节点类（ImageNodeView）

| 类名                             | 用途         | 默认样式                                                                                                                                                                               |
| ------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.image-node-view`             | 图片节点容器     | `position: relative; display: inline-block; border-radius: var(--editor-radius, 2px)`                                                                                              |
| `.image-node-view.is-selected` | 图片选中态      | `box-shadow: 0 0 0 2px var(--editor-selection-color, #4a90d9)`                                                                                                                     |
| `.image-node-view.has-crop`    | 图片已裁剪态     | `box-shadow: 0 0 0 1px var(--editor-selection-color, #4a90d9)`                                                                                                                     |
| `.image-node-view img`         | 图片节点内的 img | `border-radius: var(--editor-radius, 2px)`                                                                                                                                         |
| `.image-resize-handle`         | 图片缩放手柄     | `position: absolute; right: -5px; bottom: -5px; width: 10px; height: 10px; background: var(--editor-selection-color); border: 2px solid var(--editor-bg-color); cursor: se-resize` |
| `.crop-wrapper`                | 裁剪模式容器     | `position: relative; display: inline-block`                                                                                                                                        |
| `.crop-image-wrap`             | 裁剪图片容器     | `position: relative; display: inline-block; line-height: 0`                                                                                                                        |
| `.crop-image`                  | 裁剪模式下的图片   | `display: block; max-width: 100%; border-radius: var(--editor-radius, 2px)`                                                                                                        |
| `.crop-mask`                   | 裁剪遮罩层      | `position: absolute; inset: 0; background: var(--editor-mask-color, rgba(0,0,0,0.5)); pointer-events: none`                                                                        |
| `.crop-box`                    | 裁剪框        | `position: absolute; border: 2px solid var(--editor-bg-color, #fff); outline: 1px solid var(--editor-border-color, rgba(0,0,0,0.3)); cursor: move`                                 |
| `.crop-handle`                 | 裁剪框手柄      | `position: absolute; width: 10px; height: 10px; background: var(--editor-bg-color, #fff); border: 1px solid var(--editor-border-color, #666)`                                      |
| `.crop-handle.handle-nw`       | 左上角手柄      | `top: -5px; left: -5px; cursor: nw-resize`                                                                                                                                         |
| `.crop-handle.handle-n`        | 上方手柄       | `top: -5px; left: 50%; margin-left: -5px; cursor: n-resize`                                                                                                                        |
| `.crop-handle.handle-ne`       | 右上角手柄      | `top: -5px; right: -5px; cursor: ne-resize`                                                                                                                                        |
| `.crop-handle.handle-e`        | 右侧手柄       | `top: 50%; right: -5px; margin-top: -5px; cursor: e-resize`                                                                                                                        |
| `.crop-handle.handle-se`       | 右下角手柄      | `bottom: -5px; right: -5px; cursor: se-resize`                                                                                                                                     |
| `.crop-handle.handle-s`        | 下方手柄       | `bottom: -5px; left: 50%; margin-left: -5px; cursor: s-resize`                                                                                                                     |
| `.crop-handle.handle-sw`       | 左下角手柄      | `bottom: -5px; left: -5px; cursor: sw-resize`                                                                                                                                      |
| `.crop-handle.handle-w`        | 左侧手柄       | `top: 50%; left: -5px; margin-top: -5px; cursor: w-resize`                                                                                                                         |
| `.crop-toolbar`                | 裁剪工具栏      | `display: flex; justify-content: center; gap: 8px; margin-top: 8px`                                                                                                                |
| `.crop-btn`                    | 裁剪按钮       | `padding: 5px 16px; font-size: 12px; border: none; border-radius: var(--editor-radius, 4px); cursor: pointer; font-family: var(--editor-font-family, ...)`                         |
| `.crop-btn.reset`              | 裁剪重置按钮     | `background: var(--editor-toolbar-bg, #f0f0f0); color: var(--editor-text-color, #333); border: 1px solid var(--editor-border-color, #d0d0d0)`                                      |
| `.crop-btn.reset:hover`        | 裁剪重置按钮悬停   | `background: var(--editor-border-color, #e0e0e0)`                                                                                                                                  |
| `.crop-btn.cancel`             | 裁剪取消按钮     | `background: var(--editor-toolbar-bg, #f0f0f0); color: var(--editor-text-color, #333); border: 1px solid var(--editor-border-color, #d0d0d0)`                                      |
| `.crop-btn.cancel:hover`       | 裁剪取消按钮悬停   | `background: var(--editor-border-color, #e0e0e0)`                                                                                                                                  |
| `.crop-btn.apply`              | 裁剪应用按钮     | `background: var(--editor-primary-color, #4a90d9); color: var(--editor-bg-color, #fff)`                                                                                            |
| `.crop-btn.apply:hover`        | 裁剪应用按钮悬停   | `background: var(--editor-primary-hover, #357abd)`                                                                                                                                 |
| `.crop-view`                   | 裁剪结果视图     | `border-radius: var(--editor-radius, 2px)`                                                                                                                                         |

## 布局状态类

| 类名                   | 用途      |
| -------------------- | ------- |
| `.layout-inline`     | 图片嵌入型布局 |
| `.layout-wrap-left`  | 图片左环绕布局 |
| `.layout-wrap-right` | 图片右环绕布局 |
| `.layout-block`      | 图片块级布局  |

## 编辑器内容区域样式

编辑器内容区域使用 `.tiptap` 类，内部元素样式如下：

| 选择器                          | 说明                                      |
| ---------------------------- | --------------------------------------- |
| `.tiptap`                    | 编辑器内容容器，设置 `color` 和 `background-color` |
| `.tiptap h1` \~ `.tiptap h6` | 标题样式                                    |
| `.tiptap p`                  | 段落样式                                    |
| `.tiptap ul` / `.tiptap ol`  | 列表样式                                    |
| `.tiptap li`                 | 列表项样式                                   |
| `.tiptap blockquote`         | 引用块样式                                   |
| `.tiptap a`                  | 链接样式                                    |
| `.tiptap mark`               | 高亮标记样式                                  |
| `.tiptap img`                | 图片样式                                    |
| `.tiptap img.wrap-left`      | 左环绕图片                                   |
| `.tiptap img.wrap-right`     | 右环绕图片                                   |
| `.tiptap img.block`          | 块级图片                                    |

## 自定义示例

```css
/* 修改工具栏按钮样式 */
.editor-btn-default {
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

/* 修改激活态按钮 */
.editor-btn-active {
  background-color: #8b5cf6;
  border-radius: 0.375rem;
}

/* 修改下拉选择框 */
.editor-select {
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
}

/* 修改图片裁剪框手柄颜色 */
.crop-handle {
  background: #8b5cf6;
  border-color: #6d28d9;
}

/* 修改裁剪遮罩透明度 */
.crop-mask {
  background: rgba(0, 0, 0, 0.4);
}

/* 自定义引用块样式 */
.tiptap blockquote {
  border-left-width: 3px;
  border-left-color: #8b5cf6;
  font-style: italic;
}

/* 自定义标题样式 */
.tiptap h1 {
  font-size: 1.75em;
  border-bottom: 2px solid var(--editor-border-color);
  padding-bottom: 0.3em;
}
```

