import Vue from 'vue'
import App from './App.vue'
import './main.css'
import VueAxios from 'vue-axios'
import router from './router'
import { securedAxiosInstance, plainAxiosInstance } from './services/api.service'

Vue.config.productionTip = false

Vue.use(VueAxios, { secured: securedAxiosInstance, plain: plainAxiosInstance })

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  el: '#app',
  router,
  securedAxiosInstance,
  plainAxiosInstance,
  components: { App },
  template: '<App/>'
})
