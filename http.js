import axios from 'axios'
import {
  Toast
} from 'vant'
import {
  loginOut
} from '../store/store'

/**
 * success Toast
 * @param {String} msg
 * @param {Number} time
 */
const SuccessMessage = (msg, time = 3) => { // defualt time is 3s
  Toast({
    message: msg,
    className: 'tac', // css tac is text-align: center;
    type: 'success',
    duration: ~~time * 1000
  })
}
/**
 * error Toast
 * @param {String} msg
 * @param {Number} time
 */
const ErrorMessage = (msg, time = 3) => {
  Toast({
    message: msg,
    className: 'tac',
    type: 'fail',
    duration: ~~time * 1000
  })
}

// create an axios instance name is service
const service = axios.create({
  baseURL: '/open/api/weixin/',
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10 * 1000 // request timeout set  is 10s
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    switch (res.code) {
      case 200:
        if (res.msg) {
          SuccessMessage(res.msg)
        }
        break
      case 400:
        ErrorMessage('错误请求')
        break
      case 401:
        if (res.msg) {
          ErrorMessage(res.msg) // why not auth
        }
        // clean login status (localStorage)
        loginOut()
        setTimeout(() => {
          // 根据后端返回url 跳转 重新获取code
          window.location.href = response.data.data.url
        }, 2000)
        break
      case 403:
        ErrorMessage('拒绝访问')
        break
      case 404:
        ErrorMessage('请求错误')
        break
      case 405:
        ErrorMessage('请求方法未允许')
        break
      case 408:
        ErrorMessage('请求超时')
        break
      case 500:
        if (res.msg !== '') {
          ErrorMessage(res.msg)
        } else {
          ErrorMessage('请求出错')
        }
        break
      case 501:
        ErrorMessage('网络未实现')
        break
      case 502:
        ErrorMessage('网络错误')
        break
      case 503:
        ErrorMessage('服务不可用')
        break
      case 504:
        ErrorMessage('网络超时')
        break
      case 505:
        ErrorMessage('http版本不支持该请求')
        break
    }
    return res
  },
  error => {
    console.log('err' + error) // for debugreject
    switch (error.response.status) {
      case 400:
        ErrorMessage('服务不可达')
        break
      case 404:
        ErrorMessage('请求错误,服务器无资源')
        break
      case 500:
        ErrorMessage('服务器错误')
        break
      case 501:
        ErrorMessage('网络未实现')
        break
      case 502:
        ErrorMessage('网络错误')
        break
      case 503:
        ErrorMessage('服务不可用')
        break
      case 504:
        ErrorMessage('网络超时')
        break
      case 505:
        ErrorMessage('http版本不支持该请求')
        break
    }
    return Promise.reject(error)
  }
)

/**
 * get请求
 * @param {String} url
 * @param {Object} params
 * only return data ignore msg and code
 */
function get(url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

/**
 * post methods
 *  * @param {String} url
 * @param {Object} params
 * only return data ignore msg and code
 */
function post(url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

/**
 *  return all
 * @param url
 * @param params
 * @returns {Promise<any>}
 */
function postReturnAll(url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * g is get
 * p is post
 * a is post_and_return_all (data with code and msg)
 * @param {String} url
 * @param {String} methods
 */
export function createAPi(url, methods = 'p') {
  switch (methods) {
    case 'g':
      return p => get(url, p)
    case 'p':
      return p => post(url, p)
    case 'a':
      return p => postReturnAll(url, p)
  }
}