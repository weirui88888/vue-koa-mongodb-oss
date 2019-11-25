/*
 * @Description:
 * @Autor: rui.wei
 * @Date: 2019-11-24 18:08:24
 * @Email: weirui@zhiketong.cn
 */
const multer = require('@koa/multer')
const path = require('path')

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'))
  },
  filename (ctx, file, cb) {
    var fileFormat = (file.originalname).split('.')
    cb(null, fileFormat[0] + '.' + fileFormat[fileFormat.length - 1])
  }
})

const upload = multer({ storage })

module.exports = upload
