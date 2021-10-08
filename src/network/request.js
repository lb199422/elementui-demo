import axios from 'axios'

export function myRequest(config) {
  const instance = new axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })
  // 请求拦截
  instance.interceptors.request.use(config => {
    // header添加token 进行权限验证
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
  },error => {
  // Do something with request error
    console.log(error)
  });
  // 响应拦截
  instance.interceptors.response.use(res => {
    return res 
  }, err => {
    console.log('err', err)
  })
  return instance(config)
}


