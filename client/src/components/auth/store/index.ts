import { AUTH_ERROR, AUTH_REQUEST, AUTH_SUCCESS, LOGOUT } from './types'
import * as getters from './getters'
import * as actions from './actions'

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: ''
}

const mutations = {
  [AUTH_SUCCESS] (state, data) {
    state.status = 'success'
    state.token = data.token
    state.user = data.user
  },
  [LOGOUT] (state) {
    state.user = null
    state.status = ''
    state.token = ''
  },
  [AUTH_ERROR] (state) {
    state.status = 'error'
  },
  [AUTH_REQUEST] (state) {
    state.status = 'loading'
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
