import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

const fallbackLng = ['en']
const availableLanguages = ['en', 'sv']

i18n
  .use(Backend) 

  .use(initReactI18next) 

  .init({
    fallbackLng,
    lng: 'sv', 
    debug: true,
    whitelist: availableLanguages,
    order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],

    interpolation: {
      escapeValue: false
    }
  })

export default i18n