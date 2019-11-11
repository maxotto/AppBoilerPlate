<template>
  <v-toolbar-items>
    <v-btn
      v-show="!logged && !loading"
      color="pink darken-2"
      dark
      @click="showDialog=true"
    >
      <v-icon>fa-sign-in-alt</v-icon>
      {{$t('login')}}
    </v-btn>
    <v-menu open-on-hover offset-y v-show="logged">
      <v-btn
        slot="activator"
        color="white"
        flat
      >
        <v-icon>fa-user</v-icon>
        {{username}}
      </v-btn>

      <v-list>
        <v-list-tile
          v-for="(item, index) in items"
          :key="index"
          @click="doAction(index)"
        >
          <v-list-tile-title>
            <v-icon>{{item.icon}}</v-icon>
            {{ item.title }}
          </v-list-tile-title>

        </v-list-tile>
      </v-list>
    </v-menu>
    <LoginDlg v-bind:dialog="showDialog" v-on:closeDlg="closeDlg"/>
  </v-toolbar-items>
</template>

<script>
  import LoginDlg from './LoginDlg'
  import { mapState } from 'vuex'
  export default {
    name: 'UserButton',
    components: { LoginDlg },
    data: function () {
      return {
        logged: false,
        loading: false,
        showDialog: false,
        username: 'Вася Пупкин',
        items: [
          { title: this.$t('settings'), icon: 'fa-tools', action: 'doSettings' },
          { title: this.$t('logout'), icon: 'fa-sign-out-alt', action: 'doLogout' }
        ]
      }
    },
    methods: {
      closeDlg: function () {
        // this.logged = true
        this.showDialog = false
      },
      doAction: function (index) {
        const fname = this.items[index]['action']
        this[fname]()
      },
      doLogout: function () {
        this.$store.dispatch('auth/logout', {
          username: this.user.username,
          vm: this
        })
        this.$router.push('/')
      }
    },
    watch: {
      status: function (val) {
        this.logged = (val === 'success')
        this.loading = (val === 'loading')
      },
      user: {
        handler: function (newVal, oldVal) {
          if (newVal && newVal.ldapInfo) {
            this.username = newVal.ldapInfo.fullName
          }
        },
        deep: true
      }
    },
    computed: {
      ...mapState('auth', ['token', 'user', 'status'])
    },
    created: function () {
      this.loading = (this.status === 'loading')
      const user = this.user
      if (user && user.ldapInfo && user.ldapInfo.fullName) {
        this.username = user.ldapInfo.fullName
      }
    }
  }
</script>

<style scoped>

</style>
