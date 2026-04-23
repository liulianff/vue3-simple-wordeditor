export interface EditorConfig {
  placeholder?: string
  content?: string
  editable?: boolean
}

export interface ImageLayout {
  type: 'inline' | 'block' | 'wrap-left' | 'wrap-right' | 'break'
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
