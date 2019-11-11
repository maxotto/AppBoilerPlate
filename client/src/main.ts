import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import i18n from '@/plugins/i18n'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Axios from 'axios'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

Vue.prototype.$http = Axios
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

new Vue({
  i18n,
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
