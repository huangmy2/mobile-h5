<template>
  <div class="order-result">
    <div class="result-bg">
      <p class="result-text"><img src="../assets/pay-success.png" alt="">支付成功</p>
      <b class="result-tips">您已支付成功，可点击查看订单详情</b>
    </div>
    <p class="btn-wrap">
      <b @click="jumpOrderDetail">订单详情</b>
      <b @click="jumpHome">拼团首页</b>
    </p>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
export default {
  data () {
    return {
      order_no: ''
    };
  },
  mounted () {
    this.order_no = _getQuery('out_trade_no') || this.$route.query.out_trade_no || '';
    this.wxInit();
    this.setHeight();
  },
  methods: {
    setHeight() {
      let mchData = {action: 'onIframeReady', displayStyle: 'SHOW_CUSTOM_PAGE', height: 900};
      let postData = JSON.stringify(mchData);
      parent.postMessage(postData, 'https://payapp.weixin.qq.com');
    },
    wxInit() {
      setTimeout(() => {
        let mchData = {action: 'onIframeReady', displayStyle: 'SHOW_CUSTOM_PAGE'};
        let postData = JSON.stringify(mchData);
        parent.postMessage(postData, 'https://payapp.weixin.qq.com');
      }, 0);
    },
    jumpOrderDetail () {
      let mchData = {action: 'jumpOut', jumpOutUrl: `${location.origin}/webapp/crowdfunding.html#/buyerOrder?order_no=${this.order_no}&order_type=2`};
      let postData = JSON.stringify(mchData);
      parent.postMessage(postData, 'https://payapp.weixin.qq.com');
    },
    jumpHome() {
      let mchData = {action: 'jumpOut', jumpOutUrl: `${location.origin}/webapp/crowdfunding.html`};
      let postData = JSON.stringify(mchData);
      parent.postMessage(postData, 'https://payapp.weixin.qq.com');
    }
  }
};
</script>
<style lang="less">
  .order-result{
    width: 100%;
    height: 100%;
    .result-bg{
      background: linear-gradient(270deg, #15CD88 0%, #00BE8D 100%);
      height: 280px;
      .result-text{
        height: 64px;
        line-height: 64px;
        width: 100%;
        padding-top: 64px;
        text-align: center;
        font-size: 48px;
        font-weight: 600;
        color: #FFFFFF;
        box-sizing: border-box;
        img{
          width: 64px;
          height: 64px;
          position: relative;
          top: 16px;
          margin-right: 10px;
        }
      }
      .result-tips{
        font-size: 28px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 40px;
        text-align: center;
        display: block;
        margin-top: 100px;
      }
    }
    .btn-wrap{
      text-align: center;
      margin-top: 34px;
      b{
        display: inline-block;
        width: 280px;
        height: 88px;
        line-height: 88px;
        background: #30B544;
        border-radius: 44px;
        font-size: 32px;
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
      }
    }
  }
</style>
