import Vue from 'vue'
import App from './App.vue'
import './main.scss'
import VueAxios from 'vue-axios'
import router from './router'
import { securedAxiosInstance, plainAxiosInstance } from './services/api.service'
import 'bootstrap'

Vue.config.productionTip = false

Vue.use(VueAxios, { secured: securedAxiosInstance, plain: plainAxiosInstance })

new Vue({
  el: '#app',
  router,
  securedAxiosInstance,
  plainAxiosInstance,
  render: h => h(App)
})
