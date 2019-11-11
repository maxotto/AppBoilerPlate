import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify, {
  iconfont: 'fa',
  lang: {
    locales: { ru },
    current: 'ru'
  }
})
