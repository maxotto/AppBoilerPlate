import MENU from '../graphql/Menu.gql'

export const getMenu = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    data.vm.$apollo.query({
      query: MENU,
      variables: {
        user: data.username
      },
      fetchPolicy: 'no-cache'
    })
      .then(resp => {
        console.log(resp.data.menu)
        commit('menu/setMenu', { menu: resp.data.menu }, { root: true })
      })
      .catch(err => {
        console.log({ err })
      })
  })
}
