const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect(`mongodb://localhost:27017/${process.env.DATA_BASE_NAME}`)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connect error:'))
db.once('open', function () {
  console.log('connect database successful!')
})

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
  img: Array,
  view: 0,
  creater: String,
  avatar: String,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})

exports.CheckCode = mongoose.model('Checkcode', checkcodeSchema, 'Checkcode')
exports.User = mongoose.model('User', userSchema, 'User')
exports.Record = mongoose.model('Record', recordSchema, 'Record')
