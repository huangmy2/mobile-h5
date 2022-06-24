<template>
  <div class="order-collection">
    <div class="goods-detail" v-if="collectData">
    <div class="card-info">
        <div class="flex-dom card-price">
            金额  <span class="price-detail">￥<label>{{collectData.price}}</label></span>
            <span class="see-goods" @click="seeGoodsDetail">查看拼团</span>
        </div>
        <div class="flex-dom card-span"><span>商品编号：{{collectData.goods_no}}</span></div>
        <p class="card-title">{{collectData.title}}</p>
        <p class="cate-list"><span>{{collectData.subtitle}}</span></p>
        <div class="plugin-list">
            <div class="plugin-item"><p>{{collectData.group_purchasing_type}}</p>玩法</div>
            <div class="plugin-item"><p>{{collectData.product_standard}}</p>规格</div>
            <div class="plugin-item"><p>{{collectData.product_configuration}}</p><div class="goods-plugin" @click="showGoodsDetail = true">商品配置<img src="../assets/help.png" alt=""></div></div>
        </div>
    </div>
    <div class="together-percent">
        <p class="together-title">
          <span class="title">拼团进度</span>
          <span v-if="collectData.goods_status == 3">拼团成功</span>
          <span v-else>余{{collectData.stock}}/共{{collectData.total_count}}</span>
        </p>
        <div class="together-percent-hand">
        <div class="together-percent-son" :style="'left: 0%;width:' + ((collectData.total_count - collectData.stock)/collectData.total_count)*100 + '%'"></div>
        <span class="together-percent-num" :style="'right:' + (collectData.stock/collectData.total_count)*96 + '%'">{{collectData.total_count - collectData.stock}}</span>
        </div>
    </div>
    </div>
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
        <div class="data-list">
        <div class="data-item" v-for="(item, index) in dataList" :key="index" @click="goSellerOrder(item.order_no)">
            <p class="end-time"><span class="seller-info"><img :src="item.avatar" alt="">{{item.username}}</span></p>
            <div class="card-info">
            <div class="card-info-img"><img :src="item.cover" alt=""></div>
            <div class="card-content">
                <div class="shop-title">
                <div class="text">{{item.title}}</div>
                </div>
                <div class="amount">数量 {{item.amount}}</div>
                <div class="card-status"><span :style="'background:' + item.color">{{item.goods_status_desc}}</span></div>
            </div>
            </div>
            <div class="card-money">
              <div class="card-money-dom">金额 <span class="money-active">￥<span class="money-num">{{item.price}}</span></span></div>
              <div class="card-right-btn">
                <span class="btn-info" v-if="item.goods_status > 2" @click.stop.prevent="seeWms(item.order_no)">查看物流</span>
                <span class="btn-info" v-if="item.goods_status == 2" @click.stop.prevent="sellerGo(item.order_no)">去发货</span>
              </div>
            </div>
        </div>
        </div>
        </van-list>
    </van-pull-refresh>
    <van-action-sheet v-model="showGoodsDetail" title="商品配置信息" :round="false">
      <div class="sheet-content" v-if="collectData && collectData.configuration">
        <p class="normal-content" v-html="collectData.configuration"></p>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
import 'swiper/dist/css/swiper.css';
import skeleton from '../components/skeleton.vue';

export default {
  data () {
    return {
      refreshing: false,
      timestamp: '',
      sellerInfo: null,
      goods_no: _getQuery('goods_no') || '',
      defaultAvatar: 'https://img1.qunliao.info/fastdfs5/M00/76/FF/rB8CCmEbIfmADVmrAAANFYGX3Hw504.png',
      userInfo: null,
      cateList: [],
      activeTab: 1,
      dataList: [],
      finished: false,
      loading: false,
      collectData: null,
      showGoodsDetail: false
    };
  },
  created () {
    this.getTablist();
  },
  components: {
    skeleton
  },
  mounted() {
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    if (this.$route.query && this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    }
    this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
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
    goSellerOrder (no) {
      this.$router.push({
        name: 'sellerOrder',
        query: {order_no: no}
      });
    },
    seeGoodsDetail() {
      this.$router.push({
        name: 'goodsDetail',
        query: {goods_no: this.collectData.goods_no}
      });
    },
    // 卖家去发货
    seeWms (no) {
      this.$router.push({
        name: 'wms',
        query: {order_no: no}
      });
    },
    // 卖家去发货
    sellerGo (no) {
      this.$router.push({
        name: 'chooseExpress',
        query: {order_no: no}
      });
    },
    changeActiveTab (value) {
      this.activeTab = value;
      this.onRefresh();
    },
    getTablist () {
      this.$axios_passport.get(`/user/myShopOrderListTab`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.cateList = data.data;
          this.activeTab = this.activeTab ? this.activeTab : data.data[0].value;
        }
        console.log(data);
      });
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
      url = this.next ? this.next : `/user/myShopOrderList?goods_no=${this.goods_no}&value=${this.activeTab}`;
      this.$axios_passport.get(url).then((res) => {
        let data = res.data;
        if (data.code === 0 && data.data) {
          this.collectData = data.data;
          if ((this.next !== data.data.next_url) && data.data.list) {
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
.order-collection {
  color: #2D2F32;
  .sheet-content {
    padding: 10px 30px 50px 30px;
    font-size: 28px;
    p {
      margin: 20px 0;
      line-height: 48px;
    }
  }
  .goods-detail {
    margin-bottom: 10px;
    .card-info {
        background: #fff;
        padding: 34px;
        .card-header-info {
          display: flex;
          .live-info {
            width: 200px;
            height: 112px;
            border-radius: 16px;
            border: 1px solid #FFFFFF;
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
            box-shadow: 2px 2px 16px #abaaaa;
            margin-top: 15px;
            .live-img {
              width: 200px;
            }
            .live-text {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 112px;
              background: rgba(0, 0, 0, 0.5);
              z-index: 20;
              color: #fff;
              text-align: center;
              img {
                width: 40px;
                margin-top: 16px;
              }
            }
          }
        }
        .card-span {
            color: #999EA2;
            font-size: 28px;
        }
        .card-price {
            font-size: 30px;
            position: relative;
            margin-bottom: 10px;
            .see-goods{
                width: 190px;
                height: 68px;
                line-height: 68px;
                text-align: center;
                font-size: 28px;
                border-radius: 56px;
                color: #333;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 5px solid #F1F3F4;
                box-sizing: border-box;
            }
            .price-detail {
                color: #FF0101;
                font-size: 56px; 
                margin-left: 10px;
            }
            .see-goods {
              position: absolute;
              right: 0;
            }
        }
        .before-timer {
            color: #419bfc
        }
        .card-title {
            font-size: 34px;
            user-select:text;
            margin: 10px auto 0;
            font-weight: bold;
        }
        .cate-list {
          color: #999;
          padding: 10px 0 0 0;
          span {
            margin-right: 10px;
            font-size: 28px;
          }
        }
        .plugin-list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #F1F3F4;
          .plugin-item {
            text-align: center;
            color: #999;
            font-size: 24px;
            p {
              color: #2D2F32;
              font-size: 28px;
              font-weight: bold;
            }
            .goods-plugin {
              display: flex;
              align-items: center;
              img {
                width: 26px;
                height: 26px;
                margin-left: 8px;
              }
            }
          }
        }
    }
    .card-timer {
        display: block;
        margin: 15px 0 20px;
        font-size: 24px;
        .clock-icon{
          width: 22px;
          position: relative;
          top: 3px;
          margin-right: 8px;
        }
    }
    .card-timestamp {
      background: #FF5307;
      color: #fff;
      display: flex;
      position: relative;
      height: 120px;
      .card-money {
        display: inline-flex;
        align-items: center;
        .together-logo {
          background: #CC4444;
          height: 90px;
          width: 90px;
          border-radius: 8px;
          font-size: 28px;
          padding: 16px;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 24px;
          line-height: 30px;
        }
        .price-now {
          font-size: 48px;
        }
      }
      .card-time {
        background: #FF8507;
        position: absolute;
        right: 0;
        height: 120px;
        width: 220px;
        font-size: 24px;
        color: #fbcd9c;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 38px;
        .time-introduce {
          color: #fff;
          font-size: 28px;
        }
      }
    }
    .together-percent {
      background: #fff;
      padding: 0 30px 20px 30px;
      border-top: 2px solid #F1F3F4;
      .together-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        color: #666;
        .title {
          font-size: 32px;
          font-weight: bold;
          color: #2D2F32;
        }
      }
      .together-percent-hand {
        background: #2D2F32;
        color: #fff;
        position: relative;
        width: 100%;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 12px;
        font-size: 22px;
        box-sizing: border-box;
        margin: 10px 0;
        .together-percent-son {
            background: #FF5307;
            position: absolute;
            right:100%;
            display: block;
            z-index: 10;
            height: 12px;
            border-radius: 40px;
            box-sizing: border-box;
        }
        .together-percent-num {
            position: absolute;
            z-index: 20;
            background: #FF5307;
            display: inline-block;
            padding: 2px 10px;
            border-radius: 20px;
            border: 2px solid #fff;
        }
      }
    }
    .flex-dom {
        display: flex;
        align-items: center;
    }
  }
  .data-list {
    .data-item {
      background: #fff;
      margin-top: 10px;
      padding: 0 30px;
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
            .goods-num {
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
            margin: 10px 0;
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
          .amount {
            font-size: 24px;
            margin-top: 8px;
            color: #666;
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
            padding: 14px 24px;
            margin-left: 20px;
          }
          .red-info {
            background: #FF0101;
          }
          .green-info {
            background: #30B544;
          }
        }
      }
    }
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
  .van-action-sheet__header {
    border-bottom: 2px solid #F1F3F4;
  }
}
</style>