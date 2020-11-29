<template>
  <div class="home">
    <template v-if="showAbout">
      <About />
    </template>
    <template v-else>
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
      <div class="about-toggle" @click="showAboutScreen">
        ?
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import store from '@/store'
import Spines from '@/components/Spines.vue'
import RecordCover from '@/components/RecordCover.vue'
import About from '@/components/About.vue'
import hotkeys from 'hotkeys-js'

@Component({
  components: {
    Spines,
    RecordCover,
    About
  }
})
export default class Home extends Vue {
  currentSpineIndex = 0
  showAbout = false

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

  showAboutScreen () {
    this.showAbout = true
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

.about-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: white;
}
</style>
