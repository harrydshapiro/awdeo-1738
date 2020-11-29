import Vue from 'vue'
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router'
import Home from '@/views/Home.vue'
import SpotifyRequester from '@/api/spotifyRequester'
import { parseQS } from '@/helpers'
import webPlayerSetup from '@/helpers/webPlayerSetup'
import store from '@/store'

Vue.use(VueRouter)

const redirectToLogin = (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  if (!SpotifyRequester.accessToken || !SpotifyRequester.refreshToken) {
    if (from.name !== 'codeRedirect') {
      SpotifyRequester.redirectToLogin()
    } else {
      // TODO: show a 404 page to prevent infinite loop
    }
  }
  next()
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: redirectToLogin
  },
  {
    path: '/code-redirect',
    name: 'codeRedirect',
    async beforeEnter (to, from, next) {
      const { code } = parseQS()
      await SpotifyRequester.fetchTokens(code)
      webPlayerSetup(SpotifyRequester.accessToken!, store.dispatch.addPlayer)
      next({
        name: 'Home',
        replace: true
      })
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
