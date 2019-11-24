import instance from '../request/axios'

const getCode = () => {
  return instance.get('/api/code/checkcode')
}

export default {
  getCode
}
