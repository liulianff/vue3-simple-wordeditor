import { ref } from 'vue'

export interface UploadConfig {
  url: string
  fieldName?: string
  headers?: Record<string, string>
}

export interface UploadResult {
  url: string
  [key: string]: unknown
}

export function useImageUpload(config?: UploadConfig) {
  const isUploading = ref(false)
  const error = ref<string | null>(null)

  async function uploadImage(
    file: File,
    customConfig?: Partial<UploadConfig>
  ): Promise<UploadResult | null> {
    const finalConfig = { ...config, ...customConfig }
    if (!finalConfig.url) {
      throw new Error('上传URL未配置')
    }

    isUploading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append(finalConfig.fieldName || 'file', file)

      const response = await fetch(finalConfig.url, {
        method: 'POST',
        headers: finalConfig.headers || {},
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status}`)
      }

      const result: UploadResult = await response.json()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  return {
    isUploading,
    error,
    uploadImage,
  }
}

export default useImageUpload
