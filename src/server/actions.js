import {get, post} from './index'

export const register = (data = {}) => {
  return post('/user/register', data)
}

export const login = (data = {}) => {
  return post('/user/login', data)
}

export const getStyles = () => {
  return get('/tomato/allCustoms', {})
}

export const getSeriesByStyle = (data) => {
  return get('/tomato/query/custom', {
    params: data
  })
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
  })
}

export const getBooksByUid = data => {
  return get('/tomato/query/uId', {
    params: data
  })
}
