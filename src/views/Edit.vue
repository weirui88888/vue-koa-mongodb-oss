<!--
 * @Description:
 * @Autor: rui.wei
 * @Date: 2019-11-18 11:20:56
 * @Email: weirui@zhiketong.cn
 -->
<template>
  <div class="edit-wrap">
    <div class="edit-header">
      <el-page-header @back="goBack" :content="title"></el-page-header>
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
                <!-- <el-upload
                action="#"
                :limit="5"
                ref="upload"
                :multiple="true"
                :auto-upload="false"
                :file-list="fileList"
                list-type="picture-card">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">上传图片大小不超过500kb</div>
            </el-upload> -->
                <el-upload
                action="/api/upload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :file-list="fileList"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')" v-if="title==='新建'" size="mini">立即创建</el-button>
              <el-button type="primary" @click="onEdit('form')" v-if="title==='编辑'" size="mini" :disabled="disabledOption">更新数据</el-button>
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
          let _self = this
          this.form.id = this.id
          let res = await HttpRecord.updateRecordById(this.form)
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
          console.log('error submit!!')
          return false
        }
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let _self = this
          let res = await HttpRecord.addRecord(this.form)
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
          console.log('error submit!!')
          return false
        }
      })
    },
    async getDetail (id) {
      let res = await HttpRecord.getRecordById(id)
      this.form = Object.assign({}, res.data)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
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
