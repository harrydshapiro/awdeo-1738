import Vue from 'vue'
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router'
import Music from '@/views/Music.vue'
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
    name: 'Music',
    component: Music,
    beforeEnter: redirectToLogin
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/code-redirect',
    name: 'codeRedirect',
    async beforeEnter (to, from, next) {
      const { code } = parseQS()
      await SpotifyRequester.fetchTokens(code)
      webPlayerSetup(SpotifyRequester.accessToken!, store.dispatch.addPlayer)
      next({
        name: 'Music',
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
