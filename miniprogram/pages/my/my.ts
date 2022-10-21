// pages/my/my.ts

import My from "./MyBus"
const my = new My()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLogin: wx.getStorageSync('token'),
        userInfo: {},
        version: "",
        config: {},
        billCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this._loadData()
        if(Object.keys(this.data.userInfo).length === 0) {
            this.setData({
                version: wx.getStorageSync('w_version'),
                userInfo: wx.getStorageSync('userInfo'),
                config: wx.getStorageSync('config'),
            })
        }
    },

    // 加载数据
    async _loadData() {

        if (!this.data.isLogin) {
            this.setData({
                isLogin: wx.getStorageSync('token'),
            })
            return
        }
        my.getCount().then((data) => {
            this.setData({
                billCount: data
            })
        }).catch(() => {

        })
    },

    // 建议
    goSuggest() {
        wx.navigateTo({
            url: '/pages/suggestList/suggestList',
        })
    },

    // 查看更新日志
    goLogo() {
        wx.navigateTo({
            url: '/pages/log/log',
        })
    },

    // 退出登录
    logout() {
        wx.setStorageSync('token', '')
        wx.setStorageSync('userInfo', '')
        wx.navigateTo({
            url: '/pages/login/login'
        })
    }
})