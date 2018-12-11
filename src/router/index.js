import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Drawer from '@/components/DrawerLayout.vue'
import Player from '@/components/Player.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/drawer',
      name: 'Drawer',
      component: Drawer
    },
    {
      path: '/player',
      name: 'Player',
      component: Player
    }
  ]
})
