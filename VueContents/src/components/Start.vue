<template>
  <div v-on:click="startSlideShow" class="opening_content">
    <div v-if="!isStartCountdown">
      <div class="start_phrase">Let's share your smile!</div>
      <!-- <button class="startButton">スライドショーをはじめます！</button> -->
    </div>
    <div v-if="isStartCountdown">
      <div class="start_phrase">{{dispCount}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      counter: 5,
      dispCount: null,
      isStartCountdown: false
    }
  },
  mounted () {
    this.counter = 5
    this.isStartCountdown = false
    this.dispCount = this.counter
    console.log(this.$images_url)
  },
  methods: {
    startSlideShow () {
      this.isStartCountdown = true
      if (this.counter >= 2) {
        setTimeout(function () {
          this.counter = this.counter - 1
          this.dispCount = this.counter
          this.startSlideShow()
        }.bind(this), 1000)
      } else if (this.counter === 1) {
        setTimeout(function () {
          this.counter = this.counter - 1
          this.dispCount = 'Start!'
          this.startSlideShow()
        }.bind(this), 1000)
      } else if (this.counter === 0) {
        setTimeout(function () {
          this.counter = this.counter - 1
          this.startSlideShow()
        }.bind(this), 1000)
      } else {
        console.log('start!!')
        this.$router.push({path: '/slide_show'})
      }
    },
    countdown () {
      this.counter = this.counter - 1
      this.startSlideShow()
    }
  }

}
</script>

<style scoped>
/* @import "../assets/style/global.css"; */
body {
  background-color: black;
  background: linear-gradient(-135deg, #E4A972, #9941D8);
    background-size: cover;
    color: white;
    height: 100vh;
    width: 100%;
    font-family: 'MyFont';
}

.opening_content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.start_phrase {
    font-size: 70px;
}
</style>
