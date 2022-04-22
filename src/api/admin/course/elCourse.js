import request from '@/utils/request'

// 查询请假 列表
export function listElCourse(query) {
  return request({
    url: '/elCourse/list',
    method: 'get',
    params: query
  })
}


