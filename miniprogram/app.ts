// app.ts
import { w_version } from "./config"
App({
  globalData: {
    
  },
  onLaunch() {
      // 设置版本号
    wx.setStorageSync('w_version', w_version)
    this.getUpload()
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

  /**
   * 提示更新
   */
  getUpload: function() {
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
})