/*
 * @Description:
 * @Autor: rui.wei
 * @Date: 2019-11-14 19:15:39
 * @Email: weirui@zhiketong.cn
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import User from './module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      _id: window.sessionStorage.getItem('_id') || '',
      user_name: window.sessionStorage.getItem('user_name') || '',
      token: window.sessionStorage.getItem('token') || '',
      avatar: window.sessionStorage.getItem('avatar') || ''
    }
  },
  mutations: {
    save (state, data) {
      state.user._id = data._id
      state.user.token = data.token
      state.user.user_name = data.user_name
      state.user.avatar = data.avatar

      window.sessionStorage.setItem('_id', data._id)
      window.sessionStorage.setItem('token', data.token)
      window.sessionStorage.setItem('user_name', data.user_name)
      window.sessionStorage.setItem('avatar', data.avatar)
    },
    remove (state, data) {
      state.user._id = ''
      state.user.token = ''
      state.user.user_name = ''
      state.user.avatar = ''

      window.sessionStorage.removeItem('_id')
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('user_name')
      window.sessionStorage.removeItem('avatar')
    }
  },
  actions: {
  },
  modules: {
    // User
  }
})
