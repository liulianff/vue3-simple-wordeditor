import zhCN from './zhCN'
import enUS from './enUS'
import type { LocaleMessages, Locale } from './types'

const locales: Record<string, LocaleMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export function registerLocale(locale: Locale, messages: LocaleMessages) {
  locales[locale] = messages
}

export function getLocaleMessages(locale: Locale): LocaleMessages {
  return locales[locale] || locales['zh-CN']
}

export { zhCN, enUS }
export type { LocaleMessages, Locale } from './types'
