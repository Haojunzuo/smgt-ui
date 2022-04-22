import request from '@/utils/request'


// 查询请假 详细
export function getStudentElCourse(studentNo) {
  return request({
    url: '/studentElCourse/' + studentNo,
    method: 'get'
  })
}

// 新增请假
export function addStudentElCourse(data) {
  return request({
    url: '/studentElCourse',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateStudentElCourse(data) {
  return request({
    url: '/studentElCourse',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delStudentElCourse(data) {
  return request({
    url: '/studentElCourse/del',
    method: 'post',
    data: data
  })
}


