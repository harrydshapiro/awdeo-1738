import Vue from 'vue'
import Vuex from 'vuex'
import { createDirectStore } from 'direct-vuex'
import { merge } from 'lodash-es'
import api from '@/api'

export interface RootState {
  albums: Record<SpotifyApi.AlbumObjectFull['id'], SpotifyApi.AlbumObjectFull>,
  player: Spotify.SpotifyPlayer | null,
  playerDeviceId: string | null,
  playerPaused: boolean,
  currentPlayerURI: string | null
}

Vue.use(Vuex)

const state: RootState = {
  albums: {},
  player: null,
  playerDeviceId: null,
  playerPaused: true,
  currentPlayerURI: null
} as RootState // You have to cast it here else it complains about not having a user property initialization... however vuex composes the submodules itself so you can't actually provide a def

const {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext
} = createDirectStore({
  state,
  modules: {
  },
  mutations: {
    addAlbums (state, albums: SpotifyApi.AlbumObjectFull[]) {
      const newAlbumsObj = albums.reduce<Record<SpotifyApi.AlbumObjectFull['id'], SpotifyApi.AlbumObjectFull>>((acc, curr) => {
        acc[curr.id] = curr
        return acc
      }, {})
      state.albums = merge({}, state.albums, newAlbumsObj)
    },
    setPlayer (state, player: Spotify.SpotifyPlayer) {
      state.player = player
    },
    setPlayerDeviceId (state, playerDeviceId: string) {
      state.playerDeviceId = playerDeviceId
    },
    setPlayerPaused (state, pausedState: boolean) {
      state.playerPaused = pausedState
    },
    setCurrentPlayerURI (state, uri: string | null) {
      state.currentPlayerURI = uri
    }
  },
  actions: {
    async getUserAlbums (context) {
      const { commit } = rootActionContext(context)
      const albums = await api.getAllUserAlbums()
      commit.addAlbums(albums)
    },

    async addPlayer (context, player: Spotify.SpotifyPlayer) {
      const { commit, dispatch } = rootActionContext(context)

      commit.setPlayer(player)

      player.addListener('initialization_error', ({ message }: any) => {
        console.error(message)
      })
      player.addListener('authentication_error', ({ message }: any) => {
        console.error(message)
      })
      player.addListener('account_error', ({ message }: any) => {
        console.error(message)
      })
      player.addListener('playback_error', ({ message }: any) => {
        console.error('PLAYBACK ERROR OY VEY!', message)
      })

      player.addListener('ready', ({ device_id }: any) => {
        console.log('Ready with Device ID', device_id)
      })
      player.addListener('player_state_changed', (message) => {
        console.log('Player state changed:', message)

        commit.setPlayerPaused(message.paused)
        commit.setCurrentPlayerURI(message.context.uri)
      })

      player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id)
      })

      player.addListener('ready', ({ device_id }) => {
        dispatch.transferPlaybackToWebPlayer(device_id)
      })

      await player.connect()
    },

    async transferPlaybackToWebPlayer (context, deviceId: string) {
      const { commit } = rootActionContext(context)
      commit.setPlayerDeviceId(deviceId)
      await api.transferPlayback(deviceId)
    },

    async togglePlayState (context, uri: string) {
      const { playerDeviceId, currentPlayerURI } = store.state
      if (!playerDeviceId) return

      if (store.state.playerPaused) {
        await api.playPlayback(playerDeviceId, uri)
      } else if (currentPlayerURI !== uri) {
        await api.playPlayback(playerDeviceId)
      } else {
        await api.pausePlayback(playerDeviceId)
      }
    }
  },
  getters: {
    albums (state): SpotifyApi.AlbumObjectFull[] {
      return Object.values(state.albums)
    }
  }
})

// Export the direct-store instead of the classic Vuex store.
export default store

// The following exports will be used to enable types in the
// implementation of actions.
export { rootActionContext, moduleActionContext, rootGetterContext, moduleGetterContext }

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store
declare module 'vuex' {
  interface Store<S> {
    direct: AppStore
  }
}
