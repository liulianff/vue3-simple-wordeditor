import { ref, computed } from 'vue'
import { getLocaleMessages, registerLocale } from '../locales'
import type { LocaleMessages, Locale } from '../locales/types'

const currentLocale = ref<Locale>('zh-CN')
const currentMessages = ref<LocaleMessages>(getLocaleMessages('zh-CN'))

export function useI18n() {
  function setLocale(locale: Locale) {
    currentLocale.value = locale
    currentMessages.value = getLocaleMessages(locale)
  }

  function t(key: string): string {
    const keys = key.split('.')
    let result: any = currentMessages.value
    for (const k of keys) {
      if (result == null) return key
      result = result[k]
    }
    return result != null ? String(result) : key
  }

  const locale = computed(() => currentLocale.value)
  const messages = computed(() => currentMessages.value)

  return {
    locale,
    messages,
    setLocale,
    t,
    registerLocale,
  }
}

export type { Locale, LocaleMessages }
