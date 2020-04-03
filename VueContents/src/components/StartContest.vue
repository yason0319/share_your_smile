<template>
  <div class="contest_content">
    <div class="title_area">
      <div class="start_phrase">photo contest</div>
      <div class="margin_man"></div>
      <button class="start_button" @click="watchResult"><span>watch!</span></button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    watchResult () {
      this.$router.push({path: '/contest'})
    }
  }
}
</script>

<style scoped>
.contest_content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.start_phrase {
  font-size: 80px;
}

.margin_man {
  height: 150px;
  width: 20px;
}

.title_area {
  align-items: center;
}

.start_button {
  display: block;
  font-size: 50px;
  border: double 10px #ccc;
  border-radius: 20px;
  color: #ccc;
  background-color: #000;
  margin: 0 auto;
}

</style>
