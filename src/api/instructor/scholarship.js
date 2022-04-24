import request from '@/utils/request'

export function listScholarship(data) {
  return request({
    url:'/scholarship/list',
    method:'get',
    params:data,
  })
}

export function updateScholarship(data) {
  return request({
    url:'/scholarship',
    method:'put',
    data:data,
  })
}

export function getScholarship(id) {
  return request({
    url:'/scholarship/'+id,
    method:'get',
  })
}

export function delScholarship(id) {
  return request({
    url:'/scholarship/'+id,
    method:'delete',
  })
}

export function addScholarship(data) {
  return request({
    url:'/scholarship',
    method:'post',
    data:data,
  })
}

export function checkScholarshipExit(data) {
  return request({
    url:'/scholarship/checkScholarshipExit',
    method:'put',
    params:data,
  })
}

