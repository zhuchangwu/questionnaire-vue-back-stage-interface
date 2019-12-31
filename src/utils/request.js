import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

// todo create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:8089/', // url = base url + request urlhttp://localhost:8089/
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // todo do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 响应的拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * 下面是一个例子, 表示我们可以根据自定义的请求的状态码做出不同的状态
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    var res = response.data
    // if the custom code is not 200, it is judged as an error.
    // 适配我在后端传递过来的json串

    if (res.code === undefined) {
      res = JSON.parse(res);
    }

    if (res.code !== 200) {
      // 50008: 表示非法的用户名或者密码错误
      if (res.code === 50008) {
        Message.warning({
          message: res.token,
          showClose: true,
          type: 'warning',
          duration: 5 * 1000
        })
        // 50012:  没有相关的权限
        // 50014   身份凭证已过期 , /permission.js中进行处理 , 它设计的思路是 比如用户刷新了一下页面,
      }else if (res.code === 50012) {
        MessageBox.alert(res.token, 'Confirm logout', {
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject()
    } else {
      // 如果状态码为200, 表示请求正常, 将response传递到 异步函数的then位置,继续使用
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
