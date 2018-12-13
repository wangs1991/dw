import {get} from './index'

export const getStyles = () => {
  return get('/tomato/allCustoms', {}, true)
}

export const getSeriesByStyle = (data) => {
  return get('/tomato/query/custom', {
    params: data
  }, true)
}
