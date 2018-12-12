import axios from 'axios'
import qs from 'qs'
import Application from '../main'

require('es6-promise').polyfill()

// axios 配置
axios.defaults.timeout = 80000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.responseType = 'json'
// axios.defaults.baseURL = 'http://localhost:8099/'

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  console.log(error)
  return Promise.reject(error)
})

// 返回状态判断
// 返回状态截获
axios.interceptors.response.use((res) => {
  // return Promise.reject(res)
  return Promise.resolve(res.data)
}, (error) => {
  alert('网络错误')
  return Promise.reject(error)
})

// ajax 返回结果处理方法
export const get = (function () {
  return function (url, params = {}, isSilence = false) {
    if (window.globalConfig.host) {
      url = window.globalConfig.host + url
    }

    return new Promise((resolve, reject) => {
      if (!isSilence) {
        Application.$store.commit('loading', true)
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
    if (window.globalConfig.host) {
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
