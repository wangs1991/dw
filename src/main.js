// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Store from './store/index'
import router from './router'
import {Slider, Upload, Popover, Button, Dialog, Tooltip, InputNumber, Form, FormItem, Input, Select, Option, Tabs, TabPane, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/fonts.scss'

import './components/dialogs/index'

require('es6-promise').polyfill()

Vue.use(Slider)
Vue.use(Upload)
Vue.use(Popover)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.prototype.$message = Message

Vue.config.productionTip = false

const limitFilter = (router, app) => {
  if (router.name && (router.name === 'Drawer' ||
      router.name === 'Publish' ||
      router.name === 'Workbench' ||
      router.name === 'Profile')) {
    // 用于登录后再其他页面刷新使用的判断
    if (app.$store.state.userData.id) {
      return true
    } else {
      app.$login()
      return false
    }
  } else {
    return true
  }
}
/* eslint-disable no-new */
export const Application = new Vue({
  el: '#app',
  router,
  store: Store,
  components: { App },
  template: '<App/>',
  created () {
    if (!limitFilter(this.$route, this)) {
      this.$router.replace('/')
    }
  }
})

/**
 * url输入验证登录权限拦截
 */
// 检查当前跳转页面是否可以访问[除登陆外都不可访问]
Application.$router.beforeEach((to, from, next) => {
  // 路由匹配不到直接去404错误页
  if (to.matched.length < 1) {
    Application.$router.replace('/')
    return false
  }
  if (limitFilter(to, Application)) {
    next()
  }
})
export default Application
