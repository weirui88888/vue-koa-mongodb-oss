/*
 * @Description:
 * @Autor: rui.wei
 * @Date: 2019-11-18 12:42:37
 * @Email: weirui@zhiketong.cn
 */
const Record = require('../db').Record
const User = require('../db').User
const xss = require('xss')
// const jwt = require('jsonwebtoken')
// const { TOKEN_ENCODE_STR } = require('../utils/config')
module.exports = {
  async addRecord (ctx, next) {
    // 转义，防止xss攻击
    let { title, type, detail } = ctx.request.body
    title = xss(title)
    detail = xss(detail)
    try {
      let record = new Record({
        user_id: ctx._id,
        creater: ctx.name,
        avatar: ctx.avatar,
        detail,
        title,
        type
      })
      let res = await record.save()
      if (res._id != null) {
        ctx.body = {
          code: 200,
          msg: '创建成功！',
          data: res
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '创建失败，服务器异常，请稍后再试!'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '留言失败，服务器异常，请稍后再试!'
      }
    }
  },
  async getRecord (ctx, next) {
    let { pageSize, pageNum, type, creater } = ctx.request.body
    let options = {
      skip: Number((pageNum - 1) * pageSize),
      limit: Number(pageSize),
      sort: { 'create_time': '-1' }
    }
    let queryParam = {}
    if (type) {
      queryParam.type = type
    }
    if (creater) {
      queryParam.creater = new RegExp(creater)
    }
    let res = await Record.find(queryParam, null, options)
    let total = await Record.countDocuments(queryParam, null, options)
    // for (let user of res) {
    //   let { user_id = '' } = user
    //   let dataUser = await User.find({ _id: user_id })
    //   // user.creater = dataUser[0].user_name
    //   user.avatar = dataUser[0].avatar
    // }
    ctx.body = {
      code: 200,
      data: {
        list: res,
        total
      },
      msg: '获取数据成功'
    }
  },
  async deleteRecord (ctx, next) {
    let _id = ctx.params.id
    try {
      let res = await Record.findOneAndDelete({ _id })
      if (res == null) {
        ctx.body = {
          code: 500,
          msg: '删除留言失败，服务器异常!'
        }
      } else {
        ctx.body = {
          code: 200,
          msg: '删除留言成功!'
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '删除留言失败，服务器异常!'
      }
    }
  },
  async getRecordById (ctx, next) {
    let _id = ctx.params.id
    try {
      let res = await Record.findOne({ _id }, { detail: true, title: true, type: true, _id: false })
      ctx.body = {
        code: 200,
        msg: '获取详情成功!',
        data: res
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '获取详情失败，服务器异常!'
      }
    }
  },
  async updateRecordById (ctx, next) {
    let { id, detail, type, title } = ctx.request.body
    console.log(detail)
    try {
      let res = await Record.findOneAndUpdate({ _id: id }, {
        $set: {
          detail,
          type,
          title
        }
      }, { new: true })
      if (res !== null) {
        ctx.body = {
          code: 200,
          msg: '更新数据成功'
        }
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '更新数据失败，服务器异常'
      }
    }
  }
}
