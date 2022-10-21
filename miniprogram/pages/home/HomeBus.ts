import Request from "../../utils/Request"
import { BillData, BillItem, BillList, DateParam, DetailParam } from "./HomeInterface"

class Home extends Request {
    private errList: BillData = {
        year: 0,
        month: 0,
        total_income: 0,
        total_pay: 0,
        data: [],
    }

    private year: string | number = 0
    private month: string | number = 0

    constructor() {
        super()
        this.setDate()
        this.getConfig()
    }

    /**
     * 设置时间
     * @param date 传入的年月
     */
    setDate(date?: DateParam): void {
        // 存在传入时间，则设置为传入的时间
        if (date) {
            this.year = date.year
            this.month = date.month
        } else {
            const currentDate = new Date()
            this.year = currentDate.getFullYear()
            this.month = currentDate.getMonth() + 1
        }
    }

    /**
     * 获取通知信息
     */
    getNoticeDate() {
        return this.get('notice/get')
    }

    // 获取账单数据
    async getBillList(): Promise<BillData> {
        try {
            return await this.post('bill/get', { year: this.year, month: this.month })
        }finally {
            wx.stopPullDownRefresh()
        }
    }

    /**
     * 跳转详细
     * @param subItem 跳转的详细
     * @param item 跳转的分类
     */
    goDetail(subItem: BillItem, item: BillList) {
        // 加入时间
        const date = item.year + "年" + item.month + "月" + item.day + "日  " + item.week

        const param: DetailParam = {
            ...subItem,
            date,
            year: item.year,
            month: item.month,
            day: item.day,
            week: item.week
        }

        wx.navigateTo({
            url: '/pages/billDetail/billDetail?item=' + JSON.stringify(param),
        })
    }

    /**
     * 获取配置信息
     */
    getConfig() {
        this.get('config').then(data => {
            wx.setStorageSync('config', data)
        })
    }
}

export default Home