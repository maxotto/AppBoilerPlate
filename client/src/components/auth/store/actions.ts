import Vue from 'vue'
import { AUTH_SUCCESS, LOGOUT, AUTH_REQUEST, AUTH_ERROR } from './types'
import gql from 'graphql-tag'

export const login = ({ commit, dispatch }, data) => {
  return new Promise((resolve, reject) => {
    commit(AUTH_REQUEST)
    data.vm.$apollo.mutate(
      {
        mutation: gql`mutation signIn($email: String!, $password:String!, $ldapInfo: LdapInfo!) {
          signIn(login: $email, password: $password, ldapInfo: $ldapInfo){
            token
            user{
              id
              username
              ldapInfo{
                fullName
                title
                phone
                lastName
                email
              }
              role
            }
          }
        }`,
        // Parameters
        // todo сделать ldapInfo необязательным и исключить отсюда
        variables: {
          email: data.email,
          password: data.password,
          ldapInfo: {
            fullName: '',
            title: '',
            phone: '',
            lastName: '',
            email: ''
          }
        }
      }
    )
      .then(resp => {
        const token = resp.data.signIn.token
        const user = resp.data.signIn.user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        // axios.defaults.headers.common['Authorization'] = token
        commit(AUTH_SUCCESS, { token: token, user: user })
        dispatch('menu/getMenu', { username: user.username, vm: data.vm }, { root: true })
        resolve(resp)
      })
      .catch(err => {
        commit(AUTH_ERROR)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        reject(err)
      })
  })
}

export const logout = ({ commit, dispatch }, data) => {
  console.log('Logout')
  return new Promise((resolve, reject) => {
    data.vm.$apollo.mutate({
      mutation: gql`mutation logout($username: String!) {
          logout(username: $username)
        }`,
      // Parameters
      variables: {
        username: data.username
      }
    })
      .then(resp => {
        commit(LOGOUT)
        dispatch('menu/getMenu', { username: 'guest', vm: data.vm }, { root: true })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // delete axios.defaults.headers.common['Authorization']
        resolve(true)
      })
      .catch(err => {
        if (err) {
          console.log('Do logout')
        }
        commit(LOGOUT)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // delete axios.defaults.headers.common['Authorization']
        resolve(true)
      })
  })
}

export const checkAuthState = ({ commit, dispatch }, data) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  if (token) {
    commit(AUTH_REQUEST)
    data.vm.$apollo.query({
      query: gql`{
          me{
            id
          }
      }`
    }).then(res => {
      if (res.data.me.id) {
        commit(AUTH_SUCCESS, { token: token, user: user })
        // todo здесь брать меню пользователя
        dispatch('menu/getMenu', { username: user.username, vm: data.vm }, { root: true })
      }
    }).catch(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      commit(LOGOUT)
      dispatch('menu/getMenu', { username: 'guest', vm: data.vm }, { root: true })
    })
  } else {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit(LOGOUT)
    dispatch('menu/getMenu', { username: 'guest', vm: data.vm }, { root: true })
  }
}
