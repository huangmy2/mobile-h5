<template>
  <div class="user-center">
    <div class="header-info" v-if="userInfo">
      <img class="avatar" :src="userInfo.avatar" alt="" @click="goUserIndex">
      <span @click="goUserIndex">{{userInfo.name}}</span>
        <!-- <span v-if="messageNum" class="tip-num">{{messageNum}}</span> -->
    </div>
    <div class="my-deal" v-if="userInfo">
      <p class="title">我的订单</p>
      <div class="deal-item">
        <span v-for="item in buyerOrderList" :key="item.value" @click="blankBuyer(item.value)">
          <!-- <span class="red-dot"></span> -->
          <img :src="item.icon" alt="">
          {{item.name}}
        </span>
      </div>
    </div>
    <div class="my-deal" v-if="userInfo && sellerOrderList && sellerOrderList.length">
      <p class="title">我是卖家</p>
      <div class="deal-item deal-item-copy">
        <span v-for="item in sellerOrderList" :key="item.value" @click="blankSeller(item.value)">
          <!-- <span class="red-dot"></span> -->
          <img :src="item.icon" alt="">
          {{item.name}}
        </span>
      </div>
    </div>
    <div v-if="!userInfo">
      <skeleton :height="155"></skeleton>
      <skeleton :height="117"></skeleton>
      <skeleton :height="95"></skeleton>
      <skeleton :height="195"></skeleton>
    </div>
    <div class="my-info" v-if="userInfo">
      <div @click="linkUrl('address')"><img src="../assets/address.png" alt="">地址管理</div>
      <div @click="linkUrl('myGetCard')"><img src="../assets/my-card.png" alt="">我的中卡</div>
      <div @click="linkUrl('commonProblem')"><img src="../assets/help-active.png" alt="">常见问题</div>
      <div @click="linkUrl('feedback')"><img src="../assets/feedback.png" alt="">联系客服</div>
      <div @click="linkUrl('userAgree')"><img src="../assets/useragree.png" alt="">用户协议</div>
    </div>
    <!-- <div class="my-info" v-if="mineInfo">
      <div @click="linkUrl('privacy')"><img src="../assets/prive.png" alt="">隐私协议</div>
      <div @click="linkUrl('cashAgree')"><img src="../assets/apply/help-active.png" alt="">资质与规则</div>
      <div @click="linkUrl('feedback')"><img src="../assets/apply/feedback.png" alt="">用户反馈</div>
    </div> -->
  </div>
</template>

<script>
import skeleton from '../components/skeleton.vue';
export default {
  data () {
    return {
      dotShow: false,
      mineInfo: null,
      messageNum: null,
      fansNum: 0,
      followNum: 0,
      collectNum: 0,
      hidden: '',
      visibilityChange: '',
      userInfo: null,
      buyerOrderList: [],
      sellerOrderList: []
    };
  },
  created () {
    this.getTablist();
  },
  mounted () {
    // this.messageVisibility();
    this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'userCenter'
      }]
    });
  },
  methods: {
    messageVisibility () {
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
      document.addEventListener(this.visibilityChange, this.getMessageNum);
    },
    getMessageNum () {
      if (document.visibilityChange === this.hidden) {
      } else {
        this.getCurrentAlertNum();
      }
    },
    getCurrentAlertNum () {
      this.$axios_orders.get(`/orders/ifHaveWaitForReceiving`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          if (data.data.message_num) {
            this.dotShow = true;
          } else {
            this.dotShow = false;
          }
        }
      });
    },
    blankBuyer (id) {
      // this.$router.push({
      //   name: 'myDeal',
      //   query: {tab: id}
      // });
      location.href = `${location.origin}/webapp/crowdfunding.html#/buyerList?tab=${id}`;
    },
    blankSeller (id) {
      // this.$router.push({
      //   name: 'myDeal',
      //   query: {tab: id}
      // });
      location.href = `${location.origin}/webapp/crowdfunding.html#/sellerList?tab=${id}`;
    },
    goUserIndex () {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['ZCcenterGoUserIndex', 'CLK']
      });
      location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/userIndex?user_id=${this.mineInfo.id}`;
    },
    linkUrl (url) {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['ZCcenterGoWhere' + url, 'CLK']
      });
      location.href = `${location.origin}/webapp/crowdfunding.html#/${url}`;
    },
    getTablist () {
      this.$axios_passport.get(`/user/groupPurchasingBuyerTab`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.buyerOrderList = data.data.buyer;
          this.sellerOrderList = data.data.seller;
        }
        console.log(data);
      });
    }
  },
  components: {
    skeleton
  }
};
</script>
<style lang="less">
.user-center {
  color: #2D2F32;
  .header-info {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 30px;
    position: relative;
    .avatar {
      width: 110px;
      height: 110px;
      border-radius: 50%;
    }
    span {
      font-size: 36px;
      margin-left: 20px;
    }
    .right-tip {
      position: absolute;
      right:44px;
      img {
        width: 44px;
      }
      .tip-num {
        position: absolute;
        right: -17px;
        top: -16px;
        font-size: 24px;
        background: #ee0a24;
        border-radius: 20px;
        padding: 2px 9px;
        line-height: 1;
        color: #fff;
      }
    }
  }
  .index-data {
    background: #fff;
    display: flex;
    height: 110px;
    width: 100%;
    z-index: 10;
    .index-data-item {
      width: 50%;
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      position: relative;
      margin:14px auto;
      .index-point {
        display: flex;
        justify-content: center;
        font-weight: 400;
        font-size: 24px;
        color: #999999;
      }
    }
    .index-item-left:after{
      width: 1px;
      height: 66px;
      background: #D8D8D8;
      position: absolute;
      right: 0;
      top: 12px;
      content: "";
    }
  }
  .my-deal {
    background: #fff;
    padding: 30px;
    margin-top: 10px;
    .title {
      font-size: 34px;
      font-weight: 700;
    }
    .deal-item {
      display: flex;
      padding: 38px 0 0;
      font-size: 28px;
      .red-dot{
        width: 20px;
        height: 20px;
        background: #FF5307;
        position: absolute;
        top: 0px;
        right: 10px;
        border-radius: 50%;
        display: block;
      }
      img {
        height: 45px;
        display: block;
        margin: 0 auto 10px
      }
      span {
        text-align: center;
        position: relative;
        display: inline-block;
        width: 136px;
      }
    }
    .deal-item-copy {
      justify-content: left;
      span {
        // margin-right: 80px;
        display: inline-block;
        width: 136px;
      }
    }
  }
  .my-info {
    margin-top: 10px;
    div {
      padding: 28px 30px;
      background: #fff;
      font-size: 28px;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      img {
        width: 32px;
        margin-right: 20px;
      }
    }
  }
}
</style>
