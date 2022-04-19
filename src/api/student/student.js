import request from '@/utils/request'

// 查询请假 列表
export function listStudent(query) {
  return request({
    url: '/student/list',
    method: 'get',
    params: query
  })
}

// 查询请假 详细
export function getStudent(id) {
  return request({
    url: '/student/' + id,
    method: 'get'
  })
}

// 新增请假
export function addStudent(data) {
  return request({
    url: '/student',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateStudent(data) {
  return request({
    url: '/student',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delStudent(id) {
  return request({
    url: '/student/' + id,
    method: 'delete',
  })
}

