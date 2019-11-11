// import { GET_MENU } from './types'
import * as getters from './getters'
import * as actions from './actions'

const state = {
  menu: {}
}

const mutations = {
  setMenu (state, data) {
    // console.log({data})
    state.menu = data.menu
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
