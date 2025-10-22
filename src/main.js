import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.scss'

import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'
import {createPinia} from "pinia";

if (Capacitor.isNativePlatform()) {
    StatusBar.setStyle({ style: Style.Dark })
    StatusBar.setBackgroundColor({ color: '#fe7971' })

    Keyboard.setAccessoryBarVisible({ isVisible: false })
}

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
