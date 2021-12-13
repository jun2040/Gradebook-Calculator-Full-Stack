import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/global.css'

import axios from 'axios'

// Axios setup
/*http://localhost:3000/api*/
axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 404) {
    router.push('/404')
  }

  if (error.response.status === 400) {
    router.push('/404')
  }
});

createApp(App).use(store).use(router).mount('#app')
