export function downloadFile(content: Blob | string, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateFilename(ext: string): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '-')
  return `document-${date}-${time}.${ext}`
}

export interface CropData {
  x: number
  y: number
  width: number
  height: number
}

export async function cropImage(src: string, crop: CropData): Promise<string> {
  const img = new Image()
  const imgLoadPromise = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load image'))
  })
  img.src = src
  await imgLoadPromise

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return src
  }

  const naturalW = img.naturalWidth
  const naturalH = img.naturalHeight

  const cropX = (crop.x / 100) * naturalW
  const cropY = (crop.y / 100) * naturalH
  const cropW = (crop.width / 100) * naturalW
  const cropH = (crop.height / 100) * naturalH

  canvas.width = cropW
  canvas.height = cropH

  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)

  const isJpeg = /^data:image\/jpe?g/i.test(src) || /\.jpe?g(\?|$)/i.test(src) || src.startsWith('blob:')
  const mimeType = isJpeg ? 'image/jpeg' : 'image/png'
  const quality = isJpeg ? 0.92 : undefined
  return canvas.toDataURL(mimeType, quality)
}

export interface ImageUploadItem {
  originalSrc: string
  base64Data: string
  //crop?: CropData | null //上传服务器不需要该数据
}

export async function extractImagesForUpload(html: string): Promise<ImageUploadItem[]> {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  const imgElements = Array.from(tempDiv.querySelectorAll('img'))
  const images: ImageUploadItem[] = []

  for (const imgEl of imgElements) {
    const src = imgEl.getAttribute('src')
    const cropAttr = imgEl.getAttribute('data-crop')

    if (!src) continue

    let base64Data = src

    if (src.startsWith('data:') || src.startsWith('blob:')) {
      if (cropAttr) {
        try {
          const crop = JSON.parse(cropAttr) as CropData
          base64Data = await cropImage(src, crop)
        } catch (e) {
          console.warn('Failed to crop image for upload:', e)
        }
      }

      images.push({
        originalSrc: cropAttr ? `${src}?cropped=${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : src,
        base64Data,
      })
    }
  }

  return images
}

export function replaceImagesInHTML(html: string, srcMapping: Map<string, string>): string {
  if (srcMapping.size === 0) return html

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  const imgElements = Array.from(tempDiv.querySelectorAll('img'))

  for (const imgEl of imgElements) {
    const currentSrc = imgEl.getAttribute('src')
    if (currentSrc && srcMapping.has(currentSrc)) {
      imgEl.setAttribute('src', srcMapping.get(currentSrc)!)
      imgEl.removeAttribute('data-crop') //因为上传服务器不需要该数据,替换url时,删除data-crop数据
    }
  }

  return tempDiv.innerHTML
}

export async function processImagesWithCrop(html: string): Promise<{ html: string; imgSizes: Map<string, { width: number; height: number }> }> {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  const imgElements = Array.from(tempDiv.querySelectorAll('img'))
  const imgSizes = new Map<string, { width: number; height: number }>()
  
  // 记录原始图片顺序的映射表
  const srcMapping = new Map<string, string>()
  // 记录用户设置的图片宽度
  const widthMapping = new Map<string, number>()

  // 先处理所有图片，记录src映射和宽度
  for (const imgEl of imgElements) {
    const src = imgEl.getAttribute('src')
    const widthAttr = imgEl.getAttribute('width')
    const cropAttr = imgEl.getAttribute('data-crop')
    
    if (src) {
      // 记录用户设置的宽度
      if (widthAttr) {
        const width = parseInt(widthAttr)
        if (!isNaN(width)) {
          widthMapping.set(src, width)
        }
      }
      
      if (cropAttr) {
        try {
          const crop = JSON.parse(cropAttr) as CropData
          const croppedSrc = await cropImage(src, crop)
          srcMapping.set(src, croppedSrc)
          
          // 使用用户设置的宽度或默认大小
          const userWidth = widthMapping.get(src)
          if (userWidth) {
            const size = await loadImageSize(croppedSrc, userWidth)
            imgSizes.set(croppedSrc, size)
          } else {
            const size = await loadImageSize(croppedSrc)
            imgSizes.set(croppedSrc, size)
          }
        } catch (e) {
          console.warn('Failed to crop image:', e)
          if (src) {
            const userWidth = widthMapping.get(src)
            if (userWidth) {
              const size = await loadImageSize(src, userWidth)
              imgSizes.set(src, size)
            } else {
              const size = await loadImageSize(src)
              imgSizes.set(src, size)
            }
          }
        }
      } else {
        const userWidth = widthMapping.get(src)
        if (userWidth) {
          const size = await loadImageSize(src, userWidth)
          imgSizes.set(src, size)
        } else {
          const size = await loadImageSize(src)
          imgSizes.set(src, size)
        }
      }
    }
  }
  
  // 直接替换原始HTML中的src，保持原始顺序
  let processedHtml = html
  for (const [oldSrc, newSrc] of srcMapping.entries()) {
    processedHtml = processedHtml.replace(new RegExp(oldSrc.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&'), 'g'), newSrc)
    processedHtml = processedHtml.replace(/data-crop="[^"]*"/g, '')
  }

  // 确保保留宽度属性
  const tempDiv2 = document.createElement('div')
  tempDiv2.innerHTML = processedHtml
  const imgElements2 = Array.from(tempDiv2.querySelectorAll('img'))
  imgElements2.forEach(imgEl => {
    const src = imgEl.getAttribute('src')
    if (src) {
      const userWidth = widthMapping.get(src)
      if (userWidth) {
        imgEl.setAttribute('width', userWidth.toString())
      }
    }
  })
  processedHtml = tempDiv2.innerHTML

  return { html: processedHtml, imgSizes }
}

function loadImageSize(src: string, targetWidth?: number): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let width = img.naturalWidth
      let height = img.naturalHeight
      
      // 使用用户设置的宽度或默认最大宽度
      const maxWidth = targetWidth || 500
      if (width > maxWidth) {
        const ratio = maxWidth / width
        width = maxWidth
        height = height * ratio
      } else if (targetWidth && targetWidth < width) {
        // 如果用户设置的宽度小于原始宽度，按比例缩小
        const ratio = targetWidth / width
        width = targetWidth
        height = height * ratio
      }
      
      resolve({ width: Math.round(width), height: Math.round(height) })
    }
    img.onerror = () => {
      resolve({ width: targetWidth || 500, height: targetWidth ? Math.round(targetWidth * 0.75) : 375 })
    }
    img.src = src
  })
}
