import request from '@/utils/request'

// 添加预约信息
export function addAppoint(data) {
    return request({
        url: '/visit/appointment',
        method: 'post',
        data
    })
}

// 获取预约记录
export function getAllAppointRecord(cardId, accountId, pageNum, pageSize){
    return request({
        url: '/visit/appointment/all?cardId=' + cardId + '&accountId='
        + accountId + '&pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'get'
    })
}

// 取消预约
export function cancelAppoint(id) {
    return request({
      url: '/visit/appointment/cancel/' + id,
      method: 'put'
    })
}