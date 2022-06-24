<template>
  <div class="buyer-list">
    <van-sticky>
      <div class="cate-tab">
        <span :class="activeTab == item.value ? 'active' : ''" v-for="item in cateList" :key="item.value" @click="changeActiveTab(item.value)">{{item.name}}</span>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
    <!-- 状态说明 order_status： 1待支付 2待发货 3待收货 4已完成 5已退款 6已付款（未中卡）7已取消 -->
    <div class="data-list">
      <div class="data-item" v-for="(item, index) in dataList" :key="index" @click="goOrderDetail(item.order_no)">
        <div class="end-time">
          <span class="seller-info"><img :src="item.avatar" alt="">{{item.username}}</span>
          <span v-if="+item.group_purchasing_status < 3">结束时间：{{item.end_time}}</span>
          <span v-if="+item.group_purchasing_status == 3 && item.live_time">直播时间：{{item.live_time || '未预约'}}</span>
        </div>
        <div class="card-info">
          <div class="card-info-img"><img :src="item.pic_url" alt=""></div>
          <div class="card-content">
            <div class="shop-title">
              <div class="text">{{item.title}}</div>
            </div>
            <div class="order-percent-dom">
              <div class="percent-father" v-if="item.order_status != 3 && item.order_status != 4">
                <div class="percent-son" :style="'right:' + ((item.stock)/item.total_count*100) + '%'"></div>
                <!-- <div class="percent-son" :style="'right:90%'"></div> -->
                <span class="percent-num">余{{item.stock}}/共{{item.total_count}}</span>
              </div>
              <span class="goods-num">数量 {{item.goods_amount}}</span>
            </div>
            <div class="card-status"><span :style="'background:' + item.color">{{item.order_status_desc}}</span></div>
          </div>
        </div>
        <div class="card-money">
          <div class="card-money-dom">金额 <span class="money-active">￥<span class="money-num">{{item.price}}</span></span></div>
          <div class="card-right-btn">
            <span v-if="item.order_status == 1" class="btn-info" @click.stop.prevent="goPay(item.order_no)">去付款</span>
            <span v-if="item.if_in_live" class="btn-info green-info">观看拆卡</span>
            <span v-if="item.order_status == 3 || item.order_status == 4" class="btn-info gary-info" @click.stop.prevent="seeWms(item.order_no)">查看物流</span>
            <span v-if="item.order_status == 4" class="btn-info gary-info" @click.stop.prevent="goFeedback(item.order_no)">申请售后</span>
            <span v-if="item.if_have_report" class="btn-info" @click.stop.prevent="goCardReport(item.goods_no)">拆卡报告</span>
            <span v-if="item.order_status == 3" class="btn-info red-info" @click.stop.prevent="showReceive = true;receiveOrder = item.order_no">确认收货</span>
          </div>
        </div>
      </div>
    </div>
    </van-list>
  </van-pull-refresh>
  <van-dialog v-model="showReceive" :closeOnClickOverlay="true" theme='round-button' :showConfirmButton="false">
    <div class="dialog-dom">
      <p class="title">确认收货后将无法退款，请认真检查</p>
      <p>
        <span class="apply-btn i-know apply-als" @click="showReceive=false">我再想想</span>
        <span  class="apply-btn i-know" @click="confirmDesc">确认收货</span>
      </p>
    </div>
  </van-dialog>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css';

export default {
  data () {
    return {
      sortCurrentIndex: {},
      cateList: [],
      activeTab: 1,
      loading: false,
      finished: false,
      refreshing: false,
      dataList: [],
      userInfo: null,
      showReceive: false,
      receiveOrder: ''
    };
  },
  created () {
    this.getTablist();
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
    if (this.$route.query && this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    }
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'index'
      }]
    });
  },
  methods: {
    seeWms (order) {
      this.$router.push({
        name: 'wms',
        query: {order_no: order}
      });
    },
    goFeedback (order) {
      this.$router.push({
        name: 'feedback',
        query: {order_no: order}
      });
    },
    goCardReport (no) {
      location.href = `${location.origin}/webapp/crowdfunding.html#/openCardReport?goods_no=${no}`;
    },
    goPay (id) {
      location.href = `${location.origin}/webapp/crowdfunding.html#/pay?order_no=${id}`;
    },
    goOrderDetail (id) {
      location.href = `${location.origin}/webapp/crowdfunding.html#/buyerOrder?order_no=${id}`;
    },
    getTablist () {
      this.$axios_passport.get(`/user/myOrderTab`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.cateList = data.data;
          this.activeTab = this.activeTab ? this.activeTab : data.data[0].value;
        }
        console.log(data);
      });
    },
    changeActiveTab (value) {
      this.activeTab = value;
      this.$router.replace({
        query: {
          tab: value
        }
      });
      this.onRefresh();
    },
    // 确认收货事件
    confirmDesc () {
      let params = {order_no: this.receiveOrder};
      this.$axios_orders.post(`/orders/groupPurchasingConfirmOrder`, params).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.$toast('确认收货成功');
          this.onRefresh();
          this.$forceUpdate();
        } else {
          this.$toast(data.message);
        }
      });
      this.showReceive = false;
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false;
      this.dataList = [];
      this.next = '';
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    onLoad () {
      if (!this.userInfo || !this.userInfo.user_no) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      if (this.refreshing) {
        this.dataList = [];
        this.refreshing = false;
      }
      let url;
      url = this.next ? this.next : `/user/myOrder?value=${this.activeTab}`;
      this.$axios_passport.get(url).then((res) => {
        let data = res.data;
        if (data.code === 0 && data.data && data.data.list) {
          if (this.next !== data.data.next_url) {
            this.dataList = this.dataList.concat(data.data.list);
            this.next = data.data.next_url;
          }
        }
        // 数据全部加载完成
        this.loading = false;
        if (data.code !== 0 || !data.data.list || !data.data.list.length) {
          this.finished = true;
        }
      });
    }
  }
};
</script>

<style lang="less">
.buyer-list {
  color: #222;
  background: #F1F3F4;
  height: 100vh;
  width: 100%;
  font-size: 24px;
  .van-pull-refresh {
    min-height: calc(~"100vh - 100px");
    background: #f1f3f4;
  }
  .cate-tab {
    background: #fff;
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;
    span {
      font-size: 28px;
    }
    .active {
      color: #30B544;
      font-weight: bold;
      position: relative;
    }
    .active:after {
      position: absolute;
      content:" ";
      bottom: -24px;
      width: 100%;
      left: 0;
      height: 5px;
      border-radius: 2px;
      background: #30B544;
    }
  }
}
.buyer-list {
  .data-list {
    background: #F1F3F4;
    .data-item {
      background: #fff;
      margin-top: 10px;
      padding: 0 28px;
      .end-time {
        width: 100%;
        color: #FF5307;
        font-size: 24px;
        padding-top: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        .seller-info {
          color: #2D2F32;
          display: inline-flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin-right: 8px
          }
        }
      }
      .card-info {
        border-bottom: 2px solid #F1F3F4;
        display: flex;
        align-items: center;
        padding: 24px 0;
        .card-info-img {
          display: inline-block;
          width: 200px;
          height: 200px;
          background: #F1F3F4;
          overflow: hidden;
          margin-right: 20px;
          position: relative;
          flex-shrink: 0;
          img {
              min-width: 200px;
              min-height:200px;
              max-height: 300px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
          }
        }
        .card-content {
          .order-percent-dom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            height: 46px;
            .goods-num {
              position: absolute;
              right: 0;
              color: #666666;
            }
          }
          .percent-father {
            background: #2D2F32;
            color: #fff;
            position: relative;
            width: 300px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            font-size: 22px;
            overflow: hidden;
            box-sizing: border-box;
            .percent-son {
                background: #FF5307;
                position: absolute;
                right:100%;
                display: block;
                z-index: 10;
                width: 300px;
                height: 30px;
                border-radius: 40px;
                box-sizing: border-box;
            }
            .percent-num {
                position: relative;
                z-index: 20;
            }
          }
          .shop-title {
              font-size: 28px;
              height: 80px;
              line-height: 40px;
              overflow: hidden;
              position: relative;
          }
          .shop-title .text {
              float: right;
              margin-left: -5px;
              width: 100%;
              word-break: break-all;
          }
          .shop-title::before {
              float: left;
              width: 5px;
              content: '';
              height: 80px;
          }
          .shop-title::after {
              float: right;
              content: "...";
              height: 40px;
              line-height: 40px;
              width: 2em;
              margin-left: -2em;
              text-align: right;
              position: relative;
              left: 100%;
              top: -40px;
              padding-right:5px;
              background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), to(white), color-stop(50%, white));
              background: -moz-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
              background: -o-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
              background: -ms-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
              background: linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
          }
          .card-status {
            span {
              display: inline-block;
              background: #30B544;
              color: #fff;
              border-radius: 40px;
              padding: 4px 20px;
              margin-top: 20px;
            }
          }
        }
      }
      .card-money {
        font-size: 28px;
        padding: 18px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .card-money-dom {
          display: flex;
          align-items: center;
        }
        .money-active {
          color: #FF5307;
          display: flex;
          align-items: center;
          margin-left: 8px;
        }
        .money-num {
          font-size: 38px;
        }
        .card-right-btn {
          .btn-info {
            background: #FF5307;
            color: #fff;
            border-radius: 40px;
            display: inline-block;
            padding: 14px 22px;
          }
          .red-info {
            background: #FF0101;
          }
          .green-info {
            background: #30B544;
          }
          .gary-info {
            background: #fff;
            border: 5px solid #F1F3F4;
            color: #2D2F32;
            padding: 11px 22px;
          }
        }
      }
    }
  }
}
</style>