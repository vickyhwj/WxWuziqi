// pages/userList/userList.js
var th;
var imgIndex=['imgGame','imgFriend','imgMessage','imgKefu'];
var pageIndex=['pageGame','pageFriend','pageMessage','pageKefu']
function removeByCondition(list,col,value){
  for(var i=0;i<list.length;++i)
    if(list[i][col]==value){
      list.splice(i,1);
      break;
    }
}
function init(){
  th.setData({
    list: [],
    loading: true,
    input: '',
    index: 0,
    sum: 0,
    scrolly: true,
    app: null,
    friendlist: [],
    messages: [],
    userid: null,
    password: null,
    win: 0,
    fail: 0,

    imgGame: true,
    imgFriend: false,
    imgMessage: false,
    imgKefu: false,

    pageFriend: "none",
    pageKefu: "none",
    pageGame: "block",
    pageMessage: 'none',

    loginHidden: false,
    userInforHidden: true
  });
  getApp().globalData.userid=null;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loading:true,
    input:'' ,
    index:0,
    sum:0 ,
    scrolly:true,
    app:null,
    friendlist:[],
    messages:[],
    userid:null,
    password:null,
    win:0,
    fail:0,

    imgGame:true,
    imgFriend:false,
    imgMessage:false,
    imgKefu:false,

    pageFriend: "none",
    pageKefu: "none",
    pageGame: "block",
    pageMessage:'none',

    loginHidden:false,
    userInforHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    th=this;
   
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
  //下拉
  xiala:function(){
    if(th.data.index==th.data.sum||!th.data.scrolly) return;
    
    th.setData({
      loading:false,
      scrolly:false
    })
    console.log(getApp().globalData)
    wx.request({
      url: getApp().globalData.url+'/ssmws/getUserListByUserId?' +
      'userId=' + th.data.input + '&index='+(th.data.index+1)+'&len=20',
      success: function (res) {
        var result = res.data;
        console.log(result)
        var list = th.data.list;
        var ul = result.userlist;
        for (var i = 0; i < ul.length; ++i)
          list.push({
            userid: ul[i].userid,
            win: ul[i].win,
            fail: ul[i].fail
          });

        th.setData({
          list: list,
          loading: true,
          index: result.now,
          sum:result.sum,
          scrolly: true,
         
        })


      },
      fail:function(){
        wx.showToast({
          title: 'request error',
        })
      }
    })
    
  },
  inputBlur:function(e){
    console.log(e)
    th.setData({
      input:e.detail.value
    })
    
  },
  search:function(){
    wx.request({
      url: getApp().globalData.url+'/ssmws/getUserListByUserId?'+
     'userId=' + th.data.input+'&index=1&len=20',
      success: function (res) {
        var result = res.data;
        console.log(result)
        var list = th.data.list;
        list=[];
        var ul=result.userlist;
        for (var i = 0; i < ul.length; ++i)
          list.push({
            userid:ul[i].userid,
            win: ul[i].win,
            fail:ul[i].fail
          });

        th.setData({
          list: list,
          loading: true,
          index:result.now,
          sum: result.sum
        })


      },
      fail:function(){
        wx.showToast({
          title: 'request fail',
        })
      }
    })
  },
  up:function(){
    
  },
  //用户登录
  userSubmit:function(e){
    wx.request({
      url: getApp().globalData.url +'/ssmws/loginByJson?username=' + e.detail.value.username + '&password=' + e.detail.value.password,
      success:function(res){
        var data=res.data;
        console.log(data)
        
        if (data.status != 'ok') return;
        getApp().globalData.userid = data.userCustom.userid;
       
        th.setData({
          userid:data.userCustom.userid,
          password: data.userCustom.password,
          friendlist:data.friendlist,
          win:data.userCustom.win,
          fail:data.userCustom.fail,
          messages:data.userCustom.messages,
          loginHidden: true,
          userInforHidden: false
        });

        wx.connectSocket({
          url: getApp().globalData.wxurl +'/ssmws/websocketMsg?username='+th.data.userid
        })
        wx.onSocketOpen(function(){
          console.log("success");
        })
        wx.onSocketMessage(function(res){
          
          var data=JSON.parse(res.data);
          console.log(data)
          if(data.type==22||data.type==2){
            wx.request({
              url: getApp().globalData.url +'/ssmws/getFridendListJSON?userA=' + th.data.userid,
              success: function (res) {
                console.log(res.data.userids);
                var list = res.data.userids;
                th.setData({
                  friendlist: list
                })
              },
              fail:function(){
                wx.showToast({
                  title: 'request fail',
                })
              }
            });
            
          }
          var list=th.data.messages;
          list.push(
            data
          );
          th.setData({
            messages:list,
            
          })
        })

      }
    })
  },
  //
  confirm:function(e){
    var ob = {
      type:2,
      to:e.target.dataset.from
    }
    wx.sendSocketMessage({
      data: JSON.stringify(ob),
    })
    var list = th.data.messages;
    removeByCondition(list, 'msgId', e.target.dataset.msgid);
    th.setData({
      messages: list
    });
    
  },
  refuse:function(e){
    var ob = {
      type: 3,
      to: e.target.dataset.from
    }
    wx.sendSocketMessage({
      data: JSON.stringify(ob),
    })
    var list = th.data.messages;
    removeByCondition(list, 'msgId', e.target.dataset.msgid);
    th.setData({
      messages: list
    })
  },
  deleteMsg:function(e){
    var ob={
      type:0,
      msgId:e.target.dataset.msgid
    }
    wx.sendSocketMessage({
      data:JSON.stringify(ob) ,
    })
    var list=th.data.messages;
    removeByCondition(list, 'msgId', e.target.dataset.msgid);
    th.setData({
      messages:list
    })
  },
  //翻页
  change:function(e){
    console.log(e)
    var page = e.currentTarget.dataset.name;
    var ob=new Object();
    for(var i=0;i<imgIndex.length;++i){
      if(i==page){
        ob[pageIndex[i]]='block';
        ob[imgIndex[i]]=true;
      }
      else{
        ob[pageIndex[i]] = 'none';
        ob[imgIndex[i]] = false;
      }
    }
    console.log(ob)
    th.setData(ob)
  },
  yaoqing:function(e){
    if(th.data.userid==null){
      wx.showToast({
        title: '请登录',
      });
      return;
    }
    var userid = e.currentTarget.dataset.name;
    console.log(e)
    wx.showModal({
      title: 'message',
      content: '确定添加' + userid + '为好友',
      success:function(res){
        if(res.confirm)
          wx.showToast({
            title: '请求已发出',
            success:function(){
              var ob={
                to:userid,
                type:1
              }
              wx.sendSocketMessage({
                data: JSON.stringify(ob),
              })
            }
          })
      } 
    })
  },
  outLogin:function(){
    init();
    th.setData({
      loginHidden: false,
      userInforHidden: true,
      userid:null
    })
    wx.closeSocket({
      
    })
  },
  deleteRelationship:function(e){
    var userid = e.currentTarget.dataset.name;
    wx.request({
      url: getApp().globalData.url+'/ssmws/deleteRelationship?userA='+th.data.userid+
      '&userB='+userid,
      success:function(res){
        var fl=th.data.friendlist;
        removeByCondition(fl,'userid',userid);
        th.setData({
          friendlist:fl
        })
      },
      fail:function(){
        wx.showToast({
          title: 'request error',
        })
      }
    })
  },
  single:function(){
    wx.redirectTo({
      url: '../play/play'
    })
  },
  pk: function () {
    wx.redirectTo({
      url: '../pk/pk'
    })
  }
})