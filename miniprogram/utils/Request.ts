
// 配置文件
import { baseApi } from '../config'

//请求方法
enum Method {
    "GET" = "GET",
    "POST" = "POST"
}

// 网络请求数据格式
interface Data {
    [key: string]: any
}

// 网络请求发生错误的返回格式
interface RequestReject {
    url: string,
    method: string,
    msg: string | number,
}

// 基础的网络请求
class Request {
    private baseApi = ""
    public fullUrl = ""
    private token = ""
    constructor() {
        this.baseApi = baseApi // http://bill.cc/api/v1/
        this.token = wx.getStorageSync('token')
    }
    /**
     * 通用的网络请求
     * @param url 请求地址
     * @param method 请求方式
     * @param data 参数
     * @param checkToken 是否验证token，默认true
     * @return Promise 对象
     */
    private commonRequest(url: string, method: Method = Method.GET, data: Data = {}, checkToken = true): Promise<any> {
        return new Promise((resolve, reject) => {
            this.fullUrl = this.baseApi + url
            let err: RequestReject = {
                url: '',
                method: '',
                msg: ''
            }
            wx.request({
                url: this.fullUrl,
                method: method,
                data,
                header: {
                    token: checkToken ? this.hasToken : '',
                    "content-type": "application/json",
                },
                // 注意：正常请求404也会走success 
                success: (res) => {
                    const data = res.data
                    if (res.statusCode !== 404) {
                        // token无效或者过期
                        if (res.statusCode !== 401 && !checkToken) {
                            // 直接去登录
                            wx.navigateTo({
                                url: '/pages/login/login'
                            })
                        }
                        resolve(data)
                    } else {
                        wx.showToast({
                            title: '请求错误，去反馈或者请稍后重试~',
                            icon: 'none'
                        })
                        err = {
                            url: this.fullUrl,
                            method,
                            msg: res.statusCode,
                        }
                        reject(err)
                    }
                },
                fail: () => {
                    wx.showToast({
                        title: '请求错误，去反馈或者请稍后重试~',
                        icon: 'none'
                    })
                    err = {
                        url: this.fullUrl,
                        method,
                        msg: 'wx.request fail',
                    }
                    reject(err)
                }
            })
        })
    }

    //
    /**
     * get 请求
     * @param url 请求地址
     * @param checkToken 是否验证token，默认true
     * @return Promise<any> 对象
     */
    public get(url: string, checkToken = true): Promise<any> {
        return this.commonRequest(url, Method.GET, {}, checkToken)
    }

    /**
     * post 请求
     * @param url 请求地址
     * @param data 参数
     * @param checkToken 是否验证token，默认true
     * @return Promise<any> 对象
     */
    public post(url: string, data: Data = {}, checkToken = true): Promise<any> {
        return this.commonRequest(url, Method.POST, data, checkToken)
    }

    /**
    * 从微信获取code
    * @return Promise<string> 对象
    */
    private getCodeWx(): Promise<string> {
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    if (res.code) {
                        //发起网络请求
                        resolve(res.code)
                    } else {
                        reject('[wx.login] res.code is undefined')
                    }
                }
            })
        })
    }

    /**
    * 从服务器重新获取token
    * @return Promise<string> 对象
    */
    private async getTokenByCode(url: string, code: string): Promise<string> {
        if (!code) {
            return ''
        }
        const data = await this.post(url, { code }, false)
        if ('token' in data) {
            return data.token
        }
        return ''
    }

    /**
    * 保存token到本地
    * @return Promise<void> 对象
    */
    async saveToken(): Promise<void> {
        try {
            const code = await this.getCodeWx()
            const token = await this.getTokenByCode('token/user', code)
            if (token) {
                this.token = token
                wx.setStorageSync('token', token)
            }
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * 检查服务器的token是否过期
     * @return Promise<boolean> 对象 
     */
    async checkTokenOnServer(): Promise<boolean> {
        const data: { ok: boolean } = await this.post('token/check', { token: this.token }, false)
        return !!data.ok
    }

    /**
     * 是否有token
     * @return boolean
     */
    private hasToken(): boolean {
        return !!this.token
    }

    /**
     * 获取token
     * @return string
     */
    public getToken(): string {
        const token = wx.getStorageSync('token')
        this.token = token
        return token
    }
}

export default Request