<template>
  <div class="edit-wrap">
    <div class="edit-header">
      <el-page-header @back="goBack">
          <template slot="content">
            {{title}}
            <el-tooltip class="item" effect="dark" content="当前用户仅有查看权限" placement="top" v-if="disabledOption">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
          </template>
      </el-page-header>
    </div>
    <div class="edit-body">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入一个新颖的标题" maxlength="10" show-word-limit :disabled="disabledOption"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择所属类型" :disabled="disabledOption">
                <el-option label="工作" value="work"></el-option>
                <el-option label="生活" value="life"></el-option>
                <el-option label="学习" value="study"></el-option>
                <el-option label="情感" value="love"></el-option>
                <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="detail">
              <el-input type="textarea" v-model="form.detail" :rows="6" placeholder="请描述下具体内容" maxlength="300" show-word-limit :disabled="disabledOption"></el-input>
            </el-form-item>
            <el-form-item label="上传">
                <el-upload
                :disabled="disabledOption"
                action="#"
                :limit="5"
                ref="upload"
                :on-change="handleChange"
                :on-exceed="Exceed"
                :multiple="true"
                :auto-upload="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                accept=".jpg,.jpeg,.png"
                :file-list="fileList"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">上传图片大小不超过1M/仅支持png,jpg,jpeg格式/最多上传5张图片</div>
            </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')" v-if="title==='新建'" size="mini" :loading="loadingAction">立即创建</el-button>
              <el-button type="primary" @click="onEdit('form')" v-if="title==='编辑'" size="mini" :disabled="disabledOption" :loading="loadingAction">更新数据</el-button>
              <el-button @click="goBack" size="mini">取消</el-button>
            </el-form-item>
          </el-form>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
    </div>
  </div>
</template>

<script>
import HttpRecord from '../api/record'
export default {
  name: 'edit',
  data () {
    return {
      id: this.$route.query.id,
      form: {
        title: '',
        type: '',
        detail: ''
      },
      loadingAction: false,
      rules: {
        title: [
          { required: true, message: '请输入一个新颖的标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择所属类型', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请描述下具体内容', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: []
    }
  },
  methods: {
    goBack () {
      this.$router.push({
        path: '/'
      })
    },
    onEdit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 防止误操多点
          if (this.loadingAction) {
            return false
          }
          this.loadingAction = true
          let _self = this
          const fileArray = this.$refs.upload.uploadFiles
          const formData = new FormData()
          const fileneed = fileArray.filter((elem, index) => {
            return elem.status === 'ready'
          })
          for (let i = 0; i < fileneed.length; i++) {
            // 在这里数组每一项的.raw才是你需要的文件，有疑惑的可以打印到控制台看一下就清楚了
            formData.append('img', fileneed[i].raw)
          }
          formData.append('title', this.form.title)
          formData.append('type', this.form.type)
          formData.append('detail', this.form.detail)
          formData.append('id', this.id)
          let res = await HttpRecord.updateRecordById(formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          let { code, msg } = res
          if (code === 200) {
            this.$message({
              message: msg,
              type: 'success',
              onClose (instance) {
                _self.$router.go(-1)
              }
            })
          }
        } else {
          this.loadingAction = false
          console.log('error submit!!')
          return false
        }
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 防止误操多点
          if (this.loadingAction) {
            return false
          }
          this.loadingAction = true
          let _self = this
          const fileArray = this.$refs.upload.uploadFiles
          const formData = new FormData()
          // 遍历文件数组，将所有文件存入fd中
          for (let i = 0; i < fileArray.length; i++) {
            // 在这里数组每一项的.raw才是你需要的文件，有疑惑的可以打印到控制台看一下就清楚了
            formData.append('img', fileArray[i].raw)
          }

          formData.append('title', this.form.title)
          formData.append('type', this.form.type)
          formData.append('detail', this.form.detail)
          let res = await HttpRecord.addRecord(formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          let { code, msg } = res
          if (code === 200) {
            this.$message({
              message: msg,
              type: 'success',
              onClose (instance) {
                _self.$router.go(-1)
              }
            })
          }
        } else {
          this.loadingAction = false
          console.log('error submit!!')
          return false
        }
      })
    },
    async getDetail (id) {
      let res = await HttpRecord.getRecordById(id)
      this.form = Object.assign({}, res.data)
      this.fileList = [...res.data.img]
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    Exceed (files, fileList) {
      this.$message.error('最多上传5张图片')
      return false
    },
    handleChange (file, fileList) {
      const imgTypeAllow = file.raw.type === 'image/png' || file.raw.type === 'image/jpg' || file.raw.type === 'image/jpeg'
      const imgSizeNotAllow = file.size / (1024 * 1024) > 1
      if (imgSizeNotAllow) {
        this.$message.error('上传图片大小不超过1M!')
      }
      if (!imgTypeAllow) {
        this.$message.error('上传只能是png,jpg,jpeg格式!')
      }
      if (imgSizeNotAllow || !imgTypeAllow) {
        fileList.splice(-1, 1)
      }
    },
    async handleRemove (file, fileList) {
      // 判断是否为已上传过的图片，如果是已经上传的，执行数据库删除，否则的话，不做处理
      if (file.status === 'success') {
        let args = {
          name: file.name,
          id: this.id
        }
        let res = await HttpRecord.deleteImg(args)
        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
      }
    }
  },
  computed: {
    title () {
      let type = this.$route.query.type
      return type === 'edit' ? '编辑' : '新建'
    },
    disabledOption () {
      if (this.title === '编辑') {
        return this.$store.state.user._id !== this.$route.query.user_id
      } else {
        return false
      }
    }
  },
  mounted () {
    let type = this.$route.query.type
    if (type === 'edit') {
      this.getDetail(this.id)
    }
  }
}
</script>

<style>
.edit-wrap {
  color: #000;
}
.edit-header,.edit-body {
  padding: 24px;
}
.edit-body .el-input,.el-textarea {
  width: 400px;
}
</style>
