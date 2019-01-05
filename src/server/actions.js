import {get, post} from './index'

export const register = (data = {}) => {
  return post('/user/register', data, true)
}

export const login = (data = {}) => {
  return post('/user/login', data, true)
}

export const getStyles = () => {
  return get('/tomato/allCustoms', {}, true)
}

export const getSeriesByStyle = (data) => {
  return get('/tomato/query/custom', {
    params: data
  }, true)
}

export const publishBook = data => {
  return post('/tomato/add', data)
}

export const uploadMeta = data => {
  return post('/tomato/uploadImg', data)
}

export const getBookList = () => {
  return get('/tomato/all')
}

export const getBookDetail = data => {
  return get('/tomato/query', {
    params: data
  }, true)
}

export const getBooksByUid = data => {
  return get('/tomato/query', {
    params: data
  }, true)
}
