import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import SlideShow from '@/components/SlideShow'
import Start from '@/components/Start'
import StartContest from '@/components/StartContest'
import Contest from '@/components/Contest'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start
    },
    {
      path: '/slide_show',
      name: 'SlideShow',
      component: SlideShow
    },
    {
      path: '/start_contest',
      name: 'StartContest',
      component: StartContest
    },
    {
      path: '/contest',
      name: 'Contest',
      component: Contest
    }
  ]
})
