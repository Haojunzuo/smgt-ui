import request from '@/utils/request'

// 查询进校申请 列表
export function listPartTime(query) {
  return request({
    url: '/partTime/list',
    method: 'get',
    params: query
  })
}

// 查询进校申请 详细
export function getPartTime(id) {
  return request({
    url: '/partTime/' + id,
    method: 'get'
  })
}

// 新增进校申请
export function addPartTime(data) {
  return request({
    url: '/partTime',
    method: 'post',
    data: data
  })
}

// 修改进校申请
export function updatePartTime(data) {
  return request({
    url: '/partTime',
    method: 'put',
    data: data
  })
}

export function updatePartTimeStatus(id, status) {
  return request({
    url: '/partTime/'+id+'/'+status,
    method: 'put',
  })
}

// 删除进校申请
export function delPartTime(id) {
  return request({
    url: '/partTime/' + id,
    method: 'delete',
  })
}


