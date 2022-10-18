// pages/suggestList/suggestList.ts

import Request from "../../utils/Request"
const request = new Request() 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suggestList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onShow() {
        this._loadData()
    },

    // 加载数据
    async _loadData() {
        this.setData({
            suggestList: await request.get('suggest/get')
        })
      },

    // 添加
    goAdd() {
        wx.navigateTo({
            url: '/pages/suggest/suggest',
        })
    },

    // 查看
    goReview(event: WechatMiniprogram.BaseEvent) {
        var param = getApp().getDataSet(event, "item")
        param = JSON.stringify(param)
        wx.navigateTo({
            url: '/pages/suggest/suggest?param=' + param,
        })
    },

})