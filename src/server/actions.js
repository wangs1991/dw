import {get, post} from './index'

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

export const getBookList = data => {
  return get('/tomato/all')
}
