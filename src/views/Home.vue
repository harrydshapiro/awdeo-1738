<template>
  <div class="home">
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
import { Vue, Component } from 'vue-property-decorator'
import store from '@/store'
import Spines from '@/components/Spines.vue'
import RecordCover from '@/components/RecordCover.vue'
import hotkeys from 'hotkeys-js'

@Component({
  components: {
    Spines,
    RecordCover
  }
})
export default class Home extends Vue {
  currentSpineIndex = 0

  async mounted () {
    store.dispatch.getUserAlbums()
    this.initializeHotkeys()
  }

  get albums () {
    return store.getters.albums
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
  }
}
</script>

<style lang="scss">
.home {
  display: flex;
  width: 100vw;
}
</style>
