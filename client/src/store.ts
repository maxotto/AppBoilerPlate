import Vue from 'vue'
import Vuex from 'vuex'

import auth from './components/auth/store'
import menu from './components/menu/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    menu
  }
})
