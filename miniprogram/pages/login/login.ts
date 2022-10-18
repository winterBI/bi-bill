// pages/login/login.ts

import Login from "./LoginBus"
const loginBus = new Login()

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    // 登录获取用户名和头像
    login() {
        wx.getUserProfile({
            desc: "获取用户信息",
            success: (res) => {
                wx.showLoading({
                    title: '正在登录...',
                    mask: true
                })
                // 获取token数据
                loginBus.login(res.userInfo)
            },
            fail: (res) => {
                console.log(res)
                wx.showToast({
                  title: '登录失败,重新登录',
                  icon: "error"
                })
              }
        })
    }
})