//index.js
//获取应用实例
var app = getApp()
var x=Page({
  data: {
    motto: 'Hello W11441orld',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../play/play'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  bu:function(){
    console.log('ssss');
  }
})
