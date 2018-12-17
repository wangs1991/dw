// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Store from './store/index'
import router from './router'
import {Slider, Upload, Popover, Button, Dialog, Tooltip, InputNumber, Form, FormItem, Input, Select, Option} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

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

Vue.config.productionTip = false

/* eslint-disable no-new */
export const Application = new Vue({
  el: '#app',
  router,
  store: Store,
  components: { App },
  template: '<App/>'
})
export default Application
