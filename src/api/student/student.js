import request from '@/utils/request'

// 查询学生信息 列表
export function listStudent(query) {
  return request({
    url: '/student/list',
    method: 'get',
    params: query
  })
}

// 查询学生信息 详细
export function getStudent(id) {
  return request({
    url: '/student/' + id,
    method: 'get'
  })
}

// 新增学生信息
export function addStudent(data) {
  return request({
    url: '/student',
    method: 'post',
    data: data
  })
}

// 修改学生信息
export function updateStudent(data) {
  return request({
    url: '/student',
    method: 'put',
    data: data
  })
}

// 删除学生信息
export function delStudent(id) {
  return request({
    url: '/student/' + id,
    method: 'delete',
  })
}

export function importStudent() {

}


