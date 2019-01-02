'use strict'
import Vue from 'vue'
import * as ModalDialogs from 'vue-modal-dialogs'
import Share from './share.vue'
import Login from './login.vue'
import Register from './register.vue'

// Install vue-modal-dialogs
Vue.use(ModalDialogs)

// Make serval dialog functions
export const ShareDialog = ModalDialogs.create(Share, 'bookName')
export const LoginDialog = ModalDialogs.create(Login)
export const RegisterDialog = ModalDialogs.create(Register)

// You can install dialog functions into Vue's prototype
Vue.prototype.$share = ShareDialog
Vue.prototype.$login = LoginDialog
Vue.prototype.$register = RegisterDialog
