import { DetailParam } from "../home/HomeInterface";
import BillDetail from "./BillDetailBus"
const billDetail  = new BillDetail()
// pages/billDetail/billDetail.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailData: {} as DetailParam
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if ('item' in options) {
            this.setData({
                detailData: JSON.parse(options.item as string)
            })
        } else {
            wx.showToast({
                title: '发生错误~',
                icon: "error",
                duration: 1500
            })
            setTimeout(() => {
                wx.navigateBack()
            }, 1500);
        }
    },

    // 编辑账单
    edit() {
        var param = JSON.stringify(this.data.detailData)
        wx.navigateTo({
            url: '/pages/add/add?param=' + param,
        })
    },

    // 删除账单
    del() {
        wx.showLoading({
            title: "正在删除..."
        })
        billDetail.post("bill/del",{ id: this.data.detailData.id }).then(data => {
            wx.showToast({
                title: data.ok ? '删除成功' : "删除失败",
                icon: "none"
            })
            wx.setStorageSync('homeRefresh', true)
            wx.setStorageSync('billRefresh', true)
            setTimeout(() => {
                wx.navigateBack()
            }, 500);
        }).catch(() => {
            wx.showToast({
                title: '删除失败!',
                icon: "error"
            })
        }).finally(() => {
            wx.hideLoading()
        })
    }
})