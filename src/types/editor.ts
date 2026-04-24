export interface EditorConfig {
  placeholder?: string
  content?: string
  editable?: boolean
}

export type ImageLayoutType = 'inline' | 'block' | 'wrap-left' | 'wrap-right' | 'break'

export interface CropData {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageAttributes {
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
  layout?: ImageLayoutType
  crop?: CropData | null
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export interface LinkData {
  href: string
  target?: string
}

export interface FontStyle {
  family?: string
  size?: string
  weight?: string
  color?: string
  backgroundColor?: string
}
