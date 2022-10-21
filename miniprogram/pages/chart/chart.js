import * as echarts from '../../ec-canvas/echarts';
import {
    debounce
} from "../../utils/util"
import EchatBus from "./ChartBus"
const echartBus = new EchatBus()

let pieChart = null; // chart 实例
let ecComponent = null // 需要该属性来初始化对象
Page({
    data: {
        // 图表相关
        ec: {
            // 将 lazyLoad 设为 true 后，需要手动初始化图表
            lazyLoad: true
        },
        isLoaded: false, // 图表正在加载中

        year: '', // 年份
        month: '', // 月份
        type: 1, // 1:支出 2:收入
        dateType: 2, // 1:查询年账单 2:查询月账单
        s_data: [], // 原始数据
        totalAmount: 0, // 总金额
        timer: null, // 切换账单节流
    },

    onLoad() {
        this.setData({
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth() + 1,
        })

    },

    onReady: function () {
        // 获取组件
        ecComponent = this.selectComponent('#mychart-dom-bar');

        // 加载数据
        this.__loadData()
    },

    onShow() {
        if(wx.getStorageSync('chartRefresh')) {
            this.__loadData()
        }
    },

    /**
     * 初始化图表
     * @param {*} data 传入的数据
     */
    init: function (data) {
        ecComponent.init((canvas, width, height, dpr) => {
            // 获取组件的 canvas、width、height 后的回调函数
            // 在这里初始化图表
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
            });
            this.setOption(chart, data);

            // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
            pieChart = chart
            this.setData({
                isLoaded: true
            });

            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return chart;
        });
    },

    /**
     * 设置图表数据
     * @param {*} chart 
     * @param {*} data 
     */
    setOption(chart, data) {
        const option = {
            backgroundColor: "#ffffff",
            series: [{
                label: {
                    normal: {
                        fontSize: 14
                    }
                },
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['40%', '70%'],
                // data: this.data.pieData
                data,
            }]
        };
        chart.setOption(option);
    },

    // 加载数据
    __loadData() {
        wx.showLoading({
          title: '正在加载...',
          mask: true
        })
        const param = {
            year: this.data.year,
            month: parseInt(this.data.month),
            type: this.data.type,
            dateType: this.data.dateType,
        }
        // 加载数据
        this.setData({
            isLoaded: true
        });
        echartBus.getChartsData(param).then(data => {
            this.setData({
                s_data: data.s_data, // 原始数据
                totalAmount: data.totalAmount, // 总金额
            })
            if (pieChart) {
                
                // pieChart.dispose();
                pieChart = null
                this.init(data.chartData)
                // this.setOption(pieChart, data.chartData)
            } else {
                this.init(data.chartData)
            }
        }).catch(() => {
            this.init([])
        }).finally(() => {
            wx.setStorageSync('chartRefresh', false)
            wx.hideLoading()
        })
    },

    // 选择时间
    selectDate(e) {
        const date = e.detail.value.split('-')
        this.setData({
            year: date[0],
            month: date[1],
        })
        this.__loadData()
    },

    // 切换类型
    changeType(e) {
        const type = getApp().getDataSet(e, 'type')
        this.setData({
            type
        })
        this.__loadData()
    },

    // 切换统计类型 
    // changeDateType: debounce(function () {
    //     this.setData({
    //         dateType: this.data.dateType === 1 ? 2 : 1
    //     })
    //     this.__loadData()
    // }, 800, true),
    changeDateType: function() {
        this.setData({
            dateType: this.data.dateType === 1 ? 2 : 1
        })
        this.__loadData()
    },

    // 销毁图表
    dispose: function () {
        if (pieChart) {
            pieChart.dispose();
        }
        this.setData({
            isLoaded: true
        });
    },
});