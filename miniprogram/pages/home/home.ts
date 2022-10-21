// pages/home/home.ts

import Home from './HomeBus'
import { BillData, BillItem, BillList, Notice } from './HomeInterface'
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
     * 生命周期函数--监听页面加载完成
     */
    onReady() {
        if(wx.getStorageSync('token')) {
            this.getNotice()
        }
        this.checkUpdate()
    },

    // 检查是否需要更新
    checkUpdate() {
        const local_version: string = wx.getStorageSync('w_version')
        const config_version: {[key: string]: any} = wx.getStorageSync('config')
        if(local_version && config_version && config_version.version && config_version.version === local_version) {
            // 不需要更新

        } else {
            getApp().getUpload()
        }
    },

    // 检查是否有通知信息
    async getNotice() {
        // 校验是否需要通知
        const showNotice = wx.getStorageSync('show_notice')
        const nowTime = (new Date()).getTime()
        if(showNotice && showNotice.end_time > nowTime) {
            return
        }
        const noticeArr: Notice[] = await home.getNoticeDate()
        if(noticeArr.length > 0) {
            // 取第一个进行通知
            const firstItem = noticeArr[0]
            wx.showModal({
                title: firstItem.title,
                content: firstItem.content,
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#653BB7',
                success: function (res) {
                  if (res.confirm) {
                    wx.setStorageSync('show_notice', {
                        continued_time: firstItem.continued_time,
                        end_time: nowTime + firstItem.continued_time * 60 * 60 * 1000
                    })
                  }
                }
              })
        }
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
        wx.showLoading({
            title: '正在获取数据，请稍后...'
        })
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
            wx.hideLoading()
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