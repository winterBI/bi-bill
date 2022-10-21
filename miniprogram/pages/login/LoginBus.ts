
import Request from "../../utils/Request"
import { w_version } from "../../config"
interface updateInfo {
    id: number,
    nickname: string,
    avatar: string
}

class Login extends Request {

    /**
     * 获取用户信息和openid进行登录
     * @param userInfo 用户信息
     * @return void
     */
    login(userInfo: WechatMiniprogram.UserInfo): void {
        const { nickName, avatarUrl } = userInfo
        const params = {
            nickname: nickName, avatar: avatarUrl
        }
        this.saveToken().then((token) => {
            if (token) {
                this.post('user/update', params).then((data: updateInfo) => {
                    wx.setStorageSync('userInfo', data)
                    this.setInfo()
                    if (data.id) {
                        wx.switchTab({
                            url: '/pages/home/home',
                        })
                    }
                }).catch((res) => {
                    console.log(res)
                })
            }
        }).finally(() => {
            wx.hideLoading()
        })
    }

    /**
     * 设置相关的信息
     */
    setInfo() {
        // 设置版本号
        wx.setStorageSync('w_version', w_version)
        wx.setStorageSync('homeRefresh', true)
        wx.setStorageSync('billRefresh', true)
        wx.setStorageSync('chartRefresh', true)
    }

}

export default Login