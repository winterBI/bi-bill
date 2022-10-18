// pages/log/log.ts
import Request from "../../utils/Request"
const request = new Request()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        logList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this._loadData()
    },

    async _loadData() {
        this.setData({
            logList: await request.get('log')
        })
      },
})