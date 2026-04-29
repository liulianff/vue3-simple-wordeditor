export interface LocaleMessages {
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
      none: string
      sansSerif: string
      serif: string
      monospace: string
      microsoftYaHei: string
      simSun: string
      simHei: string
      kaiTi: string
    }
    fontSize: string
    fontSizeNone: string
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
    insertTable: string
    export: string
    preview: string
    linkDialog: {
      placeholder: string
      confirm: string
      cancel: string
    }
    table: {
      insertTable: string
      addColumnBefore: string
      addColumnAfter: string
      deleteColumn: string
      addRowBefore: string
      addRowAfter: string
      deleteRow: string
      deleteTable: string
      mergeCells: string
      splitCell: string
      toggleHeaderColumn: string
      toggleHeaderRow: string
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

export type Locale = 'zh-CN' | 'en-US' | (string & {})

export interface LocaleOption {
  label: string
  value: Locale
}
