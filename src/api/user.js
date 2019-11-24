/*
 * @Description:
 * @Autor: rui.wei
 * @Date: 2019-11-17 20:10:41
 * @Email: weirui@zhiketong.cn
 */
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
