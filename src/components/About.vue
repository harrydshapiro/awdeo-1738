<template>
  <div class="about">
    <div class="description">
      <p>
        AWDEO 1738 is designed for people who can't afford to listen as much vinyl as they would like.
      </p>
      <br>
      <p>
        We love flipping through our record collection. We love listening to great records cover-to-cover. We just can't afford to buy a turntable, preamp, stereo, speakers, and 5 records a day.
      </p>
      <br>
      <p>
        AWDEO 1738 simulates the vinyl experience on your computer. You can flip through your records. You can play your records in full. That's it.
      </p>
      <br>
      <p>
        It is intentionally inconvenient in all the best ways. And it doesn't cost any more than your Spotify subscription.
      </p>
    </div>
    <div class="contact">
      <p class="email">
        To send your love, a bug report, or anything in between, contact us at:
        <br>
        team@awdeo1738.com
      </p>
      <br>
      <div class="github">
        <a href="https://github.com/harrydshapiro/record-collection" target="_blank">github repo</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class About extends Vue {

}
</script>

<style lang="scss" scoped>
.about {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  text-align: left;
  margin: auto;

  h1 {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }

  .description {
    margin: 150px 0;
  }

  .contact {
    width: 100%;
  }
}
</style>
