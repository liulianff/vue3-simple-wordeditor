<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Vue Word Editor</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <VueWordEditor
          v-model="content"
          placeholder="开始编辑您的文档..."
          class="h-[500px]"
        />
      </div>

      <div class="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">HTML 输出</h2>
        <textarea
          v-model="content"
          class="w-full h-40 p-3 border border-gray-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="HTML content..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueWordEditor from './components/VueWordEditor.vue'

const content = ref(`<h1>欢迎使用 Vue Word Editor</h1>
<p>这是一个基于 Vue3 + TipTap3 构建的富文本编辑器。</p>
<h2>功能特点</h2>
<ul>
<li><strong>字体设置</strong> - 支持粗细、大小、颜色、背景色</li>
<li><strong>标题</strong> - 支持 H1-H6 多级标题</li>
<li><strong>对齐</strong> - 支持左对齐、居中、右对齐、两端对齐</li>
<li><strong>图片编辑</strong> - 支持插入和编辑图片</li>
<li><strong>引用</strong> - 支持引用块</li>
<li><strong>列表</strong> - 支持有序和无序列表</li>
<li><strong>链接</strong> - 支持插入文本链接</li>
</ul>
<blockquote>这是一段引用文本，用于引用他人的话语或重要信息。</blockquote>
<p><em>支持斜体</em>、<u>下划线</u>、<s>删除线</s>等文本格式。</p>
<p>支持 <span style="color: #3b82f6;">自定义颜色</span> 和 <mark style="background-color: #ffff00;">高亮标记</mark>。</p>`)
</script>
