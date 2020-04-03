<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- ごちゃごちゃしていたのを全て消して、ボタンを配置 -->
    <button @click='post'>click me</button>
    <button @click='post2'>click mee</button>
  </div>
</template>

<script>
import Methods from '@/api/methods'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    // サーバーから返ってくる値をログに出力したいのでasyncとawaitを行う
    async post () {
      let response = await Methods.testPosting()
      console.log(response)
    },
    async post2 () {
      let response = await Methods.testPosting2()
      console.log(response)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
