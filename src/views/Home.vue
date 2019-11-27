<template>
  <div class="home-wrap">
    <el-container>
      <el-aside width="200px" class="home-aside">
          <el-avatar :size="80" :src="user.avatar" class="aside-avatar"></el-avatar>
          <div>{{dateNow}}{{user.user_name}}</div>
          <div class="open-mouse"><el-button @click="openMouse" type="success" plain size="mini">发帖</el-button></div>
          <div class="login-out"><el-button @click="loginOut" type="danger" plain size="mini">退出</el-button></div>
      </el-aside>
      <el-main>
        <div class="main-header clearfix">
            <el-form :model="queryForm" label-width="80px">
              <el-form-item label="类型">
                  <el-select v-model="queryForm.type" placeholder="请选择类型" size="small">
                    <el-option
                      v-for="item in types"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="创建人">
                <el-input v-model="queryForm.creater" placeholder="请输入创建人名字" size="small" clearable></el-input>
              </el-form-item>
            </el-form>
        </div>
        <div class="main-body">
            <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="头像"
              width="70">
              <template slot-scope="scope">
                <el-avatar :src="scope.row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="标题"
              width="200">
            </el-table-column>
            <el-table-column
              width="100"
              label="创建人">
              <template slot-scope="scope">
                <el-tag size="medium" v-if="isCurrentUser(scope.row)">{{scope.row.creater}}</el-tag>
                <span v-else>{{scope.row.creater}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              width="100">
              <template slot-scope="scope">
                {{formatType(scope.row.type)}}
              </template>
            </el-table-column>
            <el-table-column
              width="169"
              label="创建时间">
              <template slot-scope="scope">
                {{formatTime(scope.row.create_time)}}
              </template>
            </el-table-column>
            <el-table-column
              width="160"
              label="热门程度">
              <template slot-scope="scope">
                  <el-rate
                  v-model="scope.row.view"
                  disabled
                  >
                </el-rate>
              </template>
            </el-table-column>
            <el-table-column
            label="操作"
            width="190"
            >
              <template slot="header">
                操作
                <el-tooltip class="item" effect="dark" content="仅可操作当前用户的记录" placement="top">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-button  @click="onEdit(scope.row)" type="text" size="small">详情</el-button>
                <el-button  type="text" @click="onDelete(scope.row)" v-if="isCurrentUser(scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            background
            :page-size="pageSize"
            @current-change="pageChange"
            layout="prev, pager, next, total"
            :total="totalNum">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import HttpRecord from '../api/record'
export default {
  name: 'home',
  components: {
  },
  data () {
    return {
      loading: false,
      queryForm: {
        creater: '',
        type: '',
        view: ''
      },
      pageSize: 10,
      pageNum: 1,
      totalNum: 0,
      types: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'work',
          label: '工作'
        },
        {
          value: 'life',
          label: '生活'
        },
        {
          value: 'study',
          label: '学习'
        },
        {
          value: 'love',
          label: '情感'
        },
        {
          value: 'other',
          label: '其他'
        }
      ],
      tableData: []
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    dateNow () {
      let now = new Date()
      let hour = now.getHours()
      if (hour < 6) { return '凌晨好！' } else if (hour < 9) { return '早上好！' } else if (hour < 12) { return '上午好！' } else if (hour < 14) { return '中午好！' } else if (hour < 17) { return '下午好！' } else if (hour < 19) { return '傍晚好！' } else if (hour < 22) { return '晚上好！' } else { return '夜里好！' }
    }
  },
  watch: {
    'queryForm.type' () {
      this.getRecord()
    }
  },
  methods: {
    calculate (view) {
      console.log(view)
    },
    debounce (func, delay) {
      let timer
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
    isCurrentUser (row) {
      return row.creater === this.$store.state.user.user_name
    },
    pageChange (page) {
      this.pageNum = page
      this.getRecord()
    },
    openMouse () {
      this.$router.push({
        path: 'edit',
        query: {
          type: 'add'
        }
      })
    },
    loginOut () {
      this.$store.commit('remove')
      this.$router.push('/login')
    },
    async getRecord () {
      this.loading = true
      this.tableData = []
      let params = Object.assign({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }, this.queryForm)
      let res = await HttpRecord.getRecord(params)
      this.loading = false
      let tableData = res.data.list
      tableData.forEach((record, index) => {
        if (record.view < 10) {
          record.view = 1
        } else if (record.view < 20) {
          record.view = 2
        } else if (record.view < 30) {
          record.view = 3
        } else if (record.view < 40) {
          record.view = 4
        } else {
          record.view = 5
        }
      })
      this.tableData = tableData || []
      this.totalNum = res.data.total || 0
    },
    formatTime (timescape) {
      return this.$moment(timescape * 1).format('YYYY-MM-DD HH:mm:ss')
    },
    formatType (type) {
      let typeMap = {
        work: '工作',
        life: '生活',
        study: '学习',
        love: '情感',
        other: '其他'
      }
      return typeMap[type] || ''
    },
    onEdit (row) {
      this.$router.push({
        path: 'edit',
        query: {
          type: 'edit',
          id: row._id,
          user_id: row.user_id
        }
      })
    },
    onDelete (row) {
      let _self = this
      this.$confirm('删除后不可恢复，请三思', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await HttpRecord.deleteRecord(row._id)
        let { code, msg } = res
        if (code === 200) {
          this.$message({
            message: msg,
            type: 'success',
            onClose (instance) {
              _self.getRecord()
            }
          })
        }
      })
    }
  },
  mounted () {
    this.getRecord()
    this.$watch('queryForm.creater', this.debounce(this.getRecord, 500))
  }
}
</script>

<style>
.home-wrap {
  padding: 0 20px;
  color: #000;
}
.home-aside {
  text-align: center;
  overflow-y: hidden;
}
.aside-avatar{
  margin: 30px 0;
}
.open-mouse{
  padding: 20px 0;
}

.main-header .el-input {
  width: 200px;
}
.main-header .el-form-item {
  float: left;
  margin-right: 20px;
}
.main-body{
  padding: 0 130px 0 40px;
  margin-top: 30px;
}
.main-footer {
  padding:20px 30px;
}
</style>
