import request from '@/utils/request'


// 修改用户个人信息
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}


// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  return request({
    url: '/user/resetPwd/'+oldPassword+'/'+newPassword,
    method: 'get'
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}