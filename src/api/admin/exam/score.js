import request from '@/utils/request'

export function listScore(data) {
  return request({
    url:'/score/list',
    method:'get',
    params:data,
  })
}

export function updateScore(data) {
  return request({
    url:'/score',
    method:'put',
    data:data,
  })
}

export function isEntryStart(semester) {
  return request({
    url:'/scoreEntry/'+semester,
    method:'get',
  })
}

export function updateEntryStart(semester) {
  return request({
    url:'/scoreEntry',
    method:'put',
    data:semester,
  })
}

export function insertScoreTable(semester) {
  return request({
    url:'/scoreEntry/insertScoreTable',
    method:'put',
    data:semester,
  })
}
