import Vue from 'vue'
import Router from 'vue-router'
import Practice from '@/components/Practice'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Practice',
      component: Practice
    }
  ]
})
