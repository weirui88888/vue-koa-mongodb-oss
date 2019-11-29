const Record = require('../db').Record
const xss = require('xss')
const OSS = require('ali-oss')
const path = require('path')

// 图片上传阿里云对象存储步骤，将client对象注释放开，把client对象里面的相关配置改成你自己的配置，将本文件里的addRecord／updateRecordById两个方法中的url链接改成你自己的链接
// 这里假如你创建了一个bucket桶，名字叫做ABC，仓库里面创建个文件夹images，用来后续上传图片
// 比如url: 'https://ABC.oss-cn-beijing.aliyuncs.com/images/' + elem.originalname

// let client = new OSS({
//   region: 'oss-cn-beijing', // 阿里云对象存储地域名,这是我的，替换成你自己的就行
//   accessKeyId: '', // api接口id
//   accessKeySecret: '', // api接口密码
//   bucket: 'ABC' // 就是你上面提到的bucket桶ABC
// })

module.exports = {
  async addRecord (ctx, next) {
    let { title, type, detail } = ctx.request.body
    let files = ctx.request.files
    let img = []

    files.forEach((elem, index) => {
      img.push({
        name: elem.originalname,
        // url: 'https://mbs-itc.oss-cn-beijing.aliyuncs.com/images/' + elem.originalname // 1.使用图片上传阿里云,前提是你开通了阿里云对象存储，也创建了bucket（适合开通服务器，并且开通阿里云对象存储的人群）
        // url: 'http://123.56.119.218/server/public/images/' + elem.originalname // 2.图片上传nginx服务器（用nginx服务器存放静态资源，适合开通服务器，没有开通阿里云对象存储的人群）
        url: 'http://localhost:3000/images/' + elem.originalname // 3.本地开发，图片上传到本地server/public目录中的images文件夹（适合本地启动，即没有开通任何阿里云服务产品）
      })
    })

    // 上面三种情况，仅第1种上传阿里云时，需要执行下面的img.froeach循环，其他两种情况下注释即可
    // img.forEach(async (elem, index) => {
    //   await client.put('images/' + elem.name, path.join(__dirname, '../public/images/') + elem.name)
    // })

    // 转义，防止xss攻击
    title = xss(title)
    detail = xss(detail)
    try {
      let record = new Record({
        user_id: ctx._id,
        creater: ctx.name,
        avatar: ctx.avatar,
        detail,
        title,
        type,
        img,
        view: 0
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
    let { pageSize, pageNum, type, creater, view } = ctx.request.body
    // 分页
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
    if (view) {
      if (view !== 5) {
        queryParam.view = {
          $gte: 10 * (view - 1),
          $lt: 10 * view
        }
      } else {
        queryParam.view = {
          $gte: 10 * (view - 1)
        }
      }
    }
    let res = await Record.find(queryParam, null, options)
    let total = await Record.countDocuments(queryParam, null, options)
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
      // let res = await Record.findOne({ _id }, { detail: true, title: true, type: true, _id: false, img: true })
      let res = await Record.findOneAndUpdate({ _id }, { $inc: { 'view': 1 } }, { returnNewDocument: true })
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
    let files = ctx.request.files
    let img = []

    files.forEach((elem, index) => {
      img.push({
        name: elem.originalname,
        // url: 'https://mbs-itc.oss-cn-beijing.aliyuncs.com/images/' + elem.originalname // 1.使用图片上传阿里云,前提是你开通了阿里云对象存储，也创建了bucket（适合开通服务器，并且开通阿里云对象存储的人群）
        // url: 'http://123.56.119.218/server/public/images/' + elem.originalname // 2.图片上传nginx服务器（用nginx服务器存放静态资源，适合开通服务器，没有开通阿里云对象存储的人群）
        url: 'http://localhost:3000/images/' + elem.originalname // 3.本地开发，图片上传到本地server/public目录中的images文件夹（适合本地启动，即没有开通任何阿里云服务产品）
      })
    })

    // 上面三种情况，仅第1种上传阿里云时，需要执行下面的img.froeach循环，其他两种情况下注释即可
    // img.forEach(async (elem, index) => {
    //   await client.put('images/' + elem.name, path.join(__dirname, '../public/images/') + elem.name)
    // })

    try {
      let res = await Record.findOneAndUpdate({ _id: id }, {
        $set: {
          detail,
          type,
          title
        },
        $addToSet: { img }
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
  },
  async deleteImg (ctx, img) {
    let { name, id } = ctx.request.body
    try {
      let res = await Record.update({ _id: id }, {
        $pull: { img: { name } }
      })
      if (res !== null) {
        ctx.body = {
          code: 200,
          msg: '删除图片成功'
        }
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '删除图片失败，服务器异常'
      }
    }
  }
}
