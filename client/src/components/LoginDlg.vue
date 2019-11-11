<template>
  <v-dialog
    v-model="dialog"
    max-width="350"
    persistent
  >
    <v-card>
      <v-card-title class="headline">{{$t('loginPlease')}}</v-card-title>

      <v-card-text>
        {{$t('UseYourRTRSUserNameAndPassword')}}
      </v-card-text>
      <v-form v-model="valid">
        <v-card-actions>
          <v-text-field
            v-model="username"
            :rules="nameRules"
            :label="userNameLabel"
            outline
            required
          ></v-text-field>
        </v-card-actions>
        <v-card-actions>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :label="userPassLabel"
            type="password"
            required
            outline
          ></v-text-field>
        </v-card-actions>
      </v-form>
      <v-alert
              :value=loginError
              type="error"
      >
        {{loginErrorMessage}}
      </v-alert>
      <v-card-actions>
        <v-progress-circular
                v-if = "loading"
                indeterminate
                color="primary"
        ></v-progress-circular>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          :disabled="!valid || loading"
          @click="login"
        >
          {{$t('login')}}
        </v-btn>

        <v-btn
          color="red darken-1"
          @click="cancel"
        >
          {{$t('cancel')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // import gql from 'graphql-tag'
  export default {
    name: 'LoginDlg',
    props: [ 'dialog' ],
    data: function () {
      return {
        valid: false,
        loading: false,
        username: 'fcpdtvtestuser01',
        userNameLabel: this.$t('userNameLabel'),
        userPassLabel: this.$t('userPassLabel'),
        nameRules: [
          v => !!v || this.$t('userNameReq')
        ],
        password: '083tb9u9',
        passwordRules: [
          v => !!v || 'Password is required'
        ],
        loginError: false,
        loginErrorMessage: ''
      }
    },
    methods: {
      login: function () {
        this.loading = true
        this.$store.dispatch('auth/login', {
          email: this.username,
          password: this.password,
          vm: this
        }).then(() => {
          this.loginError = false
          this.loginErrorMessage = ''
          this.loading = false
          this.$emit('closeDlg')
        }).catch((err) => {
          this.loading = false
          this.loginError = true
          this.loginErrorMessage = this.$t(this.translateErrorMsg(err.message))
        })
      },
      translateErrorMsg: function (errMsg) {
        if (errMsg === 'GraphQL error: Invalid username/password') return 'invalidLogin'
        if (errMsg === 'GraphQL error: An error while usin LDAP') return 'LDAPServerError'
        if (errMsg === 'Network error: NetworkError when attempting to fetch resource.') return 'NetworkError'
        return errMsg
      },
      cancel: function () {
        this.loginError = false
        this.loginErrorMessage = ''
        this.$emit('closeDlg')
      }
    }
  }
</script>

<style scoped>

</style>
