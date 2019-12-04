const router = require('koa-router')()
const upload = require('../utils/upload')
const controller = require('../controller')
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello world!'
})

router.get('/api/code/checkcode', controller.code.getCode)// 验证码获取
router.post('/api/user/register', controller.user.register)// 注册
router.post('/api/user/login', controller.user.login)// 登陆
router.post('/api/record/add', upload.array('img', 5), controller.record.addRecord)// 添加记录
router.post('/api/record/getRecord', controller.record.getRecord)// 添加记录
router.delete('/api/record/deleteRecord/:id', controller.record.deleteRecord)// 添加记录
router.get('/api/record/getRecordById/:id', controller.record.getRecordById)// 获取记录根据id
router.post('/api/record/updateRecordById', upload.array('img', 5), controller.record.updateRecordById)// 更新记录
router.post('/api/record/deleteImg', controller.record.deleteImg)// 删除图片

module.exports = router
