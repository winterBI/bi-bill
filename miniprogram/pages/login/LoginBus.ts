
import Request from "../../utils/Request"

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
            if(token) {
                this.post('user/update', params).then((data: updateInfo)=> {
                    wx.setStorageSync('userInfo', data)
                    if(data.id) {
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

}

export default Login