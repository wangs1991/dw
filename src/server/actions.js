import {get} from './index'

export const getStyles = () => {
  return get('/tomato/allCustoms', {}, true)
}
