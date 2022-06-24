<template>
  <div class="live-list">
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
    <div class="live-data-list">
      <div class="live-data-item" v-for="(item, index) in dataList" :key="index" @click="linkLiveDetail(item.goods_no)">
        <div class="live-cover">
          <img src="https://img-cardmall.qunliao.info/tos-cn-i-zl0uujxxx3/a2a8a847f2da4d378c0fa752c37c95f9~tplv-zl0uujxxx3-thumb:500:500.png" alt="">
          <span class="live-status" :style="'background:' + (item.live_status == 1 ? '#43A9FD' : item.live_status == 2 ? '#30B544' : '#2D2F32')">{{item.live_status_desc}}</span>
          <p class="live-info"><span>{{item.dqd_username}}</span><span>{{item.reserve_time}}</span></p>
        </div>
        <div class="live-title">{{item.title}}</div>
      </div>
    </div>
    </van-list>
  </van-pull-refresh>
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
      userInfo: null
    };
  },
  created () {
    this.getTablist();
  },
  mounted() {
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
    getTablist () {
      this.$axios_goods.get(`/goods/getLiveTab`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.cateList = data.data;
          this.activeTab = data.data[0].value;
        }
        console.log(data);
      });
    },
    changeActiveTab (value) {
      this.activeTab = value;
      this.onRefresh();
    },
    linkLiveDetail (no) {
      location.href = `${location.origin}/webapp/crowdfunding.html#/liveDetail?goods_no=${no}`;
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
      if (this.refreshing) {
        this.dataList = [];
        this.refreshing = false;
      }
      let url;
      url = this.next ? this.next : `/goods/getLiveList?value=${this.activeTab}`;
      this.$axios_goods.get(url).then((res) => {
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
.live-list {
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
    padding: 24px 60px;
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
  .live-data-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 30px;
    .live-data-item {
      width: 49%;
      background: #fff;
      margin-bottom: 16px;
      border-radius: 14px;
      overflow: hidden;
      .live-cover {
        width: 100%;
        height: 190px;
        position: relative;
        overflow: hidden;
        img {
          width: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
        .live-status {
          position: absolute;
          left: 12px;
          top: 12px;
          color: #fff;
          background: #30B544;
          border-radius: 30px;
          padding: 8px 20px;
          display: inline-block;
        }
        .live-info {
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          color: #fff;
          padding: 10px 12px;
          font-size: 22px;
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          background: linear-gradient(180deg, rgba(41, 41, 41, 0) 0%, #2D2F32 100%);;
        }
      }
      .live-title {
        padding: 16px 12px;
        word-break: break-all;
        font-size: 28px;
        max-height: 75px;
        line-height: 42px;
        margin-bottom: 8px;
        overflow: hidden;
      }
    }
  }
}
</style>