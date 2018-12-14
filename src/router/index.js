import Vue from 'vue'
import Router from 'vue-router'
// 问候页面
import Index from '@/pages/Index'
// 电子绘本相关页面
import Drawer from '@/pages/Drawer.vue' // 编辑器页面
import Player from '@/pages/Player.vue' // 播放器页面
import Publish from '@/pages/Publish.vue' // 发布提交页面

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
    },
    {
      path: '/publish',
      name: 'Publish',
      component: Publish
    }
  ]
})
