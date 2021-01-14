import request from '@/utils/request'
/**
 * 用于登录注册时写的api接口的页面
 * 1、登录获取token
 * 2、获取用户的信息
 * 3、修改账号密码
 * **/
// 1、注冊
export function register(data) {
  return request({
    url: '/user/basic/account/register',
    method: 'post',
    data
  })
}
