import instance from '../request/axios'

// 注册
const register = (data) => {
  return instance.post('/api/user/register', data)
}

// 登陆
const login = (data) => {
  return instance.post('/api/user/login', data)
}

export default {
  register,
  login
}
