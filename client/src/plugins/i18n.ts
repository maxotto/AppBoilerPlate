import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const messages = {
  'en': {
    welcomeMsg: 'Welcome to Your Vue.js App',
    login: 'Login',
    cancel: 'Cancel',
    logout: 'Logout',
    settings: 'Settings',
    home: 'Home',
    about: 'About',
    userNameReq: 'User name is required',
    loginPlease: 'Login, please',
    UseYourRTRSUserNameAndPassword: 'Use your RTRS username and password',
    userNameLabel: 'User name',
    userPassLabel: 'Password',
    invalidLogin: 'Invalid username or password',
    LDAPServerError: 'LDAP Server Error',
    NetworkError: 'API server not reachable'
  },
  'ru': {
    welcomeMsg: 'Добро пожаловать',
    login: 'Войти',
    cancel: 'Отмена',
    logout: 'Выйти',
    settings: 'Настройки',
    home: 'Главная',
    about: 'О программе',
    userNameReq: 'Введите имя пользователя',
    loginPlease: 'Войдите в систему',
    UseYourRTRSUserNameAndPassword: 'Для вхола используйте корпоративное имя пользователя и пароль',
    userNameLabel: 'Имя пользователя',
    userPassLabel: 'Пароль',
    invalidLogin: 'Неверное имя пользователя или пароль',
    LDAPServerError: 'Сервер LDAP недоступен',
    NetworkError: 'Сервер API недоступен'
  }
}

const i18n = new VueI18n({
  locale: 'ru', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages // set locale messages
})

export default i18n
