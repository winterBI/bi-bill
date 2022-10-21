import Request from "../../utils/Request"
import { KeybordKeys, KeybordOperateObj, KeywordList, SubmitParams } from "./addInterface"

/**
 * 自定义键盘
 */
class Keybord extends Request {
    public kbAmount = '' // 金额

    /**
     * 设置初始金额
     * @param amount 
     */
    setAmount(amount: string) {
        this.kbAmount = amount
    }

    /**
     * 获取关键词
     */
    getKeywordList(): Promise<KeywordList> {
        return this.get('keyword/get')
    }

    /**
     * 创建关键词
    */
    createKeybord(mark: string) {
        this.post('keyword/create', { keyword: mark })
    }

    /**
     * 键盘点击
     * @param key 点击的键值
     * @param cb 回调函数 更新键盘数据
     * @param submit 提交账单
     */
    tap(key: KeybordKeys, cb: (obj: KeybordOperateObj) => void, submit: () => void) {

        const numberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

        // 输入数字
        if (numberList.indexOf(key) !== -1) {
            this.kbAmount = this.kbAmount + key
        } else {
            // 点击的是操作符
            switch (key) {
                case 'point':
                    this.kbAmount = this.kbAmount + "."
                    break;
                case 'del':
                    this.kbAmount = this.kbAmount.substr(0, this.kbAmount.length - 1)
                    break;
                case "add":
                    this.kbAmount = this.kbAmount + '+'
                    break;
                case "sub":
                    this.kbAmount = this.kbAmount + '-'
                    break;
                case "submit":
                    // 需要运算
                    if (this.needAddOrSub()) {
                        // 进行算数计算
                        this.calculate()
                    } else {
                        // 提交账单
                        submit()
                    }
                    break;
                default:
                    break;
            }
        }
        this.checkInput()

        cb({
            kbAmount: this.kbAmount,
            kbSumOrSubmit: this.needAddOrSub()
        })
    }

    /**
     * 提交账单到服务器
     */
    submitBill(params: SubmitParams) {
        wx.showLoading({
            title: '正在创建订单，请稍后...'
        })
        this.post('bill/create', params).then(data => {
            if (data.ok) {
                this.createKeybord(params.description)
                wx.switchTab({
                    url: '/pages/home/home'
                })
            } else {
                wx.showToast({
                    title: '创建失败!',
                    icon: 'none'
                })
            }
            wx.setStorageSync('homeRefresh', true)
            wx.setStorageSync('billRefresh', true)
            wx.setStorageSync('chartRefresh', true)
        }).catch(() => {
            wx.showToast({
                title: '创建失败!',
                icon: 'none'
            })
        }).finally(() => {
            wx.hideLoading()
        })
    }

    /**
     * 格式化时间
     */
    formatDate(date?: string) {
        const result = {
            year: 0,
            month: 0,
            day: 0,
            week: "",
            timestamp: 0
        }

        let now: Date
        const weekArray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        if (!date) {
            now = new Date()
        } else {
            var newDate = (date).replace(/-/g, "/")
            const timestamp = Date.parse(newDate)
            now = new Date(timestamp)
        }

        result.year = now.getFullYear()
        result.month = now.getMonth() + 1
        result.day = now.getDate()
        result.week = weekArray[now.getDay()]
        result.timestamp = parseInt((now.getTime() / 1000).toString())
        return result
    }

    /**
     * 判断是否金额中有 + 或者 -
     */
    needAddOrSub(): boolean {
        // 需要计算的情况
        // 1.在金额中间有 '+' 或 '-'
        // 2.金额的头尾不会进行计算
        return /\d+(\+|-)\d+/g.test(this.kbAmount)
    }

    /**
     * 检查输入的运算是否合法
     * 不能存在 +- 或者 -+ 在一起的情况
     * @return {boolean} true合法 false非法
     */
    checkInput(): boolean {
        if (/(\+-|-\+)+/g.test(this.kbAmount)) {
            wx.showToast({
                title: '运算符不合法,请检查',
                icon: 'none'
            })
            return false
        }
        return true
    }

    /**
     * 进行 + - 运算
     */
    calculate() {
        if (!this.checkInput()) {
            return
        }
        // 去除头尾的 + , -不能去掉 有-3-3=-6的情况
        const amount = this.kbAmount.replace(/^(\+)+/, '').replace(/(\+)+$/, '')

        // 如果没有运算符 直接返回
        if (/(\+|-)+/g.test(this.kbAmount)) {
            let result = 0
            const addArr = amount.split('+')
            addArr.forEach((addItem) => {
                // 空的不用计算
                if (!addItem) return
                // 还存在 - 继续运算
                if (/-+/g.test(addItem)) {

                    const subArr = addItem.split('-')
                    let subResult = 0
                    // - 号运算符遍历计算
                    subArr.forEach((subItem, index) => {
                        subItem = subItem ? subItem : "0"
                        if (index === 0) {
                            subResult = parseFloat(subItem)
                        } else {
                            subResult -= parseFloat(subItem)
                        }
                    })
                    result += subResult
                } else {
                    result += parseFloat(addItem)
                }
            })
            this.kbAmount = result.toFixed(2).toString()
        }
    }
}

export default Keybord