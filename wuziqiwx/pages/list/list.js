// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    items: ['a','b'],
    name:"vc",
    userids:[],
    d1:'block',
    d2:'none',
    d3:'none',
    src1:'../img/kefu1.png',
    src2: '../img/kefu.png',
    src3: '../img/kefu.png'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  tap:function(){
    var t=this;
    wx.request({
      url: 'http://127.0.0.1:8080/ssmws/getFridendListJSON?userA=1',
      
      success:function(res){
        t.setData({
          "userids":res.data.userids
        })
      },
      fail:function(){

      }
    })
  },
  xx:function(e){
    var n=e.target.dataset.name;
    wx.showToast({
      title: this.data.name,
    })
  },
  dd:function(e){
    var num = e.target.dataset.name;
    var ob=new Object();
    for(var i=1;i<=3;++i)
      if(i==num){
        ob['d'+i]='block';
        ob['src'+i]='../img/kefu1.png'
      }
      else{
        ob['d' + i] = 'none';
        ob['src' + i] = '../img/kefu.png'
      }
    this.setData(ob);


  }
})