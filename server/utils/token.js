const { TOKEN_ENCODE_STR, URL_YES_PASS } = require('./config')
const CheckCode = require('../db').CheckCode
const User = require('../db').User
const jwt = require('jsonwebtoken')
module.exports = {
  // 生成登录 token
  create_token (str) {
    return jwt.sign({ str }, TOKEN_ENCODE_STR, { expiresIn: '1h' })
  },
  /*
    验证登录 token 是否正确  => 写成中间件
    get 请求与设置的请求不拦截验证，其余均需登录
  */
  async check_token (ctx, next) {
    let url = ctx.url
    if (ctx.method !== 'GET' && !URL_YES_PASS.includes(url)) {
      let token = ctx.get('Authorization')
      if (token === '') {
      // 直接抛出错误
        ctx.status = 401
        ctx.body = '你还没有登录，快去登录吧!'
        return
      }
      try {
      // 验证token是否过期
        let { str = '' } = await jwt.verify(token, TOKEN_ENCODE_STR)
        // 验证token与账号是否匹配
        let res = await User.find({ user_id: str, token })
        if (res.length === 0) {
          ctx.status = 401
          ctx.body = '登录过期,请重新登录!'
          return
        }
        // 保存用户的_id，便于操作
        ctx._id = res[0]._id
        ctx.name = res[0].user_name
        ctx.avatar = res[0].avatar
      } catch (e) {
        ctx.status = 401
        ctx.body = '登录已过期,请重新登录!'
        return
      }
    }
    await next()
  },
  // 判断验证码
  async check_token_code ({ token, code }) {
    try {
      // 验证码转大写
      code = code.toUpperCase()
      await jwt.verify(token, TOKEN_ENCODE_STR)
      // 读数据库，删除验证码
      let res = await CheckCode.findOneAndDelete({ token, code })
      if (res == null) {
        return false
      }
    } catch (e) {
      return false
    }
    return true
  }
}
