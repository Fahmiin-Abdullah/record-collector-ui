import Vue from 'vue'
import App from './App.vue'
import './man.css'
import VueAxios from 'vue-axios'
import { securedAxiosInstance, plainAxiosInstance } from './services/api.service'

Vue.config.productionTip = false

Vue.use(VueAxios, { secured: securedAxiosInstance, plain: plainAxiosInstance })

new Vue({
  render: h => h(App),
}).$mount('#app')
