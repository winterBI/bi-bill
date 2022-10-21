
import Request from "../../utils/Request"
import { chartData, Params } from './interface'

class ChartBus extends Request {

  /**
   * 获取图表数据
   * @param param 
   */
  getChartsData(param: Params) {
    let totalAmount = 0
     return this.post("charts/get", param, true, false).then((data: chartData) => {
      // 从大 到 小
      const s_data = data.data
      .sort((a, b) =>  b.amount - a.amount);

      s_data.forEach(item => {
        totalAmount += parseInt((item.amount * 100).toString())
      })
      totalAmount = totalAmount / 100
      const length = s_data.length
      if(!totalAmount) {
        return {
          totalAmount,
          chartData: [],
          s_data
        }
      }
      return {
        totalAmount: totalAmount,
        chartData: s_data.map((item, index) => {
          return {
            value: item.amount,
            name: item.category.name + ` ${((item.amount / totalAmount) * 100).toFixed(2)}%`, // 保留两位小数
            // 这里设置饼图的样式
            itemStyle: {
                color: `rgba(101, 59, 183, ${(90 - (index / length) * 50) / 100})`,
                borderWidth:1, //设置border的宽度有多大
                borderColor:'#fff',
            }
          }
        }),
        s_data
      }
    })
  }

  
}

export default ChartBus