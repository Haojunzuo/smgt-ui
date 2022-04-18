import request from '@/utils/request'

export function listCollege(data) {
  return request({
    url:'/college/list',
    method:'get',
    params:data
  })
}

export function listClass(data) {
  return request({
    url:'/class/list',
    method:'get',
    params:data,
  })
}

export function listClassTask(data) {
  return request({
    url:'/classTask/list',
    method:'get',
    params:data,
  })
}

export function listTeacher(data) {
  return request({
    url:'/teacher/list',
    method:'get',
    params:data,
  })
}

export function checkCourseExist(data) {
  return request({
    url: '/classTask/checkCourseExist',
    method: 'put',
    params: data,
  })
}

export function addClassTask(data) {
  return request({
    url:'/classTask',
    method: 'post',
    params:data
  })
}

export function updateClassTask(data) {
  return request({
    url:'/classTask',
    method:'put',
    data:data,
  })
}

export function getClassTask(id) {
  return request({
    url:'/classTask/'+id,
    method: 'get',
  })
}

export function getCoursePlan(data) {
  return request({
    url:'/classTask/listCoursePlan',
    method:'get',
    params:data,
  })
}

export function delClassTask(id) {
  return request({
    url:'/classTask/'+id,
    method:'delete',
  })
}

export function schedule(semester) {
  return request({
    url:'/classTask/schedule/'+semester,
    method:'post',
  })
}
