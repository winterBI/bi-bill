// pages/home/home.ts

import Home from './HomeBus'
import { BillData, BillItem, BillList } from './HomeInterface'
const home = new Home()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        billData: {
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth() + 1,
            total_income: 0,
            total_pay: 0,
            data: [],
        } as BillData,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        this._loadData()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if(wx.getStorageSync('homeRefresh')) {
            this._loadData()
        }
    },
    // 分享给好友
    onShareAppMessage() {
        return {
            title: '简简单单记账，快快乐乐生活。',
            path: '/pages/home/home',
            imageUrl: "../../images/logo-share.png"
        }
    },

    // 跳转单个账单详细
    goDetail(event: WechatMiniprogram.ClientRect) {
        const subItem: BillItem = getApp().getDataSet(event, "sub_item")
        const item: BillList = getApp().getDataSet(event, "item")
        home.goDetail(subItem, item)
    },

    // 添加账单
    addBill() {
        wx.navigateTo({
            url: '/pages/add/add',
        })
    },

    // 下拉刷新
    onPullDownRefresh() {
        this._loadData()
    },


    /**
     * 加载数据
     * @param year 传入年份
     * @param month 传入月份
     */
    async _loadData(): Promise<void> {
        home.getBillList().then(data => {
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
            wx.setStorageSync('homeRefresh', false)
        })
    },

    /**
     * 选择时间
     * @param event 参数回调
     */
    selectDate(event: WechatMiniprogram.PickerChange) {
        const date = (event.detail.value as string).split("-")
        const year = date[0]
        const month = date[1]
        home.setDate({ year, month })
        this._loadData()
    },
})