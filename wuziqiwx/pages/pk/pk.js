// pages/pk/pk.js
var username;
var chessBoard=[];
for(var i=0;i<15;++i){
  chessBoard[i]=[];
  for(var j=0;j<15;++j)
    chessBoard[i][j]='o';
}
var newX=7,newY=7;
var clean;
var th;
var turn;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendlist:[],
    hidden:true,
    nocancel:false,
    from:null,
    friendlistHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      friendlist: [],
      hidden: true,
      nocancel: false,
      from: null,
      friendlistHidden: true
    })
    chessBoard = [];
    for (var i = 0; i < 15; ++i) {
      chessBoard[i] = [];
      for (var j = 0; j < 15; ++j)
        chessBoard[i][j] = 'o';
    }
     newX = 7, newY = 7;
     clean=null;
     th=null;
     th=this;
     turn=null;
    console.log("onload")
    username=getApp().globalData.userid;
    if(username==null)
      wx.redirectTo({
        url: '../userList/userList',
      })
    var context = wx.createCanvasContext('firstCanvas')
    var drawLine = function (x1, y1, x2, y2) {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
     


    }
    var drawPoint = function (x, y, color) {
      context.beginPath();
      var xx = 20 * x + 10;
      var yy = 20 * y + 10;
      context.arc(xx, yy, 8, 0, 2 * Math.PI, true);
      context.setStrokeStyle(color);
      context.setFillStyle(color)
      context.fill();
      context.stroke();
      context.closePath();
    }
    var jiaocha=function(x,y,color){
      var xx = 20 * x ;
      var yy = 20 * y ;
      drawLine(xx,yy,xx+20,yy+20);
      drawLine(xx,yy+20,xx+20,yy);
    }

     clean=function(){
      context.clearRect(0,0,300,300);
      context.setStrokeStyle("black");
      context.setLineWidth(2);
      
      for (var i = 0; i <= 300; i += 20)
        drawLine(i, 0, i, 300);
      for (var i = 0; i <= 300; i += 20)
        drawLine(0, i, 300, i);
      for(var i=0;i<chessBoard.length;++i)
        for(var j=0;j<chessBoard[i].length;++j)
          if(chessBoard[i][j]=='a') drawPoint(j,i,"red");
          else if (chessBoard[i][j] == 'b') drawPoint(j, i, "black");
      jiaocha(newY,newX,"blue");

      context.draw(true);
    }
    clean();
    
    
    th=this;
    wx.request({
      url: getApp().globalData.url +'/ssmws/getFriendListJson?username='+username,
      success:function(res){
        var data=res.data.friendlist;
     
        var list=[];
        for (var i = 0; i < data.length;++i){
          list.splice(list.length,0,{
            "userid":data[i],
            "online":false
          })
        }
        console.log("setting");
        console.log(list)
        th.setData({
          friendlist:list
        })
        console.log(getApp().globalData.wxurl)
        wx.closeSocket();
        wx.connectSocket({
          url: getApp().globalData.wxurl+'/ssmws/websocket?username='+username

        })
        wx.onSocketOpen(function () {
          console.log("success")
        })
        wx.onSocketMessage(function (res) {
          var data = res.data;
          data = JSON.parse(data);
          console.log(data)
          //读取在线用户列表
          if(data.type==2){
            data=data.list;
            var fl=th.data.friendlist;
            for(var i=0;i<fl.length;++i){
              for(var j=0;j<data.length;++j)
                if(data[j]==fl[i].userid){
                  fl[i].online=true;
                }
            }
            th.setData({
              friendlist:fl
            })
          }
          //对方上线
          else if(data.type==1){
            var fl = th.data.friendlist;
            for (var i = 0; i < fl.length; ++i) {
              if(data.from==fl[i].userid){
                fl[i].online=true;
                th.setData({
                  friendlist: fl
                });
                break;
              }
            }
          }
          //对方下线
          else if (data.type == 3) {
            var fl = th.data.friendlist;
            for (var i = 0; i < fl.length; ++i) {
              if (data.from == fl[i].userid) {
                fl[i].online = false;
                th.setData({
                  friendlist: fl
                });
                break;
              }
            }
          }
          //对方邀请
          else if(data.type==5){
            th.setData({
              "hidden":false,
              "from":data.from
            })
          }
          //start
          else if(data.type==8){
            for(var i=0;i<15;++i)
              for(var j=0;j<15;++j)
                chessBoard=data.state;
            clean();
            turn=data.turn;
            if(data.winner!=null)
              wx.showToast({
                title: data.winner+'wins'
              })


          }
          //对方同意了
          else if (data.type == 71) {
            th.setData({
              from:data.from
            })
            wx.showToast({
              title: data.from+'同意了'
            })

          }
        })
        wx.onSocketError(function(){
          console.log("websocket error");
          wx.showToast({
            title: 'websocket error',
          })
        })
        wx.onSocketClose(function () {
          console.log("websocket close");
          wx.showToast({
            title: 'websocket close',
          })
        })
      },
      fail:function(){
        wx.showToast({
          title: 'request error',
        })
      }
    })
    
  
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
    console.log("umload")
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
  //同意游戏
  confirm:function(){
    var msg={
      type:7,
      to:th.data.from

    }
    wx.sendSocketMessage({
      data: JSON.stringify(msg)
    });
    th.setData({
      hidden:true
    })
  },
  //拒绝
  cancel:function(){
    var msg={
      type:6,
      to:th.data.from
    }
    wx.sendSocketMessage({
      data: JSON.stringify(msg),
    });
    th.setData({
      hidden:true
    })
  },
  dir:function(e){
    var d = e.currentTarget.dataset.name;
    var move=[
      [-1,0],[1,0],[0,-1],[0,1]
    ];
    if (newX + move[d][0] < 0 || newX + move[d][0] >= 15 || newY + move[d][1] < 0||newY+move[d][1]>=15)
      return;
    newX+=move[d][0];
    newY+=move[d][1];
    clean();
    
  },
  go:function(e){
    if(chessBoard[newX][newY]!='o'||turn!=username) return;
    var msg={
      type:9,
      to:th.data.from,
      x:newX,
      y:newY
    }
    console.log(msg)
    wx.sendSocketMessage({
      data: JSON.stringify(msg)
    })
  },
  //邀请
  yaoqing:function(e){
    if (th.data.from!=null) {
      wx.closeSocket()
      wx.redirectTo({
        url: '../pk/pk',
      });
      return;
    }
    wx.showToast({
      title: '已发出邀请',
    })
    var msg={
      type:4,
      to: e.currentTarget.dataset.name
    }
    console.log(msg);
    console.log(th.data.friendlist)
    wx.sendSocketMessage({
      data: JSON.stringify(msg),
    })
  },
  //列表弹出
  show:function(){
    var d = th.data.friendlistHidden;
    th.setData({
      friendlistHidden: !th.data.friendlistHidden
    })
  },
  back:function(){
    for (var i = 0; i < 15; ++i) {
      chessBoard[i] = [];
      for (var j = 0; j < 15; ++j)
        chessBoard[i][j] = 'o';
    }
     newX = 7, newY = 7;
     clean=null;
     wx.closeSocket();
     turn=null;
     th.setData({
       friendlist: [],
       hidden: true,
       nocancel: false,
       from: null,
       friendlistHidden: true
     })
    wx.redirectTo({
      url: '../userList/userList'
    })
  }
})