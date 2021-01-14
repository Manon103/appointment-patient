import request from '@/utils/request.js';
/**
 * 用于所有的门诊的Api接口
 * 1 获取某个医院某个专科的门诊信息
 * 2 分页获取专科编号下的门诊列表信息
 * **/
 // 1 获取某个医院某个专科的门诊信息
 export function getOutpatientByHospital(hospitalId, specialId, pageNum, pageSize) {
	 return request({
		 url: '/hospital/outpatient/list?hospitalId=' + hospitalId + '&specialId='
		 + specialId + '&pageNum=' + pageNum + '&pageSize=' + pageSize,
		 method: 'get'
	 })
 }
 // 2 分页获取专科编号下的门诊列表信息
export function getOutpatientListById(pageNum, pageSize, specialId) {
  return request({
    url: '/hospital/special/list/outpatient?pageNum=' + pageNum + '&pageSize='
	+ pageSize + '&specialId=' + specialId,
    method: 'get'
  })
}