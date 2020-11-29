<template>
  <div class="record-cover">
    <h1 class="album-name">
      {{ album.name }}
    </h1>
    <img
      :src="recordCoverImgSrc"
      @click="togglePlayback"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import store from '@/store'

@Component({})
export default class Spines extends Vue {
  @Prop({ required: true }) album!: SpotifyApi.AlbumObjectFull

  get recordCoverImgSrc () {
    return this.album.images[0].url
  }

  togglePlayback () {
    store.dispatch.togglePlayState(this.album.uri)
  }
}
</script>

<style lang="scss" scoped>
.record-cover {
  position: relative;

  .album-name {
    text-align: center;
    text-transform: uppercase;
    font-family: 'Microgramma', 'sans-serif';
    position: absolute;
    bottom: calc(100% + 20px);
    width: 100%;
  }

  img {
    width: 70vh;
    cursor: pointer;
  }
}
</style>
