<template>
  <div class="pay-promise">
      <div class="pay-header">
          <img class="bg-img" src="../assets/promise-bg.png" alt="">
          <p><img src="../assets/promise.png" alt="">等待支付</p>
      </div>
      <div class="pay-content">
        <div class="green-tip"></div>
         <div class="content-bg">
          <div class="shadow"></div>
          <p class="money">￥<span>{{payContent.order_amount}}</span></p>
          <div class="promise-order">
            <p>交易单号：{{orderNo}}</p>
            <p v-if="payContent && payContent.order_amount">剩余时间：{{this.timeOrder || '订单超时'}}</p>
            <p v-else>剩余时间：</p>
          </div>
        </div>
      </div>
      <div class="pay-type">
        <van-radio-group v-model="payType">
          <van-radio icon-size="14px" checked-color="#30B544" name="1"><img src="../assets/wx.png" alt=""> 微信支付</van-radio>
        </van-radio-group>
      </div>
      <div class="bottom-btn-dom">
            <span class="promise-infor">￥<span>{{payContent.order_amount}}</span></span>
            <span class="btn" @click="payMoney()">支付</span>
      </div>
      <resultToast v-if="payError" type="error" title="支付失败" content="支付失败请重新支付">
          <span class="cancleBtn" @click="payError = false">不了，谢谢</span>
          <span class="confirmBtn" @click="payMoney()">重试</span>
      </resultToast>
      <div v-if="loadingPay" class="loading-pay">
        <van-loading size="40px" text-size="18px" color="#fff" vertical>支付中</van-loading>
      </div>
  </div>
</template>

<script>
import resultToast from '../components/resultToast.vue';
export default {
  data () {
    return {
      payType: '1',
      payContent: {},
      payStatus: null,
      payError: false,
      orderNo: '',
      loadingPay: false,
      timer: null,
      timeOrder: '',
      timerBuyer: null,
      hidden: '',
      visibilityChange: '',
      state: '',
      listener: null,
      agreeFile: false,
      payInfo: {}
      // appId: ''
    };
  },
  mounted () {
    this.orderNo = this.$route.query && this.$route.query.order_no; // 获取当前支付数据的唯一参数
    this.getOrderGoods();
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer);
      clearInterval(this.timerBuyer);
      this.timer = null;
    });
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'pay'
      }]
    });
  },
  methods: {
    reloadState () {
      // 添加监听器
      if (typeof document.hidden !== 'undefined') {
        this.hidden = 'hidden';
        this.visibilityChange = 'visibilitychange';
      } else if (typeof document.mozHidden !== 'undefined') {
        this.hidden = 'mozHidden';
        this.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        this.hidden = 'msHidden';
        this.visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        this.hidden = 'webkitHidden';
        this.visibilityChange = 'webkitvisibilitychange';
      }
      document.addEventListener(this.visibilityChange, this.forceUpdate);
    },
    forceUpdate () {
      if (document.visibilityChange === this.hidden) {
      } else {
        this.searchTimer();
      }
    },
    searchTimer() {
      if (this.timer) {
        return;
      }
      if (this.orderNo) {
        let times = 0;
        this.searchPay();
        if (!this.payStatus) {
          this.timer = setInterval(res => {
            times++;
            this.searchPay();
            this.loadingPay = true;
            // 查询支付状态，成功买家则返回上一页，卖家则跳转首页，失败则展示失败原因，重试按钮
            if (this.payStatus && +this.payStatus.order_status === 2) {
              this.$toast.success(this.payStatus.order_status_desc);
              clearInterval(this.timer);
              this.timer = null;
              this.loadingPay = false;

              document.removeEventListener(this.visibilityChange, this.forceUpdate);
              this.$router.go(-1);
            }
            if (this.payStatus && +this.payStatus.order_status === 4) {
              this.payError = true;
              this.loadingPay = false;
              document.removeEventListener(this.visibilityChange, this.forceUpdate);
              this.$toast(this.payStatus.order_status_desc);
              clearInterval(this.timer);
              this.timer = null;
            }
            if (times > 30) {
              this.loadingPay = false;
              this.$toast('未查询到支付状态，请重新支付');
              clearInterval(this.timer);
              this.timer = null;
              document.removeEventListener(this.visibilityChange, this.forceUpdate);
            }
          }, 1000);
        }
      }
    },
    searchPay() {
      this.$axios_orders.get(`/orders/GetOrderStatus?order_type=2&order_no=${this.orderNo}`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.payStatus = data.data;
        }
      });
    },
    getOrderGoods() {
      this.$axios_orders.get(`/goods/getPurchasingGoodsCheckoutPage?order_no=${this.orderNo}`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.payContent = data.data;
          this.timerBuyer = setInterval(() => {
            let current = (new Date()).getTime();
            if (this.payContent.order_deadline > (current / 1000)) {
              this.timeOrder = this.$parent.formatSeconds(this.payContent.order_deadline - (current / 1000));
            } else {
              clearInterval(this.timerBuyer);
            }
          }, 1000);
        }
      });
    },
    payMoney () {
      console.log(this.agreeFile);
      const {aplus_queue} = window;
      let params;
      let url;
      this.payError = false;
      this.payStatus = null;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['userPayOrder', 'CLK']
      });
      params = {
        pay_type: 2,
        order_no: this.orderNo
      };
      url = '/orders/payCrowdFundingGoods';
      this.$axios_orders.post(url, params).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          console.log('data', data.data);
          this.payInfo = data.data;
          this.jsapiPay();
        } else {
          this.$toast(data.message);
        }
      });
    },
    jsapiPay () { // JSAPI支付
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
      } else {
        this.onBridgeReady();
      }
    },
    onBridgeReady() { // this.payInfo中包含jsapi支付各种信息
      let info = this.payInfo;
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          'appId': 'wxd310655463f46282',     // 公众号ID，由商户传入
          'timeStamp': '' + info.time_stamp,         // 时间戳，自1970年以来的秒数
          'nonceStr': info.nonce_str, // 随机串
          'package': info.prepay_id,
          'signType': 'RSA',         // 微信签名方式：
          'paySign': info.pay_sign // 微信签名
        },
        function(res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') { // 支付成功
          }
          if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 支付过程中用户取消
          }
          if (res.err_msg === 'get_brand_wcpay_request:fail') { // 支付失败
          }
        }
      );
    }
  },
  components: {
    resultToast
  }
};
</script>
<style lang="less">
.pay-promise {
  width: 100%;
  color: #2C2B2B;
  .loading-pay {
    background: rgba(0,0,0,.4);
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    text-align: center;
    padding-top: 47%;
    z-index: 100;
  }
  .pay-header {
    height: 280px;
    width: 100%;
    background: linear-gradient(270deg, #15CD88 0%, #00BE8D 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .bg-img {
      position: absolute;
      width: 280px;
      right: 0;
      top: 20px;
    }
    p {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 48px;
      font-weight: 600;
      img {
        width: 54px;
        height: 64px;
        margin-right: 20px;
      }
    }
  }
  .pay-content {
    width: 650px;
    margin: -40px auto 0;
    position: relative;
    box-sizing: border-box;
    z-index: 5;
    .green-tip {
      position: absolute;
      height: 20px;
      width:100%;
      top: -10px;
      left:-10px;
      background: #0E8F6D;
      border-radius: 10px;
      padding: 0 10px;
      z-index: 8;
    }
    .content-bg {
      padding: 36px;
      background: #fff;
      z-index: 10;
      position: relative;
      border-radius: 2px;
      .shadow {
        position: absolute;
        top: 0;
        left: 0;
        width:100%;
        height: 20px;
        background: linear-gradient(360deg, #FFFFFF 0%, #00BE8D 100%);
        opacity: 0.48;
      }
      .money {
        border-bottom: 2px dashed #F1F3F4;
        color: #FF5307;
        font-size: 32px;
        text-align: center;
        padding-bottom: 10px;
        line-height: 60px;
        span {
          font-size: 60px;
        }
        .jiaona {
          font-size: 24px;
          color: #999EA2;
        }
      }
      .promise-title {
        font-size: 32px;
        text-align: center;
        margin: 25px auto;
      }
      .promise-test {
        font-size: 28px;
        p{
          display: flex;
          margin-bottom: 20px;
          img {
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            margin-right: 8px;
            margin-top: 5px;
          }
          a {
            color: #4c8bf4;
          }
        }
      }
      .promise-table {
        width: 100%;
        // border: 1px solid #999EA2;
        table {
          width: 100%;
          font-size: 24px;
          border-top: 1px solid #999EA2;
          border-left: 1px solid #999EA2;
          tr {
            border-bottom: 1px solid #999EA2;
          }
          th {
            background: #F1F3F4;
            color: #999;
          }
          td,th {
            text-align: center;
            padding: 8px;
            border-right: 1px solid #999EA2;
          }
        }
      }
      .promise-order {
        margin-top: 30px;
        font-size: 28px;
        line-height: 54px;
        color: #2C2B2B;
        p {
          white-space: nowrap;
        }
      }
    }
  }
  .pay-type {
    background: #fff;
    margin-top: 44px;
    .van-radio {
      padding: 20px 40px;
    }
    .van-radio__label {
      display: flex;
      align-items: center;
      font-size: 32px;
      img {
        width:52px;
        margin-right: 20px;
      }
    }
  }
  .bottom-btn-dom .promise-infor {
    position: absolute;
    left: 34px;
    color: #FF5307;
    font-size: 28px;
    span {
      font-size: 36px;
    }
  }
}
</style>
