import axios from 'axios'
import global from '../../api/global'
import router from '../../router/router'
function getAccessToken() {
    // 从localStorage中获取token
    //let accessToken = localStorage.getItem('accessToken')
    //const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJvcGVuSWQiOiJvVjc2QndpYVVYcGcxYUo2S1RDb3hQbWppRHg0IiwiaXNzIjoib3JhbmdlMiIsImRldmljZUlkIjoiZ2hfOGY0ODdhNjEyZmM5XzkzNzdjYjk4YWU0MDU3NzgiLCJpYXQiOjE1ODg3MjkxNDd9.r1nCZCvEIF3uZ5HGq83EahuqS-9KHoBz7-7DW-lnk0Q"
    const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJvcGVuSWQiOiJvVjc2QndpYVVYcGcxYUo2S1RDb3hQbWppRHg0IiwiaXNzIjoib3JhbmdlMiIsImRldmljZUlkIjoiZ2hfOGY0ODdhNjEyZmM5XzkzNzdjYjk4YWU0MDU3NzgiLCJpYXQiOjE1OTE0NDU0NzN9.VqTFyvVKbpaghcCv3C_YK6Or0un4TMBwoQvahNZ996c"
    console.log('====refreshToken=====',refreshToken);
    if (accessToken != null&& refreshToken !== undefined) {
        return "Bearer " + accessToken
    }
}

function getBasicToken() {
    // 从localStorage中获取token
    return "Basic "+global.BASIC_TOKEN
}

//获取rt
function getRefreshToken() {
    // 从localStorage中获取token
    const refreshToken = localStorage.getItem('refreshToken')
    //const refreshToken = "eyJhbGciOiJIUzI1NiJ9.eyJvcGVuSWQiOiJvVjc2QndpYVVYcGcxYUo2S1RDb3hQbWppRHg0IiwiaXNzIjoib3JhbmdlMiIsImlhdCI6MTU3NDgxNzMxOX0.E2kRLw4es2c_I6-tqhTxvNWyY1Vl-4-e_n6Umbp5syg"
    console.log('从localStorage中获取的refreshToken为：'+refreshToken)
    if(refreshToken !=null && refreshToken !=undefined){
        return refreshToken
    }
}

// 创建一个axios实例
const axiosJWT = axios.create({
    baseURL: global.API,
    timeout: 300000,
    headers: {
        'Authorization': getAccessToken(),
        "Access-Control-Allow-Origin": "*",
        // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        // 'Access-Control-Allow-Credentials': 'true'
    }
})

// 创建一个axios实例
const axiosBASIC = axios.create({
    baseURL: global.API,
    timeout: 300000,
    headers: {
        'Authorization': getBasicToken()
    }
})

async function refreshToken() {
    // instance是当前request.js中已创建的axios实例
    // return await axiosBASIC.get('/auth/reissueToken', {
    //   params: {
    //     refreshToken: getRefreshToken()
    //   }
    // })
    return await axiosBASIC.get('/auth/issueToken', {
    params: {
      openId: "oV76BwiaUXpg1aJ6KTCoxPmjiDx4"
    }
  })
}

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
axiosJWT.setToken = (accessToken) => {
    localStorage.setItem('accessToken', accessToken)
    axiosJWT.defaults.headers['Authorization'] = "Bearer "+accessToken
}

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
 
// 响应拦截
axiosJWT.interceptors.response.use(response => {
        const {code} = response.data
        // 接下来会在这里进行token过期重发逻辑处理
        switch(code){
            case 604:
                //非法token！
                break
            case 603:
                //缺少token！
            case 605:
                //accessToken已过期！
                //获取当前失败的请求
                const config = response.config
                if (!isRefreshing) {
                    isRefreshing = true
                   return refreshToken()
                        .then(res => {
                            const {code} = res.data
                            switch(code){
                                case 200:
                                    //refreshToken有效，刷新Token成功
                                    //将最新的token更新到header中，同时保存在localStorage中
                                    const {accessToken} = res.data.data
                                    console.log('access_token====='+accessToken)
                                    axiosJWT.setToken(accessToken)
                                    // 刷新下之前的请求配置
                                    config.headers['Authorization'] = "Bearer "+accessToken
                                    config.baseURL = ''
                                    //已经刷新了token，将所有队列中的请求进行重试
                                    requests.forEach(cb => cb(accessToken))
                                    //清空队列
                                    requests = []
                                    // 重试之前的请求并返回promise
                                    return axiosJWT(config)
                                case 500:
                                case 606:
                                    //refreshToken过期
                                   router.push("/auth")
                            }
                        })
                        .finally(() => {
                            //刷新成功，恢复标志位
                            isRefreshing = false
                        })
                } else {
                    // 正在刷新token，返回一个未执行resolve的promise
                    return new Promise((resolve) => {
                        // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                        requests.push((accessToken) => {
                            config.baseURL = ''
                            config.headers['Authorization'] = "Bearer "+accessToken
                            resolve(axiosJWT(config))
                        })
                    })
                }
            case 701:
                //JWT认证失败!
                break
            default: 
            return response.data
        }
    },error => {
        return Promise.reject(error)
    })

export  {
    axiosJWT,
    axiosBASIC
}