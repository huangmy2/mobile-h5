<template>
  <transition name="fade" mode='out-in'>
    <router-view></router-view>
  </transition>
</template>

<script type="text/javascript">
import browers from 'src/utils/browers.js';

export default {
  data () {
    return {
    };
  },
  created () {
    // if (!browers.appUA) {
    //   console.log('当前状态为非app内');
    //   return false;
    // }
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))));
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    });
  },
  mounted () {
    console.log('auth', browers);
    if (browers.wx) {
      console.log('in wx');
    }
  },
  methods: {
    // 秒转化成 天时分秒 用来倒计时
    formatSeconds (value) {
      var theTime = parseInt(value);// 需要转换的时间秒
      var theTime1 = 0;// 分
      var theTime2 = 0;// 小时
      var theTime3 = 0;// 天
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
          if (theTime2 > 24) {
          // 大于24小时
            theTime3 = parseInt(theTime2 / 24);
            theTime2 = parseInt(theTime2 % 24);
          }
        }
      }
      var result = '';
      if (theTime > 0) {
        result = '' + parseInt(theTime);
      }
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + ':' + result;
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + ':' + result;
      }
      if (theTime3 > 0) {
        result = '' + parseInt(theTime3) + '天 ' + result;
      }
      return result;
    },
    // 时间戳转化年月日时分秒
    timestampToTime(timestamp) {
      var date = new Date(timestamp) * 1000;
      let Y = date.getFullYear() + '.';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
      let D = date.getDate();
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return Y + M + D + ' ' + h + m + s;
    }
  }
};
</script>

<style lang="less">
*{
  margin:0;
  padding: 0;
}
body,html{
  background: #F1F3F4;
  height: 100%;
  color: #2D2F32;
  // .van-dialog {
  //   padding: 20px 0;
  //   color: #2D2F32;
  //   border-radius: 10px;
  //   .van-hairline--left {
  //       background: #EB3838;
  //   }
  //   .van-dialog__cancel, .van-dialog__confirm {
  //     border-radius: 50px;
  //     height: 84px;
  //     margin: 0 20px
  //   }
  //   .van-dialog__cancel {
  //     background: #fff;
  //     color: #2D2F32;
  //     border: 5px solid #F1F3F4;
  //   }
  // }
}
.clearfix:after{
  visibility:hidden;
  display:block;
  font-size:0;
  content:" ";
  clear:both;
  height:0;
}
.clearfix{
  *zoom:1;
}
.clear{
  clear:both;
}
.main {
  width: 100%;
  min-height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling:touch;
}
.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.bottom-btn-dom {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    padding: 20px 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .btn {
        float: right;
        width: 220px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 28px;
        border-radius: 56px;
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(270deg, #51b761 0%, #30B544 100%);
    }
    .btn-aff {
        float: right;
        width: 190px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 28px;
        border-radius: 56px;
        color: #333;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 5px solid #F1F3F4;
        margin-right: 10px;
        box-sizing: border-box;
    }
}
.bottom-center-btn {
  position: fixed;
  bottom: 80px;
  width: 100%;
  text-align: center;
  .btn-span {
    margin: 0 auto;
    display: inline-flex;
    align-items: center;
    width: 280px;
    height: 88px;
    background: linear-gradient(270deg, #5fca70 0%, #30B544 100%);
    border-radius: 44px;
    color: #fff;
    font-size: 32px;
    justify-content: center;
    .font-bold {
      font-size: 45px;
      height: 88px;
      display: inline-flex;
      align-items: center;
      margin-top: -4px;
      margin-right: 3px;
    }
  }
}
</style>
