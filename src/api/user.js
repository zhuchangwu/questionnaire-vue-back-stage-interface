import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    headers: {
      "Authrication": "Bearer " + token
    },
    url: '/user/info',
    method: 'get'
  })
}

// todo 登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

import {getToken} from '@/utils/auth'

export default {
  getUserByPage(from, limit, name) {
    return request({
      url: '/user/getUserByPage',
      method: 'post',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "from": from,
        "limit": limit,
        "name": name
      }
    })
  },
  forbidUser(id) {
    return request({
      url: '/user/forbidUser',
      method: 'post',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "id": id
      }
    })
  },
  activeUser(id) {
    return request({
      url: '/user/activeUser',
      method: 'post',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "id": id
      }
    })
  },
  edit(id) {
    return request({
      url: '/user/edit',
      method: 'get',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "id": id
      }
    })
  },
  doEdit(data) {
    return request({
      url: '/user/doEdit',
      method: 'post',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      data
    })
  }
}
