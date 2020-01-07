import request from '@/utils/request'


// -------------------------------------------pro
export function getPerMenu() {
    return request({
      url: '/getPerMenu',
      method: 'get',
    })
  }