import axios from 'axios'
import store from '../store'
import router from '../router'
import { Message } from 'element-ui'
let $message = Message

const instance = axios.create({
  'Content-Type': 'application/json;charset=UTF-8',
  'timeout': 20000
})

// request拦截器，每次发送请求的时候拦截下来
instance.interceptors.request.use(
  config => {
    // 每次发送请求，检查 vuex 中是否有token,如果有放在headers中
    if (store.state.user.token) {
      config.headers.Authorization = store.state.user.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
  },
  err => {
    let { response } = err
    if (response !== null) {
      // 这里为什么处理401错误,详见，server/untils/token check_token这个函数
      if (response.status === 401) {
        let msg = response.data || '请重新登录!'
        $message({
          message: msg,
          type: 'error',
          onClose () {
            store.commit('remove') // token过期,清除
            router.replace({ // 跳转到登录页面
              path: '/login',
              // 添加一个重定向后缀，等登录以后再到这里来
              query: { redirect: router.currentRoute.fullPath }
            })
          }
        })
        return Promise.reject(err.response)
      } else {
        $message({
          message: '出错了，请重新登陆',
          type: 'error',
          onClose () {
            store.commit('remove') // token过期,清除
            router.replace({ // 跳转到登录页面
              path: '/login',
              // 添加一个重定向后缀，等登录以后再到这里来
              query: { redirect: router.currentRoute.fullPath }
            })
          }
        })
        return Promise.reject(err.response)
      }
    } else {
      console.log(err)
    }
  }
)

export default instance
