// pages/add/add.ts
import { Type, CategoryItem, KeywordList, KeybordKeys, KeybordOperateObj, SubmitParams } from "./addInterface"
import Add from "./AddBus"
const add = new Add()
import Keybord from "./Keybord"
import { DetailParam } from "../home/HomeInterface"
const keybord = new Keybord()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 移动分类
        pageHeight: 0, // 屏幕高度
        screenWidth: 1, // 屏幕宽度

        type: 1 as Type, // 类型
        currentItem: {} as CategoryItem, // 当前选择的分类数据
        categoryList: [] as CategoryItem[], // 分类列表

        // 键盘相关数据
        kbRemark: "", // 备注
        kbAmount: "", // 金额
        kbSumOrSubmit: false, // 当有输入 + 或 - 时显示 = 否则显示 完成
        date: "", // 选择的时间
        dateSelect: "", // 显示选择的时间
        keywordList: [] as KeywordList, // 关键词列表

        // 修改账单
        param: {} as DetailParam, // 修改订单的信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if ("param" in options) {
            const param = JSON.parse(options.param as string)
            this.setData({
                param
            })
            // 需要修改数据
            this.checkEdit(param)

            // 加载关键词
            this.getKeywordList()
        }
        this._loadData(this.data.type)

        // 计算屏幕高度
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    pageHeight: res.windowHeight,
                    screenWidth: res.screenWidth,
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        keybord.setAmount(this.data.kbAmount)
    },

    // 是否是带参数进入，带参数进入则是修改账单
    checkEdit(param: DetailParam) {
        const data = {
            currentItem: param.category,
            kbAmount: param.amount.toString(),
            type: param.type,
            kbRemark: param.description,
            date: param.year + "/" + param.month + "/" + param.day, // 用/ 才能兼容ios和Android
            dateSelect: param.month + "-" + param.day,
        }
        this.setData(data)
    },
    /**
     * 加载数据
     */
    async _loadData(type: Type) {
        // 获取分类数据
        const category: CategoryItem[] = await add.getCategory(type)
        this.setData({
            categoryList: category
        })
    },

    /**
     * 获取关键词
     */
    getKeywordList() {
        keybord.getKeywordList().then((data) => {
            this.setData({
                keywordList: data
            })
        }).catch(() => {})
    },

    /**
     * 点击分类
     */
    tapItem(e: WechatMiniprogram.BaseEvent) {
        // 没有关键词的时候加载
        if (this.data.keywordList.length === 0) {
            this.getKeywordList()
        }
        const currentItem = getApp().getDataSet(e, 'item')
        this.setData({
            currentItem
        })

        // 移动位置，防止被输入法遮住
        // 计算距离底部的距离
        const offsetBottom = this.data.pageHeight - e.target.offsetTop

        // 计算键盘的高度
        const realHeightKb = (this.data.screenWidth / 750) * 700

        // 如果距离底部的距离小于键盘高度 则滚动相应的差值
        if ((offsetBottom - 100) < realHeightKb) {
            wx.pageScrollTo({
                scrollTop: realHeightKb - (offsetBottom - 100), // 滚动到的位置（距离顶部 px）
                duration: 500 //滚动所需时间 如果不需要滚动过渡动画，设为500（ms）
            })
        }
    },

    /**
     * 点击关键词
     */
    selectKeyword(e: WechatMiniprogram.BaseEvent) {
        this.setData({
            kbRemark: getApp().getDataSet(e, "keyword")
        })
    },

    /**
     * 长按删除关键词
     */
    // delKeyword(e: WechatMiniprogram.BaseEvent) {

    // },

    /**
     *  点击键盘的按键
     */
    keyboardTap(e: WechatMiniprogram.BaseEvent) {
        const key: KeybordKeys = getApp().getDataSet(e, "key") // 键盘上的键

        // 点击键盘上的按键
        keybord.tap(key, this.updateKeybord, this.submitBill)
    },

    /**
     * 提交订单
     */
    submitBill() {
        if (!this.data.kbAmount || /^(0|\+|-)$/.test(this.data.kbAmount) && this.data.kbSumOrSubmit) {
            wx.showToast({
                title: '请输入金额',
                icon: 'none'
            })
            return
        }

        // 格式化时间
        const dateResult = keybord.formatDate(this.data.date)
        const params: SubmitParams = {
            description: this.data.kbRemark,
            category_id: this.data.currentItem.id,
            type: this.data.currentItem.type,
            amount: parseInt((parseFloat(this.data.kbAmount) * 100).toString()) / 100,
            ...dateResult
        }

        // 修改订单需要带上订单id
        if (this.data.param.id) {
            params.id = this.data.param.id
        }

        keybord.submitBill(params)
    },

    /**
     * 更新键盘上的数据
     * @param operateObj 
     */
    updateKeybord(operateObj: KeybordOperateObj) {
        if (Object.keys(operateObj).length !== 0) {
            this.setData(operateObj)
        }
    },

    /**
     * 设置备注信息
     * @param e 
     */
    markInput(e: WechatMiniprogram.Input) {
        const value: string = e.detail.value
        this.setData({
            kbRemark: value
        })
    },

    // 选中日期
    selectDate(e: WechatMiniprogram.Input) {
        if (!e) return
        const value = e.detail.value
        const dateSelect = value.split("-")
        this.setData({
            date: value,
            dateSelect: dateSelect[1] + "-" + dateSelect[2],
        })
    },

    // 切换分类
    changeTab(e: WechatMiniprogram.Input) {
        const type = getApp().getDataSet(e, "type")
        if (type == this.data.type) return
        this._loadData(type)
        this.setData({
            type
        })
    },
})