import request from '@/utils/request'

export function listNotice(data) {
  return request({
    url:'/notice/list',
    method:'get',
    params:data,
  })
}

export function addNotice(data) {
  return request({
    url:'/notice',
    method:'post',
    data:data,
  })
}

export function delNotice(id) {
  return request({
    url:'/notice/'+id,
    method:'delete',
  })
}

export function updateNotice(data) {
  return request({
    url:'/notice',
    method:'put',
    data:data,
  })
}
export function getNotice(id) {
  return request({
    url:'/notice/'+id,
    method:'get',
  })
}
