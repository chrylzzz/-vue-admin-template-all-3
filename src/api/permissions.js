import request from '@/utils/request'


// -------------------------------------------pro
export function getPerMenu() {
  return request({
    url: '/getPerMenu',
    method: 'get',
  })
}
//添加2级
export function addSecMenu(id,data) {
  return request({
    url: `/addSecMenu/${id}`,
    method: 'post',
    data
  })
}
//添加一级

