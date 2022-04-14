import request from '@/utils/request'

// 查询请假 列表
export function listLeave(query) {
  return request({
    url: '/leave/list',
    method: 'get',
    params: query
  })
}

// 查询请假 详细
export function getLeave(id) {
  return request({
    url: '/leave/' + id,
    method: 'get'
  })
}

// 新增请假
export function addLeave(data) {
  return request({
    url: '/leave',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateLeave(data) {
  return request({
    url: '/leave',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delLeave(id) {
  return request({
    url: '/leave/' + id,
    method: 'delete',
  })
}

//导入仓库数据
export function importExcelMethod(data) {
  return request({
    url: '/leave/importData',
    method: 'post',
    data: data
  })
}

