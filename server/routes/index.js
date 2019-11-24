/*
 * @Description:
 * @Autor: rui.wei
 * @Date: 2019-11-15 10:29:11
 * @Email: weirui@zhiketong.cn
 */
const router = require('koa-router')()
const controller = require('../controller')
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello world!'
})

router.get('/api/code/checkcode', controller.code.getCode)// 验证码获取
router.post('/api/user/register', controller.user.register)// 注册
router.post('/api/user/login', controller.user.login)// 登陆
router.post('/api/record/add', controller.record.addRecord)// 添加记录
router.post('/api/record/getRecord', controller.record.getRecord)// 添加记录
router.delete('/api/record/deleteRecord/:id', controller.record.deleteRecord)// 添加记录
router.get('/api/record/getRecordById/:id', controller.record.getRecordById)// 获取记录根据id
router.post('/api/record/updateRecordById', controller.record.updateRecordById)// 添加记录

module.exports = router
