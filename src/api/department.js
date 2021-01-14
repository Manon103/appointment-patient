import request from '@/utils/request'
/**
 * 此页面用于医院的专科的所有API接口
 * 1、分页获取专科列表信息
 * **/
 // 1 通过医院ID获取专科 ID为医院的ID,后面的页码和一页多少条数据
 export function getDepartmentHospital(ID, pageNum, pageSize) {
  return request({
    url: '/hospital/special/list/' + ID + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'get'
  })
}
// 2 获取全部的专科列表,name为专科名称
export function getAllDepartmentList(pageNum, pageSize, name) {
  return request({
    url: '/hospital/special/list?pageNum=' + pageNum + '&pageSize=' + pageSize + '&name=' + name,
    method: 'get'
  })
}
