import Vue from 'vue'
import Vuex from 'vuex'
// import User from './module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      _id: window.localStorage.getItem('_id') || '',
      user_name: window.localStorage.getItem('user_name') || '',
      token: window.localStorage.getItem('token') || '',
      avatar: window.localStorage.getItem('avatar') || ''
    }
  },
  mutations: {
    save (state, data) {
      state.user._id = data._id
      state.user.token = data.token
      state.user.user_name = data.user_name
      state.user.avatar = data.avatar

      window.localStorage.setItem('_id', data._id)
      window.localStorage.setItem('token', data.token)
      window.localStorage.setItem('user_name', data.user_name)
      window.localStorage.setItem('avatar', data.avatar)
    },
    remove (state, data) {
      state.user._id = ''
      state.user.token = ''
      state.user.user_name = ''
      state.user.avatar = ''

      window.localStorage.removeItem('_id')
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user_name')
      window.localStorage.removeItem('avatar')
    }
  },
  actions: {
  },
  modules: {
    // User
  }
})
