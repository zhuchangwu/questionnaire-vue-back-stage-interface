import request from '@/utils/request'
import {getToken} from '@/utils/auth'


export function addQuestionnaire(data) {
  return request({
    url: '/questionnaire/add',
    method: 'post',
    headers:{
      "Authrication":"Bearer "+getToken()
    },
    data
  })
}
