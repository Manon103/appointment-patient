import request from '@/utils/request'
/**
 * 留言接口
 * **/
export function comment(data) {
  return request({
    url: '/comment/add',
    method: 'post',
    data
  })
}

export function getCommentbyAppointId(id) {
  return request({
    url: '/comment/detail/' + id,
    method: 'get'
  })
}