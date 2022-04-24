import request from '@/utils/request'

export function weight(data) {
  console.log(data)
  return request({
    url:'/compute/weight',
    method:'put',
    data:data,
  })
}

// export function re(semester) {
//   return request({
//     url:'/compute/weight',
//     methods:'put',
//     data:semester,
//   })
// }

export function total(semester) {
  return request({
    url:'/compute/total',
    method:'put',
    data:semester,
  })
}

export function listWeight(data) {
  return request({
    url:'/compute/list',
    method:'get',
    params:data,
  })
}

