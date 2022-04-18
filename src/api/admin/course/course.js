import request from '@/utils/request'

export function listCourse(query){
  return request({
    url:'/course/list',
    method:'get',
    params:query
  })
}


export function checkno(data, courseno){
  console.log(data,courseno);
  return request({
    url:'/course/checkno/'+courseno,
    method:'put',
    data:data,
  })
}

export function updateCourse(data){
  return request({
    url:'/course',
    method:'put',
    data:data,
  })
}

export function addCourse(data){
  return request({
    url:'/course',
    method:'post',
    data:data,
  })
}

export function getCourse(id){
  return request({
    url:'/course/'+id,
    method:'get',
  })
}

export function delCourse(id) {
  return request({
    url:'/course/'+id,
    method:'delete'
  })
}



