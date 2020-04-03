<template>
  <div>
    <!-- slide show -->
    <section v-show="isSlideShow" class="slides">

      <div class="slides_phrase">Share your smile!!</div>

      <section v-for="(image, index, key) in images" class="slide" v-bind:class="{'is-active' : image.active }" :key="key">
        <div v-if="!image.finishShow" class="slide__content">
          <figure class="slide__figure">
            <div class="slide__img" v-bind:style="{ 'background-image': image.url, 'background-size': 'contain', 'background-repeat': 'no-repeat' }"></div>
            <!-- <img class="slide__img" :src="image.url"> -->
          </figure>
          <header class="slide__header">
            <h2 class="slide__title">
              <span class="title-line"><span>{{ image.name.last }}</span></span>
              <span class="title-line"><span>{{ image.name.first }}</span></span>
            </h2>
          </header>
        </div>
      </section>
    </section>

    <new-post @startSlideShow="startSlideShow" ref="refNewPost"></new-post>

    <!-- navigation area -->
    <!-- <section class="slides-nav">
      <nav class="slides-nav__nav">
        <button class="slides-nav__stop js-stop" @click="stopSlide">Stop</button>
        <button class="slides-nav__prev js-prev" @click="prevSlide">Prev</button>
        <button class="slides-nav__next js-next" @click="nextSlide">Next</button>
        <button class="slides-nav__stop js-stop" @click="showNewPostFromClick">NewPost</button>
      </nav>
    </section> -->
  </div>
</template>

<script>
import NewPost from './NewPost'
import Vue from 'vue'

Vue.component('new-post', NewPost)

export default {
  data: function () {
    return {
      showNum: -1, // 現在表示されている画像の番号
      isSlideShow: true, // スライドショー表示状態
      totalPostNum: 0, // 総画像枚数
      showNumber: 10, // ランダムに表示させる写真の枚数

      slideLoop: null, // スライド切り替えループ
      newPostLoop: null, // jsonチェックループ

      images: [], // 全画像データ

      image: { // 1枚の画像データ
        url: '',
        name: {
          last: '',
          first: ''
        },
        post_no: 0,
        active: false,
        finishShow: false
      },
      newPost: { // 新規投稿画像データ
        url: '',
        name: {
          last: 'samukawa',
          first: 'momoka'
        }
      }
    }
  },
  mounted () {
    this.startSlideShow()
    this.newPost.url = 'url("' + this.$images_url + '寒川 桃香 - IMG_20191221_210847.jpg")'
  },
  beforeDestroy () {
    console.log('destroy')
    if (this.slideLoop != null) {
      clearInterval(this.slideLoop)
    }
    if (this.newPostLoop != null) {
      console.log('new post')
      clearInterval(this.newPostLoop)
    }
  },
  methods: {
    startSlideShow () {
      this.changeSlide()
      this.getImageJson()
      console.log('startSlideshow')
      this.isSlideShow = true
      // change slide loop
      this.slideLoop = setInterval(function () { this.changeSlide() }.bind(this), 6000)
      // check new post loop
      this.newPostLoop = setInterval(function () { this.getImageJson() }.bind(this), 2000)
    },
    changeSlide () {
      if (this.images.length !== 0) {
        // debug
        // this.nextSlide()
        var dispIndex = -1
        var nowDispArryNum = 0
        var nextDispArryNum = 0

        // ①ランダム表示枚数の中で乱数を発生させる
        // ②現在の登録数
        if (this.images.length < this.showNumber) { // showNumber以下の登録数
          do {
            dispIndex = Math.floor(Math.random() * (this.images.length)) + 1
          } while (dispIndex === -1 || dispIndex === this.showNum)
          console.log(dispIndex)
        } else {
          do {
            var random = Math.floor(Math.random() * (this.showNumber))
            // console.log(random)
            dispIndex = this.images.length - random
            // console.log(dispIndex)
          } while (dispIndex === -1 || dispIndex === this.showNum)
        }

        for (var arryNum = 0; arryNum < this.images.length; arryNum++) {
          if (this.images[arryNum].post_no === dispIndex) { // 新しく表示するものをtrueに
            // console.log('next disp : ' + arryNum)
            nextDispArryNum = arryNum
          } else if (this.images[arryNum].post_no === this.showNum) { // これまで表示されていたものはfalseに
            // console.log('hide disp : ' + arryNum)
            nowDispArryNum = arryNum
          }
        }
        this.images[nowDispArryNum].active = false
        this.images[nextDispArryNum].active = true
        this.showNum = dispIndex
        // console.log(this.images[dispIndex].islongwidth)
        this.changeAction()
      }
    },
    getImageJson () {
      var _self = this
      const method = 'POST'
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      fetch(this.$images_list_url, {method, headers})
        .then(function (response) {
          return response.json()
        })
        .then(function (data) {
        // console.log('get image : ' + data.length)
          _self.setImages(data)
        })
    },
    setImages (data) {
      // imagesに既に値が格納されているか？
      if (this.images.length === 0) { // initialize images
        for (var i = 0; i < data.length; i++) {
          this.setImageInfo(data[i])
        }

        // set the first image
        var firstShowNum = 0
        if (this.showNumber > this.images.length) {
          firstShowNum = 1
          console.log('upper')
        } else {
          firstShowNum = this.images.length - this.showNumber + 1
          console.log('down')
        }
        // 最初に表示するスライドを設定 + 表示枚数以上だった場合、古いものはすべて表示終了に倒す
        for (var arryNum = 0; arryNum < this.images.length; arryNum++) {
          if (this.images[arryNum].post_no === firstShowNum) {
            this.images[arryNum].active = true
            this.showNum = firstShowNum
            console.log(firstShowNum)
          } else if (this.images[arryNum].post_no < firstShowNum) {
            this.images[arryNum].finishShow = true
          }
        }
      } else if (this.images.length > 0) { // update images
        // console.log('now length : ' + this.images.length)
        // console.log('data length : ' + data.length)
        if (this.images.length < data.length) {
          this.addImages(data)
        }
      }
    },
    addImages (data) {
      // console.log('add images')

      // 複数枚が更新された場合を想定し、更新された画像データは一旦配列に格納する
      var unregisterdImages = []

      // json取得処理の結果、新しい配列が含まれていた場合、ここの処理を行う
      // 追加配列をimages配列に追加し、各種パラメータの更新を行う
      for (var dArryNum = 0; dArryNum < data.length; dArryNum++) {
        var isNewImage = true
        for (var iArryNum = 0; iArryNum < this.images.length; iArryNum++) {
          if (data[dArryNum].post_no === this.images[iArryNum].post_no) {
            isNewImage = false
          }
        }
        if (isNewImage === true) {
          // regist to unregisterd images array
          unregisterdImages.push(data[dArryNum])
        }
      }

      for (var indexOfUnregisterdImages = 0; indexOfUnregisterdImages < unregisterdImages.length; indexOfUnregisterdImages++) {
        // images配列へセット + 最低番号以下の画像を非表示にする
        this.setImageInfo(unregisterdImages[indexOfUnregisterdImages])
      }
      // this.$refs.refNewPost.setNewImageInfo(data[dArryNum])
      this.$refs.refNewPost.setNewImagesInfo(unregisterdImages)
      this.showNewPost()

      // 表示される最低の番号 ex) 総枚数=25,表示枚数=10の場合、25-10+1=16
      var lowerLimitNum = this.images.length + 1 - this.showNumber

      // 新規投稿画像が格納できたら、古いものは非表示に倒す
      for (var arryNum = 0; arryNum < this.images.length; arryNum++) {
        if (this.images[arryNum].post_no < lowerLimitNum) {
          this.images[arryNum].finishShow = true
        }
      }
    },
    setImageInfo (dataImage) {
      var name = dataImage.title.split(' ')

      // set image info
      var image = {
        url: 'url("' + this.$images_url + dataImage.src + '")',
        // url: 'assets/slideImg/' + d_image.src,
        name: {
          last: name[1],
          first: name[0]
        },
        post_no: dataImage.post_no,
        active: false,
        finishShow: false
      }

      // add image to images
      this.images.push(image)
    },
    // TODO:同時に複数投稿されるケースを想定し、newPostも配列で持っておく
    setNewImageInfo (dataImage) {
      var name = dataImage.title.split(' ')
      this.newPost.url = 'url("' + this.$images_url + dataImage.src + '")'
      this.newPost.name.last = name[1]
      this.newPost.name.first = name[0]
    },
    updateDispImage () {
      // 一番若い番号の要素を削除し、新規の要素を追加する
      this.totalPostNum = this.images.length + 1
      for (var iArryNum = 0; iArryNum < this.images.length; iArryNum++) {
        if (this.images[iArryNum].post_no > this.totalPostNum - this.showNumber) {
          this.dispImages.push(this.images[iArryNum])
        }
      }
    },
    prevSlide () {
      console.log('prev shimasen')
    },
    nextSlide () {
      for (var i = 0; i < this.images.length; i++) {
        if (this.images[i].active === true) {
          this.images[i].active = false
          if (i === this.images.length - 1) {
            this.images[0].active = true
          } else {
            this.images[i + 1].active = true
          }
          break
        }
      }
      this.changeAction()
    },
    showNewPost () { // start new post enter animation
      this.isSlideShow = false
      this.stopSlide()
      // new post が複数ある場合、全てのスライドを表示し終えてからshowSlideを呼ぶべき。よって、showSlideはnewPostコンポーネント内で呼び出す
      // setTimeout(function () { this.showSlide() }.bind(this), 4000)
    },
    showNewPostFromClick () {
      var unregisterdImages = []
      unregisterdImages.push(this.images[0])
      unregisterdImages.push(this.images[1])
      this.$refs.refNewPost.setNewImagesInfo(unregisterdImages)
      this.showNewPost()
    },
    showSlide () { // start new post leave animation
      console.log('restart')
    },
    changeAction () {
      // $('body').addClass('is-sliding')
      document.body.classList.add('is-sliding')

      setTimeout(function () {
        // $('body').removeClass('is-sliding')
        document.body.classList.remove('is-sliding')
      }, 1000)
    },
    stopSlide () {
      clearInterval(this.slideLoop)
      clearInterval(this.newPostLoop)
    }
  }
}
</script>

<style>
.slides-nav {
  z-index: 99;
  /* position: fixed; */
  position: absolute;
  top: 0px;
  right: 0px;
  /* width: 20%; */
  display: flex;
  align-items: center;
  height: 100%;
  color: #111;
}
@media (min-width: 54em) {
  .slides-nav {
    /* right: 2%; */
  }
}
.slides-nav__nav {
  position: relative;
  right: 0;
  display: block;
  font-size: 1em;
  transform: rotate(90deg);
  transform-origin: center;
}
.slides-nav button {
  position: relative;
  display: inline-block;
  padding: 0.35em;
  margin: 0;
  font-family: "Space Mono", monospace;
  appearance: none;
  background: transparent;
  border: 0;
  overflow-x: hidden;
  transition: color 0.5s ease;
}
.slides-nav button:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  height: 1px;
  width: 0;
  background: #111;
  transition: width 0.4s ease;
}
.slides-nav button:hover {
  cursor: pointer;
  color: rgba(17, 17, 17, 0.75);
  transition: color 0.5s ease;
}
.slides-nav button:hover:after {
  width: 100%;
  transition: width 0.4s ease;
}
.slides-nav button:focus {
  outline: 0;
}
.is-sliding .slides-nav {
  pointer-events: none;
}

.slides {
  position: relative;
  display: block;
  height: 100vh;
  /* height: 100%; */
  width: 100%;
  /* width: 80%; */
  background: linear-gradient(-135deg, #E4A972, #9941D8);
  transition: background 1s cubic-bezier(0.99, 1, 0.92, 1);
}
.is-sliding .slides {
  /* background: #ededed; */
  transition: background 0.3s cubic-bezier(0.99, 1, 0.92, 1);
}

.slides_newpost {
  z-index: 990;
}

.slide {
  z-index: -1;
  padding: 0;
  position: absolute;
  width: 100%;
  /* width: 80%; */
  height: 100vh;
  transition: z-index 1s ease;
}
.slide.is-active {
  z-index: 19;
  transition: z-index 1s ease;
}
.slide__content {
  position: relative;
  margin: 0 auto;
  height: 95%;
  width: 95%;
  top: 2.5%;
}
@media (min-width: 54em) {
  .slide__content {
    height: 85%;
    width: 85%;
    top: 7.5%;
  }
}
.new_slide__content {
  position: relative;
  margin: 0 auto;
  height: 95%;
  width: 95%;
  top: 2.5%;
}
@media (min-width: 54em) {
  .new_slide__content {
    height: 80%;
    width: 80%;
    top: 10%;
  }
}
.slide__header {
  z-index: 9;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow-y: hidden;
  transform: translateX(5%);
}
@media (min-width: 54em) {
  .slide__header {
    transform: translateX(-5%);
  }
}
.slide__header_new {
  text-align: right;
  transform: translate(-3%, 0);
  align-items: baseline;
  padding: 2%;
}
@media (min-width: 54em) {
  .slide__header_new {
    transform: translate(3%, -3%);
  }
}
.slide__title {
  /* font-family: Montserrat, helvetica; */
  font-size: 2.5em;
  font-weight: 700;
  color: #111;
  overflow-y: hidden;
  text-shadow: 1px 1px 0 #a0a0a0,
               -1px 1px 0 #a0a0a0,
               1px -1px 0 #aaa,
               -1px -1px 0 #aaa;
}
@media (min-width: 54em) {
  .slide__title {
    font-size: 5em;
  }
}
.slide__title .title-line {
  display: block;
  overflow-y: hidden;
}
.slide__title .title-line span {
  display: inline-block;
  transform: translate3d(0, 140%, 0);
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.8s ease;
}
.slide__title .title-line span:nth-child(1) {
  transition-delay: 0.15s;
}
.slide__title .title-line span:nth-child(2) {
  transition-delay: 0.3s;
}
.is-active .slide__title .title-line span {
  transform: translate3d(0, 0%, 0);
  opacity: 1;
  transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.1s ease;
}
.is-active .slide__title .title-line:nth-of-type(2n) span {
  transition-delay: 0.2s;
}
.slide__figure {
  z-index: 7;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.is-sliding .slide__figure {
  transform: scale(0.8);
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.slide__img {
  position: relative;
  display: block;
  background-size: cover;
  background-attachment: fixed;
  background-position: 50%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  height: 0%;
  width: 100%;
  filter: grayscale(0%);
  transition: height 1s 1.4s cubic-bezier(0.19, 1, 0.22, 1), filter 0.4s 0.1s ease;
}
.is-active .slide__img {
  height: 100%;
  opacity: 1;
  transition: height 0.5s 0.3s cubic-bezier(0.77, 0, 0.175, 1), filter 0.4s 0.1s ease;
}
.is-sliding .slide__img {
  filter: grayscale(100%);
}
.slides_phrase {
  padding: 0.5%;
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 3.7em;
}
</style>
