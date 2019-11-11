import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import NotFound from '@/views/NotFound'
import forbidden from '@/views/forbidden'
import store from '@/store'

Vue.use(Router)

const coreRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
  },
  { path: '*', component: NotFound },
  { path: '/forbidden', component: forbidden }
]

const appRoutes = [
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "about" */ './components/app/menuTest.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/threejsTest',
    name: 'threejsTest',
    component: () => import(/* webpackChunkName: "about" */ './components/app/ThreeJsTest.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

let router = new Router({
  routes: coreRoutes.concat(appRoutes)
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/isLoggedIn']) {
      //  const menu = store.getters['menu/getMenu']
      // console.log('Router', menu)
      next()
      return
    }
    next('/forbidden')
  } else {
    next()
  }
})
export default router
