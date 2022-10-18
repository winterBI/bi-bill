// pages/bill/bill.ts
import { Year, BillList } from "./billInterface"
import Bill from "./BillBus"
const bill = new Bill()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        billData: {
            data: [],
            total_income: 0,
            total_last: 0,
            total_pay: 0,
            year: (new Date()).getFullYear(),
        } as BillList,
        year: 0 as Year
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        const year = (new Date()).getFullYear()
        this.setData({
            year
        })
        this._loadData(year)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (wx.getStorageSync('billRefresh')) {
            this._loadData(this.data.year)
        }
    },

    /**
     * 加载数据
     * @param year 
     */
    async _loadData(year: Year) {
        bill.getBillList(year).then(data => {
            this.setData({
                billData: data
            })
        }).catch(() => {
            wx.showToast({
                title: '获取账单列表失败',
                icon: 'none'
            })
        }).finally(() => {
            wx.stopPullDownRefresh()
            wx.setStorageSync('billRefresh', false)
        })
    },

    // 选择日期
    selectDate(event: WechatMiniprogram.Input) {
        const year = event.detail.value
        this.setData({
            year
        })
        this._loadData(year)
    },

    // 下拉刷新
    onPullDownRefresh() {
        this._loadData(this.data.year)
    },
})