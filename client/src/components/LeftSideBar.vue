<template>
  <v-navigation-drawer
    v-model="innerDrawer"
    fixed
    clipped
    app
  >
    <v-list subheader dense class="mt-3 grey--text text--darken-1">
      <v-list-tile to="/">
        <v-list-tile-action>
          <v-icon>fa-home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ $t('home') }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader dense v-for="(menuItem) in innerMenu" :key="menuItem.title" class="mt-3 grey--text text--darken-1">
      <v-subheader class="mt-3 grey--text text--darken-1">{{menuItem.title}}</v-subheader>
      <v-list-tile v-for="(item) in menuItem.items" :key="item.text" :to="item.route">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.text }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>
      <v-list subheader dense class="mt-3 grey--text text--darken-1">
          <v-list-tile to="/about">
              <v-list-tile-action>
                  <v-icon>fa-info</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                  <v-list-tile-title>
                      {{ $t('about') }}
                  </v-list-tile-title>
              </v-list-tile-content>
          </v-list-tile>
      </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { mapState } from 'vuex'
  // import MENU from './menu/graphql/Menu.gql'
  export default {
    name: 'LeftSideBar',
    props: ['drawer'],
    data: () => ({
      innerDrawer: true,
      innerMenu: []
    }),
    methods: {
      alert (text) {
        alert(text)
      },
      menuAction (menuIndex, index) {
        const methodName = this.menu[menuIndex]['items'][index]['action']
        if (typeof (this[methodName]) === 'function') {
          this[methodName]()
        } else {
          // alert('There is no method ' + methodName)
        }
      },
      action1 () {
        alert(1)
      },
      action2 () {
        alert(2)
      },
      action3 () {
        alert(3)
      },
      action4 () {
        alert(4)
      }
    },
    watch: {
      drawer: function (val) {
        this.innerDrawer = val
      },
      innerDrawer: function (val) {
        this.$emit('side-bar-state', val)
      },
      menu: {
        handler: function (val, oldVal) {
          // console.log(val)
          const myObj = val.filter((value, index, array) => {
            return (value.place && value.place === 'leftSideBar')
          })
          this.innerMenu = myObj[0].items
        },
        deep: true
      }
    },
    mounted () {
      if (this.user) this.currentUser = this.user.username
    },
    computed: {
      ...mapState('auth', ['token', 'user', 'status']),
      ...mapState('menu', ['menu'])
    }
  }
</script>

<style scoped>

</style>
