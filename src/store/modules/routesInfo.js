import { getRoutesInfo } from '@/api/routes'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],

  routesInfo:[]
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },

  SET_ROUTESINFO: (state, roles) => {
    state.routesInfo = routesInfo
  }
}

const actions = {
    //?????????
    getasyncRoutesInfo(){
        return new Promise((resolve, reject) => {
            getRoutesInfo().then(response => {
                debugger
                const { data } = response
                const { routesInfo } = data
                commit('SET_ROUTESINFO', routesInfo)
                resolve(data)
            }).catch(error => {
                reject(error)
              })
        })
    },


  // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           reject('Verification failed, please Login again.')
//         }

//         const { roles, name, avatar, introduction } = data

//         // roles must be a non-empty array
//         if (!roles || roles.length <= 0) {
//           reject('getInfo: roles must be a non-null array!')
//         }

//         commit('SET_ROLES', roles)
//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         commit('SET_INTRODUCTION', introduction)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },



}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
