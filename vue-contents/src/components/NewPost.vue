<template>
  <transition name="new-post" v-on:after-leave="afterLeave">
  <!-- new post slide -->
  <!-- <section v-else class="img-wrap" style="background-color: #a0a0a0"> -->
    <section v-if="isShowNewImage" class="slides">
      <!-- <div @click="showSlide" class="debug_button">back</div> -->
      <section class="slide is-active">
        <div class="slide__content">
          <!-- img -->
          <figure class="slide__figure">
            <div class="slide__img" v-bind:style="{ 'background-image': newPost.url, 'background-size': 'contain', 'background-repeat': 'no-repeat' }"></div>
          </figure>

          <!-- name -->
          <header class="slide__header">
            <h2 class="slide__title">
              <span class="title-line"><span>{{ newPost.name.last }}</span></span>
              <span class="title-line"><span>{{ newPost.name.first }}</span></span>
            </h2>
          </header>

          <!-- new!! -->
          <header class="slide__header slide__header_new" style="overflow: hidden;">
            <h2 class="slide__title slide__title_new" style="margin: 0 0 0 auto;">
              <span class="title-line"><span>new!!&nbsp;</span></span>
            </h2>
          </header>
        </div>
      </section>
    </section>
  </transition>
</template>

<script>
export default {
  data: function () {
    return {
      newPost: { // 新規投稿画像データ
        url: '',
        name: {
          last: 'samukawa',
          first: 'momoka'
        }
      },
      newImages: [],
      nowShowImageNum: 0,
      isShowNewImage: false
    }
  },
  methods: {
    // 新規画像配列を受け取る。dataに格納し、まずひとつ目画像をセット
    setNewImagesInfo (newImages) {
      this.newImages = newImages

      // 画像枚数を登録
      this.nowShowImageNum = this.newImages.length

      this.startShowNewPost()
    },
    setShowImage () {
      var name = this.newImages[this.nowShowImageNum - 1].title.split(' ')
      this.newPost.url = 'url("' + this.$images_url + this.newImages[this.nowShowImageNum - 1].src + '")'
      this.newPost.name.last = name[1]
      this.newPost.name.first = name[0]

      // 画像枚数をデクリメント
      this.nowShowImageNum--

      this.isShowNewImage = true
    },
    changeImage () {
      // ここではv-ifをfalseにするだけ。そうすればleaveのアニメーションが始まり、アニメーション終了でafterLeaveがコールされる
      this.isShowNewImage = false
    },
    afterLeave () { // after finish new post leave animation
      if (this.nowShowImageNum === 0) { // 画像枚数をチェックし、0なら表示終了
        this.$emit('startSlideShow')
      } else { // 次の画像表示準備
        this.startShowNewPost()
      }
    },
    startShowNewPost () {
      this.setShowImage()
      setTimeout(function () { this.changeImage() }.bind(this), 4000)
    }
  }
}
</script>

<style scoped>
.slide__title_new {
  /* font-family: Montserrat, helvetica; */
  color: gold;
  font-size: 5em;
  /* transform: rotate(30deg); */

  animation-name: new_phrase;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
@media (min-width: 54em) {
  .slide__title_new {
    font-size: 8em;
  }
}

@keyframes new_phrase {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.new-post-enter-active {
  animation: new-post 2s cubic-bezier(.4, 0, .2, 1);
}

.new-post-leave-active {
  animation: new-post 2s cubic-bezier(.4, 0, .2, 1) reverse;
}

@keyframes new-post {
  0% {
    clip-path: circle(0 at 50% 50%);
    -webkit-clip-path: circle(0 at 50% 50%);
  }
  100% {
    clip-path: circle(100% at 50% 50%);
    -webkit-clip-path: circle(100% at 50% 50%);
  }
}
</style>
