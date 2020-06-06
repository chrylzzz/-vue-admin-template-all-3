import request from '@/utils/request'

export function getRoutesInfo() {
  return request({
    url: '/getScore/getasyncRoutesInfo',
    method: 'get',
    
  })
}

