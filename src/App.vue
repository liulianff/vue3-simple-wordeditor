<template>
  <div class="app-page" :class="{ dark: effectiveTheme === 'dark' }">
    <div class="min-h-screen transition-colors duration-200" style="background-color: var(--editor-toolbar-bg, #f3f4f6);">
      <div class="max-w-4xl mx-auto py-8 px-4">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold transition-colors" style="color: var(--editor-text-color, #1f2937);">Vue Word Editor</h1>
          
          <div class="flex items-center gap-2">
            <button
              v-for="t in themeOptions"
              :key="t.value"
              @click="pageTheme = t.value"
              class="px-3 py-1.5 text-sm rounded-lg transition-all theme-btn"
              :class="{ active: pageTheme === t.value }"
            >
              {{ t.label }}
            </button>
            <div class="w-px h-6 mx-1" style="background-color: var(--editor-border-color, #d1d5db);"></div>
            <button
              v-for="opt in localeOptions"
              :key="opt.value"
              @click="currentLocale = opt.value"
              class="px-3 py-1.5 text-sm rounded-lg transition-all theme-btn"
              :class="{ active: currentLocale === opt.value }"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="rounded-lg overflow-hidden" style="box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));">
          <VueWordEditor
            ref="editorRef"
            v-model="content"
            :theme="pageTheme"
            :locale="currentLocale"
            placeholder="开始编辑您的文档..."
            class="h-[500px]"
          />
        </div>

        <div class="mt-6 rounded-lg p-6 transition-colors" style="background-color: var(--editor-bg-color, #ffffff); box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));">
          <h2 class="text-lg font-semibold mb-4 transition-colors" style="color: var(--editor-text-color, #374151);">HTML 输出</h2>
          <textarea
            v-model="content"
            class="w-full h-40 p-3 rounded-lg font-mono text-sm resize-none focus:outline-none transition-colors"
            style="background-color: var(--editor-bg-color, #ffffff); color: var(--editor-text-color, #374151); border: 1px solid var(--editor-border-color, #e5e7eb);"
            placeholder="HTML content..."
          ></textarea>
        </div>

        <div class="mt-6 rounded-lg p-6 transition-colors" style="background-color: var(--editor-bg-color, #ffffff); box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));">
          <h2 class="text-lg font-semibold mb-4 transition-colors" style="color: var(--editor-text-color, #374151);">图片上传测试</h2>
          <button
            @click="testUpload"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            模拟上传图片
          </button>
          <p class="mt-2 text-sm" style="color: var(--editor-text-secondary, #6b7280);">
            {{ uploadStatus }}
          </p>
        </div>

        <div class="mt-6 rounded-lg p-6 transition-colors" style="background-color: var(--editor-bg-color, #ffffff); box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));">
          <h2 class="text-lg font-semibold mb-4 transition-colors" style="color: var(--editor-text-color, #374151);">JSON 导入测试</h2>
          <textarea
            v-model="jsonContent"
            class="w-full h-40 p-3 rounded-lg font-mono text-sm resize-none focus:outline-none transition-colors mb-4"
            style="background-color: var(--editor-bg-color, #ffffff); color: var(--editor-text-color, #374151); border: 1px solid var(--editor-border-color, #e5e7eb);"
            placeholder="粘贴导出的 JSON 数据..."
          ></textarea>
          <button
            @click="importFromJSON"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            从 JSON 导入
          </button>
          <p class="mt-2 text-sm" style="color: var(--editor-text-secondary, #6b7280);">
            {{ importStatus }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VueWordEditor from './components/VueWordEditor.vue'

const pageTheme = ref<'light' | 'dark' | 'auto'>('light')
const currentLocale = ref<'zh-CN' | 'en-US'>('zh-CN')
const editorRef = ref<InstanceType<typeof VueWordEditor> | null>(null)
const uploadStatus = ref('')
const jsonContent = ref('')
const importStatus = ref('')

const effectiveTheme = computed(() => {
  if (pageTheme.value !== 'auto') return pageTheme.value
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
})

const themeOptions = [
  { label: '☀️ 亮色', value: 'light' as const },
  { label: '🌙 暗色', value: 'dark' as const },
  { label: '🖥️ 跟随系统', value: 'auto' as const },
]

const localeOptions = [
  { label: '中文', value: 'zh-CN' as const },
  { label: 'English', value: 'en-US' as const },
]

const content = ref(`<h1>欢迎使用 Vue Word Editor</h1>
<p>这是一个基于 Vue3 + TipTap3 构建的富文本编辑器。</p>
<h2>功能特点</h2>
<ul>
<li><strong>字体设置</strong> - 支持粗细，大小、颜色、背景色</li>
<li><strong>标题</strong> - 支持 H1-H6 多级标题</li>
<li><strong>对齐</strong> - 支持左对齐、居中、右对齐，两端对齐</li>
<li><strong>图片编辑</strong> - 支持插入和编辑图片</li>
<li><strong>引用</strong> - 支持引用块</li>
<li><strong>列表</strong> - 支持有序和无序列表</li>
<li><strong>链接</strong> - 支持插入文本链接</li>
</ul>
<blockquote>这是一段引用文本，用于引用他人的话语或重要信息。</blockquote>
<p><em>支持斜体</em>、<u>下划线</u>、<s>删除线</s>等文本格式。</p>
<p>支持 <span style="color: #3b82f6;">自定义颜色</span> 和 <mark style="background-color: #ffff00;">高亮标记</mark>。</p>`)

async function testUpload() {
  if (!editorRef.value) {
    uploadStatus.value = '编辑器未初始化'
    return
  }

  uploadStatus.value = '正在获取图片...'

  try {
    // 直接调用组件暴露的方法
    const images = await editorRef.value.getImagesForUpload()
    console.log('找到的图片:', images)

    if (images.length === 0) {
      uploadStatus.value = '没有图片需要上传'
      return
    }

    uploadStatus.value = `找到 ${images.length} 张图片，开始模拟上传...`

    // 模拟上传，返回假 URL
    const uploadResults = images.map((img, index) => ({
      originalSrc: img.originalSrc,
      url: `https://fake-upload.example.com/image-${index + 1}.jpg`
    }))

    // 延迟模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    uploadStatus.value = '图片上传完成，正在替换 URL...'

    // 替换 URL
    const srcMapping = new Map(uploadResults.map(r => [r.originalSrc, r.url]))
    editorRef.value.replaceMultipleImages(srcMapping)

    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取最终 HTML
    const finalHTML = editorRef.value.getHTML()

    // 统计替换情况
    const fakeUrlCount = (finalHTML.match(/fake-upload\.example\.com/g) || []).length

    uploadStatus.value = `✅ 完成！已替换 ${fakeUrlCount} 张图片为模拟 URL`

    // 更新 content 以便在 textarea 中查看
    content.value = finalHTML
  } catch (e) {
    console.error('上传失败:', e)
    uploadStatus.value = '上传失败: ' + (e as Error).message
  }
}

async function importFromJSON() {
  if (!editorRef.value) {
    importStatus.value = '编辑器未初始化'
    return
  }

  if (!jsonContent.value.trim()) {
    importStatus.value = '请输入JSON数据'
    return
  }

  importStatus.value = '正在解析JSON数据...'

  try {
    const json = JSON.parse(jsonContent.value)
    editorRef.value.setJSON(json)
    importStatus.value = '✅ 导入成功！'

    // 更新HTML输出
    const finalHTML = editorRef.value.getHTML()
    content.value = finalHTML
  } catch (e) {
    console.error('JSON解析失败:', e)
    importStatus.value = 'JSON解析失败: ' + (e as Error).message
  }
}
</script>

<style scoped>
.theme-btn {
  background: transparent;
  color: var(--editor-text-secondary, #6b7280);
  border: 1px solid var(--editor-border-color, #d1d5db);
}
.theme-btn.active {
  background-color: var(--editor-primary-color, #3b82f6);
  color: #ffffff;
  border-color: var(--editor-primary-color, #3b82f6);
}
.theme-btn:hover:not(.active) {
  background-color: var(--editor-toolbar-bg, #f3f4f6);
}
</style>
