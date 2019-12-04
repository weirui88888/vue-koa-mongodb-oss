import instance from '../request/axios'

// 添加记录
const addRecord = (data) => {
  return instance.request(
    {
      url: '/api/record/add',
      data: data,
      method: 'post'
    }
  )
}

// 查看记录
const getRecord = (data) => {
  return instance.post('/api/record/getRecord', data)
}

// 删除记录
const deleteRecord = (id) => {
  return instance.delete(`/api/record/deleteRecord/${id}`)
}

// 根据id查询
const getRecordById = (id) => {
  return instance.get(`/api/record/getRecordById/${id}`)
}

// 更新数据
const updateRecordById = (data) => {
  return instance.post(`/api/record/updateRecordById`, data)
}

// 删除图片
const deleteImg = (data) => {
  return instance.post(`/api/record/deleteImg`, data)
}

export default {
  addRecord,
  getRecord,
  deleteRecord,
  getRecordById,
  updateRecordById,
  deleteImg
}
