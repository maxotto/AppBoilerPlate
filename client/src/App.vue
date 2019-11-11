<template>
  <v-app id="rtrs-boilerplate-app">
    <left-side-bar v-bind:drawer="drawer" v-on:side-bar-state="sideBarStateChanged"/>
    <tool-bar v-bind:drawer="drawer" v-on:toggle-sidebar="toggleSidebar"/>
    <v-content>
      <v-container>
        <v-fade-transition mode="out-in">
          <router-view/>
        </v-fade-transition>
        <Footer/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import i18n from '@/plugins/i18n'
  import Footer from './components/Footer'
  import ToolBar from './components/ToolBar'
  import LeftSideBar from './components/LeftSideBar'
  // import ApolloExample from './components/ApolloExample'

  export default {
    components: { Footer, ToolBar, LeftSideBar },
    data: function () {
      return {
        drawer: true
      }
    },
    methods: {
      toggleSidebar: function () {
        this.drawer = !this.drawer
      },
      sideBarStateChanged: function (state) {
        this.drawer = state
      }
    },
    created: function () {
      // todo надо прогнать пробный запрос информации о себе, чтобы, при необходимости, разлогинить юзера
      this.$store.dispatch('auth/checkAuthState', { vm: this })
    }
  }
</script>

<style lang='scss'>
  @import './styles/index.scss';

  /* Remove in 1.2 */
  .v-datatable thead th.column.sortable i {
    vertical-align: unset;
  }
</style>
