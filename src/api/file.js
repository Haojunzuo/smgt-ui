import request from '@/utils/request'


// 删除
export function delFile(fileNames) {
  return request({
    url: '/file/' + fileNames,
    method: 'delete'
  })
}
export function downloadFile(fileNames) {
  return request({
    url: '/file/download/' + fileNames,
    responseType: 'blob'
  })
}
export function getName(data) {
  return request({
    url: '/file/getTag',
    method: 'post',
    data: data
  })
}
