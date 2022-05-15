import request from '@/utils/request'

export function listJob(data) {
  return request({
    url:"/job/list",
    method:"get",
    params:data,
  })
}

export function checkJobExit(data) {
  return request({
    url:"/job/check",
    method:"put",
    params:data,
  })
}

export function updateJob(data) {
  return request({
    url:"/job",
    method:"put",
    data:data,
  })
}

export function addJob(data) {
  return request({
    url:"/job",
    method:'post',
    data:data,
  })
}

export function getJob(id) {
  return request({
    url:"/job/"+id,
    method:'get'
  })
}

export function delJob(id) {
  return request({
    url:"/job/"+id,
    method:"delete",
  })
}
