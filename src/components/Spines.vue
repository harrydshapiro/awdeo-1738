<template>
  <div
    class="spines"
    :class="{
      left: textBaseline === 'left' ,
      right: textBaseline === 'right'
    }"
  >
    <div
      v-for="(album, index) in albums"
      :key="index"
      class="spine"
    >
      <span>{{ album.name }}</span>
      <span>{{ album.artists[0].name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Spines extends Vue {
  @Prop({ required: true }) albums!: SpotifyApi.AlbumObjectFull[]
  @Prop({ required: true }) textBaseline!: 'left' | 'right'
}
</script>

<style lang="scss" scoped>
.spines {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.spine {
  writing-mode: vertical-lr;
  text-align: center;
  font-family: 'Neue Montreal', 'sans-serif';
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  border-left: 1px solid white;
  margin-left: 5px;

  &.left {
    transform: rotate(180deg);

    &:first-child {
      margin-left: auto;
    }
  }
}

.spines.left {
  justify-content: flex-end;

  .spine {
    transform: rotate(180deg);

    &:first-child {
      margin-left: auto;
    }
  }
}
</style>
