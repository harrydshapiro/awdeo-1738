<template>
  <div class="music">
    <Spines
      :albums="leftAlbums"
      :text-baseline="'left'"
    />
    <RecordCover
      :album="currentAlbum"
    />
    <Spines
      :albums="rightAlbums"
      :text-baseline="'right'"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import store, { AlbumSortMethod } from '@/store'
import Spines from '@/components/Spines.vue'
import RecordCover from '@/components/RecordCover.vue'
import hotkeys from 'hotkeys-js'

@Component({
  components: {
    Spines,
    RecordCover
  }
})
export default class Music extends Vue {
  currentSpineIndex = 0

  async mounted () {
    store.dispatch.getUserAlbums()
    this.initializeHotkeys()

    const currentURI = store.state.currentPlayerURI
    if (currentURI) {
      const uriToJumpTo = this.albums.findIndex(album => album.uri === currentURI)
      if (uriToJumpTo !== -1) this.currentSpineIndex = uriToJumpTo
    }
  }

  get albums () {
    return store.getters.sortedAlbums
  }

  get leftAlbums () {
    return this.albums.slice(0, this.currentSpineIndex)
  }

  get rightAlbums () {
    return this.albums.slice(this.currentSpineIndex + 1)
  }

  get currentAlbum () {
    return this.albums[this.currentSpineIndex]
  }

  initializeHotkeys () {
    hotkeys('left', (event, handler) => {
      event.preventDefault()
      this.currentSpineIndex = Math.max(0, this.currentSpineIndex - 1)
    })

    hotkeys('right', (event, handler) => {
      event.preventDefault()
      this.currentSpineIndex = Math.min(this.albums.length - 1, this.currentSpineIndex + 1)
    })

    hotkeys('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z', (event, handler) => {
      const { key } = handler
      if (store.state.albumSortMethod === AlbumSortMethod.ArtistName) {
        const firstMatchingAlbumIndex = this.albums.findIndex(album => {
          const artistFirstLetter = album.artists[0].name[0].toLowerCase()
          return artistFirstLetter >= key
        })
        const indexToJumpTo = firstMatchingAlbumIndex === -1 ? this.albums.length - 1 : firstMatchingAlbumIndex
        this.currentSpineIndex = indexToJumpTo
      }
    })

    hotkeys('shift+s', (event, handler) => {
      if (store.state.albumSortMethod !== AlbumSortMethod.Random) {
        store.dispatch.changeAlbumSorting(AlbumSortMethod.Random)
      } else {
        store.dispatch.changeAlbumSorting(AlbumSortMethod.ArtistName)
      }
    })
  }
}
</script>

<style lang="scss">
.music {
  display: flex;
  width: 100vw;
}
</style>
