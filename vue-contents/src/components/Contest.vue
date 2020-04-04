<template>
  <div style="width:100%;height:100%;position:relative;">
    <!-- <div class="tame" :class="{tame_start: prologue.isStart}" v-html="prologue.disp"></div> -->
    <!-- typing -->
    <div v-if="isType" class="typing">
      <span class="prologue-title" v-for="(sentence, index) in typing" :key="`${index}`"
            v-html="sentence.chara" :style="{'animation-delay': sentence.delay}">
      </span>
    </div>

    <!-- slide -->
    <div v-show="!isType" class="tame">
      <transition name="tame-slider" v-on:enter="enterSlider">
        <div v-if="!isType" class="tame-title" :class="{'fix-to-top': isSlideUpFinish}">{{prologue.base}}</div>
      </transition>
    </div>

    <transition v-on:after-enter="afterEnter" name="show-picture">
      <div v-if="isSlideUpFinish" class="prize" :class="{opa: isShowPictureFinish}">
        <!-- <div>{{prize_photo.name}}</div> -->
        <img class="prize_photo" :src="prize_photo.url">
      </div>
    </transition>
    <!-- <button @click="typing">koko</button> -->
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      prize_photo: {
        name: '',
        url: ''
      },
      prologue: {
        base: 'most impressive photo is ...',
        disp: '',
        isStart: false
      },
      typing: [],
      sentence: {
        char: '',
        delay: {
          'animation-delay': ''
        }
      },
      isType: true,
      isSlideUpFinish: false,
      isShowPictureFinish: false
    }
  },
  mounted () {
    this.startTyping()
    this.getJson()
    setTimeout(function () { this.startSlideUp() }.bind(this), 3000)
  },
  methods: {
    startTyping () {
      var array = Array.from(this.prologue.base)
      this.typing = []
      for (var index = 0; index < array.length; index++) {
        if (array[index] === ' ') {
          array[index] = '&nbsp'
        }
        var del = index / 20
        var character = {
          chara: array[index],
          delay: del + 's'
        }
        this.typing.push(character)
      }
      console.log(this.typing)
      console.log(this.typing[array.length - 1].delay)
    },
    startSlideUp () {
      console.log('slideUp')
      this.isType = false
    },
    setPhoto (data) {
      console.log(data[0].src)
      console.log(data[0].title.split(' '))
      this.prize_photo.name = data[0].title
      this.prize_photo.url = this.$contest_image_url + data[0].src
    },
    getJson () {
      var _self = this
      const method = 'POST'
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      fetch(this.$content_list_url, {method, headers})
        .then(function (response) {
          return response.json()
        })
        .then(function (data) {
        // console.log('get image : ' + data.length)
          _self.setPhoto(data)
        })
    },
    enterSlider () {
      console.log('enter')
      this.isSlideUpFinish = true
    },
    waitDOMUpdate () {
      setTimeout(function () { return true }, 1000)
    },
    beforeLeave (el) {
      console.log('leave')
    },
    afterEnter () {
      this.isShowPictureFinish = true
    }
  }
}
</script>

<style scoped>
.img-wrap {
  overflow: hidden;
  position: relative;
}

.img-wrap:before {
  /* animation: img-wrap 2s cubic-bezier(.4, 0, .2, 1) forwards; */
  background: #fff;
  bottom: 0;
  content: '';
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

@keyframes show {
  100% {
    transform: translateX(100%);
  }
}

.typing {
  font-size: 4.5em;
  position: absolute;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}

.tame {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tame-title {
  display: inline-block;
  color: gold;
  height: 100px;
  font-size: 4.5em;
  position: absolute;
  animation-fill-mode: forwards;
}

.tame-slider-enter-active {
  animation-name: slide-up;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

@keyframes slide-up {
  0% {
    top: calc(50% - 50px);
  }
  100% {
    top: 0px;
  }
}

.fix-to-top {
  top: 0px;
}

.typing span {
  opacity: 0;
}

.prize {
  top: calc(10%);
  width: 100%;
  height: 80%;
  position: absolute;
  opacity: 0;
}

.prize_photo {
  position: absolute;
  width:auto;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}

.show-picture-enter-active {
  animation-name: show-pic;
  animation-delay: 4s;
  animation-duration: 3s;
}

.show-picture-leave-active {
  animation-name: show-pic;
  animation-delay: 4s;
  animation-duration: 3s;
}

@keyframes show-pic {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.opa {
  opacity: 1;
}

.prologue-spa-enter-active {
  color: gold;
  bottom: 0;
  animation-name: prologue-span;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  /* animation: prologue-span 2s ; */
}

.prologue-span-leave-active {
  animation: prologue-span 2s reverse;
}

.prologue-title {
  color: gold;
  bottom: 0;
  animation-name: prologue-span;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes prologue-span {
  100% {
    opacity: 1;
  }
  0% {
    opacity: 0;
  }
}
</style>
