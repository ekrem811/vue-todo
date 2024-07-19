import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import router from './Router'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light'
    },
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    }
})

createApp(App).use(router).use(vuetify).mount('#app')
