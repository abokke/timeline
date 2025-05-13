import { createI18n } from 'vue-i18n'
import ja from '@/locales/ja.json'
import en from '@/locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  fallbackLocale: 'en',
  messages: {
    ja,
    en
  }
})

export default i18n