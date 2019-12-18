// pages/list/list.js
import url from "../../config/url.js";
var app = getApp();
Page({
  data: {
    list: [],
    num:10,
    idx:-1,
    type:"",
    len: 0
  },

  onLoad: function (options) {
    console.log(options )
    let { id,type } = options;
    this.setData({
      idx: id,
      type: type
    })
    this.questFn(id, type);

  },
  //封装成公用的发送请求函数
  questFn(id,type){
    wx.request({
      url: `${url.list}?idx=${id}`,
      success: (res) => {
        console.log(res);
        this.setData({
          list: res.data.playlist.tracks.slice(0, this.data.num),

        })
        app.globalData.totalSong = []
        app.globalData.totalSong = app.globalData.totalSong.concat(this.data.list)
        this.data.len = res.data.playlist.tracks.length
        console.log(app.globalData.totalSong)
        wx.setNavigationBarTitle({
          title: type
        })
      }
    })
     wx.hideNavigationBarLoading();
  },
  
  tap(e){
    let {id,index} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/play/play?id=${id}&index=${index}`,
    })
  },
  //上滑加载更多
  onReachBottom(){
    wx.showNavigationBarLoading()
   this.data.num+=5;
    if (this.data.num == this.data.len){
      wx.showToast({
        title: '没有更多数据了',
        icon:"success",
        duration:2000,
        mask:true
      })

      return;
    };
    this.questFn(this.data.idx,this.data.type)
    console.log(this.data.num)
  }
})