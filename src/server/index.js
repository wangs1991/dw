import axios from 'axios'
// import qs from 'qs'
import {Application} from '../main'

require('es6-promise').polyfill()

// axios 配置
axios.defaults.timeout = 80000
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers['X-Request-With'] = 'XMLHttpRequest' // ajax请求方式
axios.defaults.responseType = 'json'

// 返回状态判断
// 返回状态截获
axios.interceptors.response.use((res) => {
  // return Promise.reject(res)
  if (res.data.code === 101) {
    Application.$message({
      message: res.data.msg,
      type: 'error'
    })
    return Promise.reject(res.data)
  }
  return Promise.resolve(res.data)
}, (error) => {
  Application.$message({
    message: '网络错误',
    type: 'error'
  })
  return Promise.reject(error)
})

// ajax 返回结果处理方法
export const get = (function () {
  return function (url, params = {}, isSilence = false) {
    if (window.globalConfig.host && window.globalConfig.env !== 'development') {
      url = window.globalConfig.host + url
    }

    return new Promise((resolve, reject) => {
      if (!isSilence) {
        try {
          Application.$store.commit('loading', true)
        } catch (e) { }
      }
      axios.get(url, params)
        .then(response => {
          resolve(response.data)
          if (!isSilence) {
            Application.$store.commit('loading', false)
          }
        }, err => {
          reject(err)
          if (!isSilence) {
            Application.$store.commit('loading', false)
          }
        })
        .catch((error) => {
          reject(error)
          if (!isSilence) {
            Application.$store.commit('loading', false)
          }
        })
    })
  }
})()

export const post = (function () {
  return function (url, params = {}, isSilence = false) {
    if (window.globalConfig.host && window.globalConfig.env !== 'development') {
      url = window.globalConfig.host + url
    }

    return new Promise((resolve, reject) => {
      if (!isSilence) {
        Application.$store.commit('loading', true)
      }
      axios.post(url, params)
        .then(response => {
          resolve(response.data)
          if (!isSilence) {
            Application.$store.commit('loading', false)
          }
        }, err => {
          reject(err)
          if (!isSilence) {
            Application.$store.commit('loading', false)
          }
        })
        .catch((error) => {
          reject(error)
          if (!isSilence) {
            Application.$store.commit('loading', false)
          }
        })
    })
  }
})()

export default {
  fetch
}
