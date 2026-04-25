# 国际化（i18n）自定义指南

本文档详细介绍如何为 VueWordEditor 添加自定义语言支持。

## 目录

- [快速开始](#快速开始)
- [内置语言](#内置语言)
- [注册自定义语言包](#注册自定义语言包)
- [完整示例](#完整示例)
- [类型定义](#类型定义)
- [高级用法](#高级用法)
- [常见问题](#常见问题)

***

## 快速开始

### 1. 切换内置语言

```vue
<template>
  <!-- 使用英文 -->
  <VueWordEditor v-model="content" locale="en-US" />

  <!-- 使用中文 -->
  <VueWordEditor v-model="content" locale="zh-CN" />
</template>
```

### 2. 动态切换语言

```vue
<template>
  <div>
    <button @click="switchLocale('zh-CN')">中文</button>
    <button @click="switchLocale('en-US')">English</button>
    <button @click="switchLocale('ja-JP')">日本語</button>

    <VueWordEditor v-model="content" :locale="currentLocale" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { registerLocale } from 'vue-word-editor'

// 先注册自定义语言
registerLocale('ja-JP', {
  toolbar: {
    heading: { paragraph: '段落', h1: '見出し 1', h2: '見出し 2', h3: '見出し 3', h4: '見出し 4', h5: '見出し 5', h6: '見出し 6' },
    bold: '太字',
    italic: '斜体',
    // ... 其他字段
  },
  // ... 其他模块
  placeholder: '編集を開始...',
})

const currentLocale = ref('zh-CN')

function switchLocale(locale: string) {
  currentLocale.value = locale
}
</script>
```

***

## 内置语言

VueWordEditor 内置了以下语言包：

| 语言   | 标识符     | 说明      |
| ---- | ------- | ------- |
| 简体中文 | `zh-CN` | 默认语言    |
| 英文   | `en-US` | English |

***

## 注册自定义语言包

### 基本步骤

**步骤 1：导入必要的模块**

```typescript
import { registerLocale } from 'vue-word-editor'
import type { LocaleMessages } from 'vue-word-editor'
```

**步骤 2：创建语言包**

创建语言包有两种方式：

#### 方式 A：基于现有语言包扩展

```typescript
import { enUS } from 'vue-word-editor'

const myLocale: LocaleMessages = {
  ...enUS,  // 继承英文语言包
  toolbar: {
    ...enUS.toolbar,
    bold: 'Bold (Custom)',  // 覆盖特定字段
  },
  placeholder: 'Start typing...',
}

registerLocale('custom-en', myLocale)
```

#### 方式 B：完全自定义语言包

```typescript
import type { LocaleMessages } from 'vue-word-editor'

const myLocale: LocaleMessages = {
  toolbar: {
    heading: {
      paragraph: '正文',
      h1: '一级标题',
      h2: '二级标题',
      h3: '三级标题',
      h4: '四级标题',
      h5: '五级标题',
      h6: '六级标题',
    },
    bold: '粗体',
    italic: '斜体',
    underline: '下划线',
    strike: '删除线',
    fontFamily: {
      sansSerif: '无衬线',
      serif: '衬线',
      monospace: '等宽',
      microsoftYaHei: '微软雅黑',
      simSun: '宋体',
      simHei: '黑体',
      kaiTi: '楷体',
    },
    fontSize: '字号',
    textColor: '文字颜色',
    highlightColor: '背景高亮',
    customColor: '自定义颜色',
    align: {
      left: '左对齐',
      center: '居中',
      right: '右对齐',
      justify: '两端对齐',
    },
    bulletList: '无序列表',
    orderedList: '有序列表',
    blockquote: '引用',
    insertLink: '插入链接',
    removeLink: '删除链接',
    insertImage: '插入图片',
    export: '导出文档',
    linkDialog: {
      placeholder: '输入链接地址',
      confirm: '确定',
      cancel: '取消',
    },
  },
  bubbleMenu: {
    imageLayout: {
      inline: '嵌入型',
      wrapLeft: '左环绕',
      wrapRight: '右环绕',
      block: '块级',
    },
    cropImage: '裁剪图片',
    deleteImage: '删除图片',
    bold: '加粗',
    italic: '斜体',
    underline: '下划线',
    strike: '删除线',
    bulletList: '无序列表',
    orderedList: '有序列表',
    blockquote: '引用',
  },
  linkMenu: {
    edit: '修改链接',
    remove: '取消链接',
  },
  imageEditor: {
    title: '图片编辑',
    crop: {
      cancel: '取消裁剪',
      confirm: '确认裁剪',
    },
    edit: {
      width: '宽度',
      rotation: '旋转',
      textWrap: '文字环绕方式',
      wrapNone: '无环绕',
      wrapLeft: '左环绕',
      wrapRight: '右环绕',
      blockCenter: '块级居中',
      rightMargin: '右边距',
      leftMargin: '左边距',
      bottomMargin: '下边距',
      crop: '裁剪',
      reset: '重置',
      apply: '应用',
    },
  },
  imageNodeView: {
    resetCrop: '重置裁剪',
    cancel: '取消',
    applyCrop: '确认裁剪',
  },
  placeholder: '开始编辑...',
}
```

**步骤 3：注册语言包**

```typescript
// 注册语言包（通常在应用入口文件）
registerLocale('my-custom-locale', myLocale)
```

**步骤 4：使用自定义语言**

```vue
<VueWordEditor v-model="content" locale="my-custom-locale" />
```

***

## 完整示例

以下是一个完整的自定义日语语言包的示例：

### 日语语言包

```typescript
// ./locale/jaJP.ts
import type { LocaleMessages } from 'vue-word-editor'

export const jaJP: LocaleMessages = {
  toolbar: {
    heading: {
      paragraph: '段落',
      h1: '見出し 1',
      h2: '見出し 2',
      h3: '見出し 3',
      h4: '見出し 4',
      h5: '見出し 5',
      h6: '見出し 6',
    },
    bold: '太字',
    italic: '斜体',
    underline: '下線',
    strike: '取り消し線',
    fontFamily: {
      sansSerif: 'サンセリフ',
      serif: 'セリフ',
      monospace: '等幅',
      microsoftYaHei: 'Microsoft YaHei',
      simSun: '宋体',
      simHei: 'SimHei',
      kaiTi: '楷体',
    },
    fontSize: 'フォントサイズ',
    textColor: '文字色',
    highlightColor: 'ハイライト',
    customColor: 'カスタム色',
    align: {
      left: '左揃え',
      center: '中央揃え',
      right: '右揃え',
      justify: '両端揃え',
    },
    bulletList: '箇条書き',
    orderedList: '番号付きリスト',
    blockquote: '引用',
    insertLink: 'リンク挿入',
    removeLink: 'リンク削除',
    insertImage: '画像挿入',
    export: 'エクスポート',
    linkDialog: {
      placeholder: 'URLを入力',
      confirm: '確定',
      cancel: 'キャンセル',
    },
  },
  bubbleMenu: {
    imageLayout: {
      inline: 'インライン',
      wrapLeft: '左回り込み',
      wrapRight: '右回り込み',
      block: 'ブロック',
    },
    cropImage: '画像を切り抜く',
    deleteImage: '画像を削除',
    bold: '太字',
    italic: '斜体',
    underline: '下線',
    strike: '取り消し線',
    bulletList: '箇条書き',
    orderedList: '番号付きリスト',
    blockquote: '引用',
  },
  linkMenu: {
    edit: 'リンクを編集',
    remove: 'リンクを解除',
  },
  imageEditor: {
    title: '画像編集',
    crop: {
      cancel: '切り抜きキャンセル',
      confirm: '切り抜き確定',
    },
    edit: {
      width: '幅',
      rotation: '回転',
      textWrap: 'テキストの折り返し',
      wrapNone: '折り返しなし',
      wrapLeft: '左回り込み',
      wrapRight: '右回り込み',
      blockCenter: 'ブロック中央',
      rightMargin: '右マージン',
      leftMargin: '左マージン',
      bottomMargin: '下マージン',
      crop: '切り抜き',
      reset: 'リセット',
      apply: '適用',
    },
  },
  imageNodeView: {
    resetCrop: '切り抜きリセット',
    cancel: 'キャンセル',
    applyCrop: '切り抜き適用',
  },
  placeholder: '編集を開始...',
}
```

### 在 Vue 应用中使用

```vue
<!-- App.vue -->
<template>
  <div>
    <div class="locale-switcher">
      <button @click="locale = 'zh-CN'">中文</button>
      <button @click="locale = 'en-US'">English</button>
      <button @click="locale = 'ja-JP'">日本語</button>
    </div>

    <VueWordEditor v-model="content" :locale="locale" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from 'vue-word-editor'
import { registerLocale } from 'vue-word-editor'
import { jaJP } from './locale/jaJP'

// 注册日语语言包
registerLocale('ja-JP', jaJP)

const locale = ref('zh-CN')
const content = ref('')
</script>

<style>
.locale-switcher button {
  margin-right: 8px;
  padding: 4px 12px;
}
</style>
```

***

## 类型定义

`LocaleMessages` 接口定义了语言包的所有字段：

```typescript
interface LocaleMessages {
  toolbar: {
    heading: {
      paragraph: string
      h1: string
      h2: string
      h3: string
      h4: string
      h5: string
      h6: string
    }
    bold: string
    italic: string
    underline: string
    strike: string
    fontFamily: {
      sansSerif: string
      serif: string
      monospace: string
      microsoftYaHei: string
      simSun: string
      simHei: string
      kaiTi: string
    }
    fontSize: string
    textColor: string
    highlightColor: string
    customColor: string
    align: {
      left: string
      center: string
      right: string
      justify: string
    }
    bulletList: string
    orderedList: string
    blockquote: string
    insertLink: string
    removeLink: string
    insertImage: string
    export: string
    linkDialog: {
      placeholder: string
      confirm: string
      cancel: string
    }
  }
  bubbleMenu: {
    imageLayout: {
      inline: string
      wrapLeft: string
      wrapRight: string
      block: string
    }
    cropImage: string
    deleteImage: string
    bold: string
    italic: string
    underline: string
    strike: string
    bulletList: string
    orderedList: string
    blockquote: string
  }
  linkMenu: {
    edit: string
    remove: string
  }
  imageEditor: {
    title: string
    crop: {
      cancel: string
      confirm: string
    }
    edit: {
      width: string
      rotation: string
      textWrap: string
      wrapNone: string
      wrapLeft: string
      wrapRight: string
      blockCenter: string
      rightMargin: string
      leftMargin: string
      bottomMargin: string
      crop: string
      reset: string
      apply: string
    }
  }
  imageNodeView: {
    resetCrop: string
    cancel: string
    applyCrop: string
  }
  placeholder: string
}
```

### 各字段用途说明

| 模块                | 字段                             | 用途        |
| ----------------- | ------------------------------ | --------- |
| **toolbar**       | -                              | 工具栏相关文本   |
| <br />            | `heading`                      | 标题级别菜单    |
| <br />            | `bold/italic/underline/strike` | 文字格式按钮    |
| <br />            | `fontFamily`                   | 字体选择菜单    |
| <br />            | `fontSize`                     | 字号按钮      |
| <br />            | `textColor/highlightColor`     | 颜色选择      |
| <br />            | `align`                        | 对齐方式菜单    |
| <br />            | `bulletList/orderedList`       | 列表按钮      |
| <br />            | `blockquote`                   | 引用按钮      |
| <br />            | `insertLink/removeLink`        | 链接操作      |
| <br />            | `insertImage`                  | 图片插入      |
| <br />            | `export`                       | 导出按钮      |
| <br />            | `linkDialog`                   | 链接弹窗      |
| **bubbleMenu**    | -                              | 图片选中气泡菜单  |
| <br />            | `imageLayout`                  | 图片布局选项    |
| <br />            | `cropImage/deleteImage`        | 图片操作      |
| <br />            | 格式按钮                           | 同 toolbar |
| **linkMenu**      | -                              | 链接编辑菜单    |
| **imageEditor**   | -                              | 图片编辑弹窗    |
| <br />            | `title`                        | 弹窗标题      |
| <br />            | `crop`                         | 裁剪相关按钮    |
| <br />            | `edit`                         | 编辑表单字段    |
| **imageNodeView** | -                              | 图片裁剪浮层按钮  |
| **placeholder**   | -                              | 编辑器占位符    |

***

## 高级用法

### 部分字段覆盖

如果只想覆盖部分文本，可以继承内置语言包：

```typescript
import { zhCN, registerLocale } from 'vue-word-editor'

// 只覆盖工具栏的加粗按钮文字
const partialLocale = {
  ...zhCN,
  toolbar: {
    ...zhCN.toolbar,
    bold: '加粗（自定义）',
  },
}

registerLocale('partial-custom', partialLocale)
```

### 运行时切换语言

```typescript
import { ref, watch } from 'vue'
import { registerLocale } from 'vue-word-editor'

const currentLocale = ref('zh-CN')

watch(currentLocale, (newLocale) => {
  // 可以在这里执行一些副作用操作
  console.log('Language switched to:', newLocale)
})
```

### 语言包验证

建议使用 TypeScript 来确保语言包完整性：

```typescript
import { registerLocale } from 'vue-word-editor'
import type { LocaleMessages } from 'vue-word-editor'
import { zhCN } from 'vue-word-editor'

// TypeScript 会检查是否包含所有必要字段
const customLocale: LocaleMessages = {
  // 如果缺少字段，TypeScript 会报错
  ...zhCN,
  toolbar: {
    ...zhCN.toolbar,
    bold: 'Custom Bold',
  },
}

registerLocale('validated', customLocale)
```

***

## 常见问题

### Q: 语言包必须在使用前注册吗？

**A:** 是的，`registerLocale` 必须在 `VueWordEditor` 组件渲染之前调用。建议将语言包注册放在应用入口文件（如 `main.ts`）中。

### Q: 可以注册多少个语言包？

**A:** 没有限制，但建议只注册你需要的语言包。

### Q: 如何处理缺失的翻译字段？

**A:** 如果某个字段未提供，会自动回退到内置的默认语言（`zh-CN`）。建议始终提供完整的语言包以避免界面出现空白文本。

### Q: 语言包支持 RTL（从右到左）语言吗？

**A:** 当前版本不直接支持 RTL。如需支持阿拉伯语、希伯来语等 RTL 语言，可能需要额外处理样式和布局。

### Q: 如何获取所有已注册的语言？

**A:** 当前 API 不支持列出已注册的语言。如需实现语言选择器，需要在应用中自行维护语言列表。

***

## 导出清单

使用 `registerLocale` 前，需要确保从 `vue-word-editor` 导入：

```typescript
import {
  registerLocale, // 注册自定义语言包
  zhCN,           // 中文语言包（可作为参考或扩展基础）
  enUS,           // 英文语言包（可作为参考或扩展基础）
} from 'vue-word-editor'

import type {
  LocaleMessages, // 语言包类型定义
  Locale,         // 语言标识符类型
} from 'vue-word-editor'
```

