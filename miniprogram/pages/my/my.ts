// pages/my/my.ts

import My from "./MyBus"
const my = new My()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        version: "",
        config: {},
        billCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.setData({
            version: wx.getStorageSync('w_version'),
            userInfo: wx.getStorageSync('userInfo'),
            config: wx.getStorageSync('config'),
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this._loadData()
    },

    // 加载数据
    async _loadData() {
        this.setData({
            billCount: await my.getCount(),
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
        wx.clearStorageSync()
        wx.navigateTo({
            url: '/pages/login/login'
        })
    }
})