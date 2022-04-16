import request from '@/utils/request'

// 查询进校申请 列表
export function listToRequest(query) {
  return request({
    url: '/toRequest/list',
    method: 'get',
    params: query
  })
}

// 查询进校申请 详细
export function getToRequest(id) {
  return request({
    url: '/toRequest/' + id,
    method: 'get'
  })
}

// 新增进校申请
export function addToRequest(data) {
  return request({
    url: '/toRequest',
    method: 'post',
    data: data
  })
}

// 修改进校申请
export function updateToRequest(data) {
  return request({
    url: '/toRequest',
    method: 'put',
    data: data
  })
}

export function updateToRequestStatus(id, status) {
  return request({
    url: '/toRequest/'+id+'/'+status,
    method: 'put',
  })
}

// 删除进校申请
export function delToRequest(id) {
  return request({
    url: '/toRequest/' + id,
    method: 'delete',
  })
}


