// app.ts
import { w_version } from "./config"
App({
  globalData: {

  },
  onLaunch() {
      // 设置版本号
    wx.setStorageSync('w_version', w_version)
  },

  /**
   * 获取元素上绑定的属性
   * @param e 事件回调
   * @param setKey 获取的key
   * @return 属性值
   */
  getDataSet: (e: WechatMiniprogram.BaseEvent, setKey: string): any => {
    return e.currentTarget.dataset[setKey]
  },
})