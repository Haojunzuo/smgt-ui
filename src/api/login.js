import request from '@/utils/request'

// 登录方法
export function login(userName, password, code, role) {
  return request({
    url: '/user/login',
    method: 'post',
    data: { userName, password, code, role}
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/user/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/user/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/user/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/user/getImage',
    method: 'get'
  })
}
// 获取路由
export const getRouters = (role) => {
  return request({
    url: '/user/getRouters/'+ role,
    method: 'get'
  })
}
