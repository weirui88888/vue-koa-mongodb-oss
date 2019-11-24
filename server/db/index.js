/*
 * @Description:
 * @Autor: rui.wei
 * @Date: 2019-11-15 10:49:10
 * @Email: weirui@zhiketong.cn
 */
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://localhost:27017/itc', { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Connection success!')
  }
})
const Schema = mongoose.Schema

// 验证码
let checkcodeSchema = new Schema({
  token: String,
  code: String
})

// 用户
let userSchema = new Schema({
  user_name: String,
  user_id: String,
  user_pwd: String,
  avatar: {
    type: String,
    default: ''
  },
  token: {
    type: String,
    default: ''
  }
})

let recordSchema = new Schema({
  title: String,
  type: String,
  detail: String,
  create_time: {
    type: String,
    default: Date.now
  },
  creater: String,
  // TODO:这里很重要，需要什么记得加上
  avatar: String,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})

exports.CheckCode = mongoose.model('Checkcode', checkcodeSchema)
exports.User = mongoose.model('User', userSchema)
exports.Record = mongoose.model('Record', recordSchema)
