// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// var baseUrl = 'http://192.168.128.201:3000/'
var baseUrl = 'http://localhost:3000/'

Vue.config.productionTip = false
Vue.prototype.$api_url = 'http://localhost:3000/'
Vue.prototype.$images_url = baseUrl + 'images/'
Vue.prototype.$images_list_url = baseUrl + 'images/get_list'
Vue.prototype.$contest_image_url = baseUrl + 'contest/'
Vue.prototype.$content_list_url = baseUrl + 'images/contest/get_list'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
