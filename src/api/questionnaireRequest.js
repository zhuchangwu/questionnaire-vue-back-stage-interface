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

  getQuestionnaireByPage(from,limit){
    return request({
      url:'/questionnaire/getQuestionnaireByPage',
      method:'get',
      headers:{
        "Authrication": "Bearer " + getToken()
      },
      params:{
        "from":from,
        "limit":limit
      }
    })
  },
  getQuestionnaireById(id){
    return request({
      url:'/questionnaire/getQuestionnaireById',
      method:'get',
      headers:{
        "Authrication": "Bearer " + getToken()
      },
      params:{
        "id":id
      }
    })
  }




}
