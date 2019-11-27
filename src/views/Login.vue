<template>
  <div class="itc-login-wrap">
    <div class="login-area">
      <div class="login-logo">
        登陆
      </div>
      <div class="login-form">
        <div class="login-form-header">
          <div class="pd10 font-weight">Login to our site </div>
          <div class="pdb10">Enter your username and password to log on:</div>
        </div>
        <div class="login-form-body">
            <el-form ref="loginForm" :model="loginForm" label-width="80px" class="form-container" :rules="loginRules">
                <el-form-item prop="user_id">
                  <el-input v-model="loginForm.user_id" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="user_pwd">
                  <el-input v-model="loginForm.user_pwd" placeholder="密码" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input placeholder="验证码" v-model="loginForm.code" prefix-icon="el-icon-key" class="code_input"></el-input>
                  <div class="code">
                      <img :src="img_base64" alt="code" title="点击切换验证码" @click="changeCode">
                  </div>
                </el-form-item>
                  <el-button type="danger" class="w100" @click="login('loginForm')" :loading="loginStatus">登 陆</el-button>
                  <p class="toRegister"><el-link type="info" @click="goRegister">没有账号,去注册</el-link></p>
              </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HttpCode from '../api/code'
import HttpUser from '../api/user'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        user_id: '',
        user_pwd: '',
        code: '',
        code_token: ''
      },
      loginStatus: false,
      loginRules: {
        user_id: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        user_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 4, message: '请输入4位有效验证码', trigger: 'blur' }
        ]
      },
      img_base64: ''
    }
  },
  created () {
    var _self = this
    document.onkeydown = function (e) {
      var key = window.event.keyCode
      if (key === 13 || key === 100) {
        _self.login('loginForm')
      }
    }
    this.getCode()
  },
  methods: {
    async getCode () {
      let res = await HttpCode.getCode()
      let { code, data = {} } = res
      if (code === 200) {
        this.img_base64 = data.img
        this.loginForm.code_token = data.token
      }
    },
    changeCode () {
      this.getCode()
    },
    goRegister () {
      this.$router.push({
        path: '/register'
      })
    },
    login (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let _self = this
          // 防止误操多点
          if (this.loginStatus) {
            return false
          }
          this.loginStatus = true
          let res = await HttpUser.login(this.loginForm)
          let { code, msg, data = {} } = res
          if (code === 200) {
            this.$store.commit('save', {
              _id: data._id,
              token: data.token,
              avatar: data.avatar,
              user_name: data.user_name
            })
            this.$router.push({
              path: '/'
            })
          } else {
            this.$message({
              message: msg,
              type: 'error',
              onClose () {
                _self.getCode()
                _self.loginStatus = false
                _self.loginForm.code = ''
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
.itc-login-wrap {
  height: 100%;
  background: url("../assets/bg3_4.jpg");
  background-size: 100% 100%;
  position: relative;
}
.login-area {
  width: 555px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.login-logo {
  text-align: center;
  font-size: 25px;
  color: #000;
  font-family: cursive;
  font-weight: bold;
  padding: 20px 0;
}
.login-form {
  background: rgba(0,0,0,.3);
  padding: 0 20px;
}
.font-weight {
  font-size: 18px;
  font-weight: bold;
}
.pd10 {
  padding: 20px 0;
}
.pdb10 {
  padding-bottom: 10px;
}
.login-form-body {
  padding: 30px 0 10px 0;
}
.form-container .el-input {
  margin-bottom: 5px;
}
.w100 {
  width: 100%;
}
.code_input {
  width: 400px;
}
.code {
  width: 100px;
  cursor: pointer;
  float: right;
}
.toRegister {
  margin: 10px 0;
  text-align: center;
}
.toRegister .el-link--info{
  font-size: 12px;
  color: #fff;
}
.form-container .el-form-item__content{
  margin-left: 0 !important;
  line-height: 20px !important;
}
</style>
