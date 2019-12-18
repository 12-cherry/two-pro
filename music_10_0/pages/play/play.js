// pages/play/play.js
import url from "../../config/url.js";
var app = getApp();
Page({
  data: {
    song: {},
    duration: 0,
    current: 0,
    isDown: false,
    currentLrc: "",
    index:0
  },
  onLoad: function (options) {
    console.log( options.id );
  
    let {id,index} = options;
    this.setData({
      index: index
    })
    console.log(app.globalData)
    this.playMusic(id)
  },
  
  //封装成一个公用的函数
  playMusic(id){
    wx.request({
      url: `${url.song}?ids=${id}`,
      success: (res) => {
        console.log(res)
        this.setData({
          song: res.data.songs[0],
          
        });
        wx: wx.setNavigationBarTitle({
          title: res.data.songs[0].name
        })
      }
    });
    let { song } = app.globalData;

    if (!song) {
      song = app.globalData.song = wx.createInnerAudioContext();
    }
    song.src = `http://music.163.com/song/media/outer/url?id=${id}.mp3`;
    song.pause(); // 先停止 再调用 播放 , 否则有可能更新(onTimeUpdate)不会触发
    song.play();
    song.onPlay(res => {
      console.log("开始播放");
    })
    song.onTimeUpdate(res => {
      // console.log( song );
      if (this.data.duration !== song.duration) {
        this.setData({
          duration: song.duration
        })
      };
      if (!this.data.isDown) {
        this.setData({
          current: song.currentTime
        })
      };
      let { currentTime: c } = song;
      let min = Math.floor(c / 60);
      let sec = Math.floor(c % 60);
      var attr = (min < 10 ? "0" + min : "" + min) + ":" + (sec < 10 ? "0" + sec : "" + sec);
    })
  },
  
  changing(){
    this.setData({ 
      isDown: true
    })  
  },
  change(e){
    console.log(e.detail)
    this.setData({
      isDown: false
    })
    app.globalData.song.seek(e.detail.value)
  },
  tap(){
    let {song} = app.globalData;
    song.paused ? song.play() : song.pause();
  },
  previousSong(){
    //拿到歌曲的id值
    console.log(typeof (this.data.index))
    if (this.data.index==0) return 
    this.data.index-=1;
    let preID = app.globalData.totalSong[this.data.index].id;
    
    this.playMusic(preID)

  },
  nextSong(){
    console.log(typeof(this.data.index))
    if (this.data.index == app.globalData.totalSong.length-1) return
    this.data.index = Number(this.data.index)+1;
    console.log(app.globalData.totalSong)
    console.log(this.data.index)
    let nextID = app.globalData.totalSong[this.data.index].id;

    this.playMusic(nextID)
  }


})