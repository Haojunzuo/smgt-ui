import request from '@/utils/request'

// 查询请假 列表
export function listViolation(query) {
  return request({
    url: '/violation/list',
    method: 'get',
    params: query
  })
}

// 查询请假 详细
export function getViolation(id) {
  return request({
    url: '/violation/' + id,
    method: 'get'
  })
}

// 新增请假
export function addViolation(data) {
  return request({
    url: '/violation',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateViolation(data) {
  return request({
    url: '/violation',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delViolation(id) {
  return request({
    url: '/violation/' + id,
    method: 'delete',
  })
}

//导入仓库数据
export function importExcelMethod(data) {
  return request({
    url: '/violation/importData',
    method: 'post',
    data: data
  })
}

