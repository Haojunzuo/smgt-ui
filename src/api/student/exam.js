import request from '@/utils/request'

// 查询请假 列表
export function listExam(query) {
  return request({
    url: '/exam/list',
    method: 'get',
    params: query
  })
}

// 查询请假 详细
export function getExam(id) {
  return request({
    url: '/exam/' + id,
    method: 'get'
  })
}

// 新增请假
export function addExam(data) {
  return request({
    url: '/exam',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateExam(data) {
  return request({
    url: '/exam',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delExam(id) {
  return request({
    url: '/exam/' + id,
    method: 'delete',
  })
}


