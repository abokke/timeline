import { createApp } from 'vue'
import '@/assets/styles/main.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

createApp(App)
    .use(router)
    .use(i18n)
    .mount('#app')
