import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import { Button, Form, FormItem, Input, Icon, Avatar, link, Message, Container, Aside, Main, DatePicker, Select, Option, Table, TableColumn, PageHeader, MessageBox, Tag, Pagination, Loading, Upload, Dialog, Tooltip, Notification, Rate } from 'element-ui'

import 'normalize.css/normalize.css'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Avatar)
Vue.use(link)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(PageHeader)
Vue.use(Tag)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Rate)
Vue.use(Pagination)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$moment = moment
Vue.prototype.$notify = Notification

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
