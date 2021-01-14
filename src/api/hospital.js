import request from '@/utils/request'
/**
 * 关于医院的接口
 * 1、获取所有医院信息
 * **/
// 1、获取所有医院信息、pageNum代表第几页，pageSize代表一页有多少，name代表医院名称
export function getHospitalInfo(pageNum, pageSize, name) {
  return request({
    url: '/hospital/info/list',
    method: 'get',
    params: {pageNum, pageSize, name}
  })
}