<template>
  <div class="card-secret">
    <van-sticky>
      <div class="cate-tab">
        <span :class="activeTab == item.value ? 'active' : ''" v-for="item in tabList" :key="item.value" @click="changeActiveTab(item.value)">{{item.name}}</span>
      </div>
    </van-sticky>
    <div class="list-wrap">
      <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad" :offset="100">
        <div class="tab-current" v-if="activeTab===1">
          <template v-if="orderCardList&&orderCardList[0]&&orderCardList[0].secret_list">
            <div class="order-item-wrap" v-for="(elem,index) in orderCardList">
              <div class="order-item" v-for="(e,i) in elem.secret_list">
                <span>{{e.secret}}</span>
                <b class="get-card-icon" v-if="e.if_select">中卡</b>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="no-data">暂无数据</div>
          </template>
        </div>
        <div class="tab-other" v-else-if="activeTab===2">
          <template v-if="orderCardList&&orderCardList.length">
            <div class="order-item-wrap" v-for="(elem,index) in orderCardList">
              <p class="order-num">订单号：{{elem.order_no}}</p>
              <div class="order-item" v-for="(e,i) in elem.secret_list">
                <span>{{e.secret}}</span>
                <b class="get-card-icon" v-if="e.if_select">中卡</b>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="no-data">暂无数据</div>
          </template>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabList: [
        {
          name: '当前订单',
          value: 1
        },
        {
          name: '其他订单',
          value: 2
        }
      ],
      firstClick: true,
      loading: false,
      finished: false,
      nextUrl: '',
      orderNumber: '', // 当前订单号，从url或者router中获取 todo
      activeTab: 1,
      orderCardList: [] // 当前订单列表数据
    };
  },
  created() {
    this.getOrderNumber();
    this.getNextUrl();
  },
  mounted() {
    const { aplus_queue } = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [
        {
          is_auto: false
        },
        {
          type: 'pv',
          page: 'myCardSecret'
        }
      ]
    });
  },
  methods: {
    changeActiveTab(value) {
      console.log('val', value);
      this.activeTab = value;
      this.orderCardList = [];
      this.finished = false;
      this.getNextUrl();
      this.getSecretList('init');
      this.loading = true;
    },
    getOrderNumber() {
      // 获取订单号 orderNum 查看上级页面传参字段是否相同 todo
      this.orderNumber =
        this.$route && this.$route.query && this.$route.query.order_no;
      console.log('order_no', this.orderNumber);
    },
    getNextUrl() {
      this.nextUrl = `/orders/getSecretList?order_no=${this.orderNumber}&value=${this.activeTab}`;
    },
    onLoad() {
      this.getSecretList();
    },
    getSecretList(type) {
      this.$axios_orders.get(this.nextUrl).then(res => {
        // tab分类1当前订单2其他订单
        let data = res.data;
        this.loading = false;
        if (data.code === 0) {
          if (data.data.list && data.data.list.length) {
            if (type === 'init') {
              this.orderCardList = data.data.list;
            } else {
              this.orderCardList = [...this.orderCardList, ...data.data.list];
            }
          }
          if (data.data && data.data.next_url) {
            this.nextUrl = data.data.next_url;
            this.finished = false;
          } else {
            this.nextUrl = '';
            this.finished = true;
          }
        } else {
          this.$toast(data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.card-secret {
  .cate-tab {
    background: #fff;
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;
    span {
      font-size: 28px;
      margin: auto;
    }
    .active {
      color: #30b544;
      font-weight: bold;
      position: relative;
    }
    .active:after {
      position: absolute;
      content: " ";
      bottom: -24px;
      width: 70%;
      left: 15%;
      height: 5px;
      border-radius: 2px;
      background: #30b544;
    }
  }
  .tab-current {
    padding: 26px 30px;
    .order-item {
      width: 690px;
      height: 64px;
      line-height: 64px;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      box-sizing: border-box;
      margin-bottom: 10px;
      .get-card-icon {
        width: 82px;
        height: 40px;
        line-height: 40px;
        background: #ff5307;
        border-radius: 8px;
        font-weight: 600;
        color: #ffffff;
        font-size: 24px;
        text-align: center;
      }
    }
  }
  .tab-other {
    padding: 0px 30px;
    .order-item-wrap {
      .order-num {
        font-weight: 400;
        color: #2d2f32;
        line-height: 64px;
        font-size: 28px;
      }
      .order-item {
        width: 690px;
        height: 64px;
        line-height: 64px;
        background: #ffffff;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        box-sizing: border-box;
        margin-bottom: 10px;
        .get-card-icon {
          width: 82px;
          height: 40px;
          line-height: 40px;
          background: #ff5307;
          border-radius: 8px;
          font-weight: 600;
          color: #ffffff;
          font-size: 24px;
          text-align: center;
        }
      }
    }
  }
  .no-data {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    color: #aaa;
  }
}
</style>