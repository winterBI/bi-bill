// pages/suggest/suggest.ts
import Request from "../../utils/Request"
const request = new Request()

interface Params {
    content: string;
    create_time: string;
    id: number;
    reply: string;
    status: number;
    title: string;
    update_time: string;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        content: "",
        param: {} as Params,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if ('param' in options) {
            var param = JSON.parse(options.param as string)
            this.setData({
                param: param,
                title: param.title,
                content: param.content,
            })
        }
    },

    // 提交数据
    submit() {
        if (!this.data.title) {
            wx.showToast({
                title: '请输入标题',
                icon: "none"
            })
            return
        }
        if (!this.data.content) {
            wx.showToast({
                title: '请输入详细描述',
                icon: "none"
            })
            return
        }
        const data = {
            title: this.data.title,
            content: this.data.content
        };

        request.post('suggest', data).then(data => {
            if (data.ok) {
                wx.showToast({
                    title: '提交成功，感谢您的反馈，谢谢。',
                    icon: "success"
                })
            } else {
                wx.showToast({
                    title: '提交失败，发生错误',
                    icon: "error"
                })
            }
            setTimeout(() => {
                wx.navigateBack()
            }, 1000);
        }).catch(() => {
            wx.showToast({
                title: '发生错误, 请稍后重试~',
                icon: "error"
            })
        })
    },

    // 删除
    del() {
        request.post('suggest/del', { id: this.data.param.id }).then(data => {
            if (data.ok) {
                wx.showToast({
                    title: '删除成功',
                    icon: "success"
                })
            } else {
                wx.showToast({
                    title: '删除失败',
                    icon: "error"
                })
            }
            setTimeout(() => {
                wx.navigateBack()
            }, 1000);
        }).catch(() => {
            wx.showToast({
                title: '发生错误, 请稍后重试~',
                icon: "error"
            })
        })
    },

    // 输入标题
    inputTitle(e: WechatMiniprogram.Input) {
        this.setData({
            title: e.detail.value
        })
    },

    // 输入内容
    inputContent(e: WechatMiniprogram.Input) {
        this.setData({
            content: e.detail.value
        })
    },
})