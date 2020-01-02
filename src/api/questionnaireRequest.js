import request from '@/utils/request'
import {getToken} from '@/utils/auth'

export default {
  addQuestionnaire(data) {
    return request({
      url: '/questionnaire/add',
      method: 'post',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      data
    })
  },
  getQuestionnaireByPage(from, limit ,name) {
    return request({
      url: '/questionnaire/getQuestionnaireByPage',
      method: 'get',
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
  getQuestionnaireById(id) {
    return request({
      url: '/questionnaire/getQuestionnaireById',
      method: 'get',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "id": id
      }
    })
  },
  pushOnline(id) {
    return request({
      url: '/questionnaire/pushOnline',
      method: 'put',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "id": id
      }
    })
  },
  backOnline(id) {
    return request({
      url: '/questionnaire/backOnline',
      method: 'put',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "id": id
      }
    })
  },
  delete(id) {
    return request({
      url: '/questionnaire/delete',
      method: 'put',
      headers: {
        "Authrication": "Bearer " + getToken()
      },
      params: {
        "id": id
      }
    })
  },

}
