// play.js
var drawPoint;

var newX=7,newY=7;
var clean;
var maxx = 15, maxy = 15, wincount = 5;
var count = 0;
var wins = [];
var meWin1 = [], aiWin1 = [];
meWin1[0] = 0; aiWin1[0] = 0;
var chessBoard=[];
for(var j=0;j<15;++j){
  chessBoard[j]=[];
  for(var c=0;c<15;++c)
    chessBoard[j][c]=0;
}
var turn = 2;
for (var i = 0; i < maxx; ++i) {
  wins[i] = [];
  for (var j = 0; j < maxy; ++j) {
    wins[i][j] = [];
  }
}
for (var i = 0; i < maxx; ++i)
  for (var j = 0; j < maxy - wincount + 1; ++j) {
    for (var k = 0; k < wincount; ++k)
      wins[i][j + k][count] = true;
    ++count;
    meWin1[count] = 0; aiWin1[count] = 0;
  }
//绔�
for (var i = 0; i < maxy; ++i)
  for (var j = 0; j < maxx - wincount + 1; ++j) {
    for (var k = 0; k < wincount; ++k)
      wins[j + k][i][count] = true;
    ++count;
    meWin1[count] = 0; aiWin1[count] = 0;
  }
//45
for (var i = 0; i <= maxx - wincount; ++i)
  for (var j = maxy - 1; j >= wincount - 1; --j) {
    for (var k = 0; k < wincount; ++k)
      wins[i + k][j - k][count] = true;
    ++count;
    meWin1[count] = 0; aiWin1[count] = 0;
  }
//145
for (var i = 0; i <= maxx - wincount; ++i)
  for (var j = 0; j <= maxy - wincount; ++j) {
    for (var k = 0; k < wincount; ++k)
      wins[i + k][j + k][count] = true;
    ++count;
    meWin1[count] = 0; aiWin1[count] = 0;
  }
function aiRun() {
  var meWin = [];
  var aiWin = [];
  for (var i = 0; i < maxx; ++i) {
    meWin[i] = [];
    aiWin[i] = [];
    for (var j = 0; j < maxy; ++j) {
      meWin[i][j] = 0;
      aiWin[i][j] = 0;
    }
  }
  var max = 0, mi = 0, mj = 0;

  for (var i = 0; i < maxx; ++i)
    for (var j = 0; j < maxy; ++j) {
      if (chessBoard[i][j] == 0) {

        for (var k = 0; k < count; ++k) {
          if (wins[i][j][k] == true) {
            if (meWin1[k] == 1) meWin[i][j] += 200;
            else if (meWin1[k] == 2) meWin[i][j] += 400;
            else if (meWin1[k] == 3) meWin[i][j] += 2000;
            else if (meWin1[k] == 4) meWin[i][j] += 10000;

            if (aiWin1[k] == 1) aiWin[i][j] += 220;
            else if (aiWin1[k] == 2) aiWin[i][j] += 420;
            else if (aiWin1[k] == 3) aiWin[i][j] += 2100;
            else if (aiWin1[k] == 4) aiWin[i][j] += 20000;
          }
        }

        if (meWin[i][j] > max) {
          max = meWin[i][j];
          mi = i; mj = j;
          console.log(i + " " + j)
        }
        else if (meWin[i][j] == max) {
          if (aiWin[i][j] > aiWin[mi][mj]) {
            mi = i; mj = j;
            console.log(i + " " + j)
          }
        }

        if (aiWin[i][j] > max) {
          max = aiWin[i][j];
          mi = i; mj = j;
          console.log(i + " " + j)
        }
        else if (aiWin[i][j] == max) {
          if (meWin[i][j] > meWin[mi][mj]) {
            mi = i; mj = j;
            console.log(i + " " + j)
          }
        }

      }
    }
  //  alert(mi + " " + mj)
  //  aiRender(mi, mj);
  chessBoard[mi][mj] = 2;
  for (var k = 0; k < count; ++k) {
    if (wins[mi][mj][k] == true) {
      aiWin1[k]++;
      meWin1[k] = wincount + 1;
      if (aiWin1[k] == wincount) {
       // alert('ai WIN');
       wx.showToast({
         title: 'you lose',
       })
        return;
      }

    }
  }
  turn = 1;

}
var meDo=function(){
  for (var k = 0; k < count; ++k)
    if (wins[newX][newY][k] == true) {
      meWin1[k]++;
      aiWin1[k] = wincount + 1;

      if (meWin1[k] == wincount) {
        wx.showToast({
          title: 'you win',
          icon: 'loading',
          duration: 10000
        })
        return;
      }
      
      
    }
  aiRun();
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"vicky"
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
    var jiaocha = function (x, y, color) {
      var xx = 20 * x;
      var yy = 20 * y;
      drawLine(xx, yy, xx + 20, yy + 20);
      drawLine(xx, yy + 20, xx + 20, yy);
    }

    clean = function () {
      context.clearRect(0, 0, 300, 300);
      context.setStrokeStyle("black");
      context.setLineWidth(2);

      for (var i = 0; i <= 300; i += 20)
        drawLine(i, 0, i, 300);
      for (var i = 0; i <= 300; i += 20)
        drawLine(0, i, 300, i);
      for (var i = 0; i < chessBoard.length; ++i)
        for (var j = 0; j < chessBoard[i].length; ++j)
          if (chessBoard[i][j] == 1) drawPoint(j, i, "red");
          else if (chessBoard[i][j] == 2) drawPoint(j, i, "black");
      jiaocha(newY, newX, "blue");

      context.draw(true);
    }
    clean();


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
  up:function(){
    newX--;
    clean();
  },
  down: function () {
    newX++;
    clean();
  },
  left: function () {
    newY--;
    clean();
  },
  right: function () {
    newY++;
    clean();
  },
  tap:function(){
    if(chessBoard[newX][newY]!=0) return;
    chessBoard[newX][newY]=1;
    meDo();
    clean();
  //  newX = 7; newY = 7;
   
  }
})
