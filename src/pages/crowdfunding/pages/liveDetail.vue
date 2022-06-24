
<template>
    <div class="video-dplayer">
      <div class="video-bg"></div>
      <img v-if="liveInfo" class="video-bg-img" :src="liveInfo.avatar" alt="">
      <div id="dplayer"></div>
      <video :class="liveInfo && liveInfo.live_status == 2 ? '' : 'no-live-data'" id="my-player" preload="auto" muted autoplay type="rtmp/flv">
        <source>
      </video>
      <div v-if="liveInfo && liveInfo.live_status == 1" class="no-live">
        <div class="live-timestamp">{{timestamp ? '直播倒计时' : '等待直播中'}}</div>
        <!-- {{timestamp ? timestamp : '直播未开始'}} -->
        <van-count-down  v-if="timestamp" :time="timestamp" format="DD天HH小时mm分ss秒" @finish="getLiveDetail"/>
      </div>
      <div v-if="liveInfo && liveInfo.live_status == 3 && !liveInfo.playback_url"  class="no-live">
        直播已结束
      </div>
      <div class="player-info" v-if="liveInfo">
        <span class="user-info"><img :src="liveInfo.avatar" alt="">{{liveInfo.username}}</span>
        <!-- <span>直播ID: ididid</span> -->
      </div>
    </div>
</template>
 
<script>
import flvjs from 'flv.js';
import { _getQuery } from 'src/utils/tool.js';
export default {
  data () {
    return {
      dplayerOptions: {
        theme: '#b7daff',  // 风格颜色，例如播放条，音量条的颜色
        loop: false,  // 是否自动循环
        lang: 'zh-cn',  // 语言，'en', 'zh-cn', 'zh-tw'
        screenshot: true,  // 是否允许截图（按钮），点击可以自动将截图下载到本地
        hotkey: true,  // 是否支持热键，调节音量，播放，暂停等
        preload: 'auto',  // 自动预加载
        volume: 0.7,  // 初始化音量 // 在视频左脚上打一个logo
        video: {
          url: 'http://pull-flv-anchor.dongqiudi.com/live/fBNB3N1BBu6XxyQJ.flv', // 播放视频的路径
          type: 'customFlv',
          defaultQuality: 0  // 默认是HD
        },
        customType: {
          customFlv: function (video, player) {
            const flvPlayer = flvjs.createPlayer({
              type: 'flv',
              url: video.src
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
          }
        }
      },
      goods_no: _getQuery('goods_no') || '',
      liveInfo: null,
      timer: null,
      timestamp: ''
    };
  },
  mounted() {
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    this.getLiveDetail();
  },
  methods: {
    getLiveDetail () {
      // 直播状态,1等待直播2直播中3直播结束
      this.$axios_goods.get(`/goods/liveDetail?goods_no=${this.goods_no}`).then((res) => {
        let data = res.data;
        if (data.code === 0 && data.data) {
          this.liveInfo = data.data;
          if (+this.liveInfo.live_status === 2 && this.liveInfo.live_url) {
            this.initFlv();
          }
          if (+this.liveInfo.live_status === 3 && this.liveInfo.playback_url) {
            this.initPlayer();
          }
          // let currentTime;
          if (+this.liveInfo.live_status === 1 && this.liveInfo.start_time_stamp) {
            let current = (new Date()).getTime();
            if (this.liveInfo.start_time_stamp > (current / 1000)) {
              this.timestamp = (this.liveInfo.start_time_stamp * 1000) - current;
            }
          }
        }
      });
    },
    // 直播
    initFlv () {
      // 获取video节点
      var videoElement = document.getElementById('my-player');
      if (flvjs.isSupported()) {
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: false,
          url: this.liveInfo.live_url // flv格式流地址
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load(); // 加载
        // flvPlayer.play();// 播放
      }
    },
    // 回放
    initPlayer() {
      let Hls = require('hls.js');
      let DPlayer = require('dplayer');

      const dp = new DPlayer({
        container: document.getElementById('dplayer'),
        live: false,

        video: {
          url: this.liveInfo.playback_url,
          type: 'customHls',
          customType: {
            customHls: function (video, player) {
              const hls = new Hls();
              hls.loadSource(video.src);
              hls.attachMedia(video);
            }
          }
        }
      });
      console.log(dp);
      document.querySelector('.dplayer-menu').remove(); // 隐藏右键菜单
      document.oncontextmenu = () => false; // 阻止页面所有右键事件
    }
  }
};
</script>
 
<style lang="less" scoped>
  .video-dplayer{
    width: 100%;
    height: 100vh;
    display: inline-block;
    display: flex;
    align-items: center;
    background: #000;
    position: relative;
    .player-info {
      position: absolute;
      width: 100%;
      top: 40px;
      padding: 0 40px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      z-index: 21;
      font-size: 28px;
      .user-info {
        background: rgba(0,0,0,.5);
        padding: 20px 30px;
        border-radius: 60px;
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 15px;
        }
      }
    }
    .video-bg-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      -webkit-filter: blur(7px);
      -moz-filter: blur(7px);
      -ms-filter: blur(7px);
      filter: blur(7px);
      z-index: 5;
    }
    .video-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background: rgba(0,0,0,.5);
    }
    .dplayer {
      z-index: 20;
      width: 100%;
    }
    #my-player {
      position: relative;
      z-index: 20;
      width: 100%;
    }
    .player-flv {
      position: relative;
      z-index: 20;
    }
    .no-live-data {
      display: none;
    }
    .no-live {
      width: 100%;
      text-align: center;
      position: relative;
      z-index: 20;
      font-size: 62px;
      color: #fff;
      .van-count-down {
        font-size: 62px;
        color: #fff;
      }
      .live-timestamp {
        font-size: 28px;
        color: #BBBBBB;
        margin-bottom: 34px;
      }
    }
  }
</style>