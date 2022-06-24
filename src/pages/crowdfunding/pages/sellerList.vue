<template>
  <div class="seller-list">
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
    <!-- 状态说明 goods_status： 1待拼团 2拼团中 3拼团成功 4拼团失败 5待直播 6待公示 7待发货 8已完成 -->
    <div class="data-list">
      <div class="data-item" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
        <p class="end-time">
          <span v-if="+item.goods_status < 3">结束时间：{{item.end_time}}</span>
          <span v-if="item.goods_status >= 3 && item.live_time">直播时间：{{item.live_time ? item.live_time : '未预约'}}</span>
        </p>
        <div class="card-info">
          <div class="card-info-img"><img :src="item.cover" alt=""></div>
          <div class="card-content">
            <div class="shop-title">
              <div class="text">{{item.title}}</div>
            </div>
            <div class="percent-father">
              <div class="percent-son" :style="'right:' + ((item.stock)/item.total_count*100) + '%'"></div>
              <!-- <div class="percent-son" :style="'right:90%'"></div> -->
              <span class="percent-num">余{{item.stock}}/共{{item.total_count}}</span>
            </div>
            <div class="card-status"><span :style="'background:' + item.color">{{item.goods_status_desc}}</span></div>
          </div>
        </div>
        <div class="card-money">
          <div class="card-money-dom">金额 <span class="money-active">￥<span class="money-num">{{item.price}}</span></span></div>
          <div class="card-right-btn">
            <span  v-if="+item.goods_status <= 4" class="btn-info gray-info">查看拼团详情</span>
            <span v-if="item.goods_status >= 3 && !item.if_reserve_live" class="btn-info blue-info" @click.stop.prevent="liveTimeClick(item.goods_no)">预约直播</span>
            <span v-if="item.goods_status >= 3 && item.goods_status < 6 && item.goods_status != 4 && item.if_reserve_live" class="btn-info blue-info" @click.stop.prevent="liveToast()">去直播</span>
            <span v-if="item.goods_status == 6" @click.stop.prevent="goSetCardReport(item.goods_no)" class="btn-info orange-info">填写拆卡报告</span>
            <span v-if="item.goods_status == 7" class="btn-info orange-info">去发货</span>
            <span v-if="item.goods_status == 8" class="btn-info gray-info">查看订单</span>
          </div>
        </div>
      </div>
    </div>
    </van-list>
  </van-pull-refresh>
   <van-popup class="live-pop-choose" v-model="chooseLiveTime" :round="false" position="bottom">
      <div class="live-dqd-info">
        <van-field v-model="dqdName" label="懂球帝昵称" placeholder="请填写懂球帝昵称" />
      </div>
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="预约直播"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmLiveTime"
        @cancel="chooseLiveTime = false"
      >
      </van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css';
import miment from 'miment';
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
      chooseLiveTime: false,
      currentDate: new Date(),
      minDate: new Date(),
      maxDate: new Date(2030, 1, 1),
      dqdName: '',
      currentGoods: ''
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
    liveTimeClick (no) {
      this.chooseLiveTime = true;
      this.currentGoods = no;
    },
    // 预约直播
    onConfirmLiveTime (value) {
      if (!this.dqdName) {
        this.$toast('请填写您的懂球帝昵称');
        return;
      }
      if (!value) {
        this.$toast('请选择您的直播时间');
        return;
      }
      let time = miment(this.currentDate).format('YYYY-MM-DD hh:mm');
      let params = {
        dqd_username: this.dqdName,
        reserve_time: time,
        goods_no: this.currentGoods
      };
      this.$axios_goods.post('/goods/reserveLive', params).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.$toast('预约成功！已将直播时间通知给拼团用户，请按时开播。');
          this.onRefresh();
          this.chooseLiveTime = false;
        } else {
          this.$toast(data.message);
        }
      });
    },
    liveToast () {
      this.$toast('请您按照预约时间去直播');
    },
    goSetCardReport (no) {
      location.href = `${location.origin}/webapp/crowdfunding.html#/setOpenCardReport?goods_no=${no}`;
    },
    goDetail (item) {
      if (+item.goods_status < 7) {
        location.href = `${location.origin}/webapp/crowdfunding.html#/goodsDetail?goods_no=${item.goods_no}`;
      } else {
        let tab = +item.goods_status === 7 ? 1 : 4;
        location.href = `${location.origin}/webapp/crowdfunding.html#/orderCollection?goods_no=${item.goods_no}&tab=${tab}`;
      }
    },
    getTablist () {
      this.$axios_passport.get(`/user/groupPurchasingSellerTab`).then((res) => {
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
      url = this.next ? this.next : `/user/myShop?value=${this.activeTab}`;
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
.seller-list {
  color: #222;
  background: #F1F3F4;
  height: 100vh;
  width: 100%;
  font-size: 24px;
  .van-pull-refresh {
    min-height: calc(~"100vh - 100px");
    background: #f1f3f4;
  }
  .live-pop-choose {
    .live-dqd-info {
      position: absolute;
      top: 80px;
      z-index: 2999;
      width: 100%;
      border-bottom: 2px solid #F1F3F4;
      .van-field__label {
        font-size: 28px;
      }
    }
    .van-picker__toolbar {
      margin-bottom: 100px;
    }
  }
  .van-pull-refresh {
    background: #F1F3F4;
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
.seller-list {
  .data-list {
    background: #F1F3F4;
    .data-item {
      background: #fff;
      margin-top: 10px;
      padding: 0 30px;
      .end-time {
        color: #FF5307;
        font-size: 24px;
        padding-top: 18px;
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
          .percent-father {
            background: #2D2F32;
            color: #fff;
            position: relative;
            width: 300px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            font-size: 22px;
            overflow: hidden;
            box-sizing: border-box;
            margin: 10px 0;
            .percent-son {
                background: #FF5307;
                position: absolute;
                right:100%;
                display: block;
                z-index: 10;
                width: 300px;
                height: 28px;
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
            padding: 14px 24px;
            margin-left: 10px;
          }
          .gray-info {
            border: 5px solid #F1F3F4;
            background: #fff;
            color: #2D2F32;
            box-sizing: border-box;
            padding: 12px 24px;
          }
          .blue-info {
            background: #43A9FD;
          }
        }
      }
    }
  }
}
</style>