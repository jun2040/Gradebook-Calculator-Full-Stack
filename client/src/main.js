import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/global.css'

import axios from 'axios'

// Axios setup
axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

createApp(App).use(store).use(router).mount('#app')
