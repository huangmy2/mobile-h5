<template>
  <div class="card-list">
    <van-sticky>
      <div class="cate-tab">
        <span :class="activeTab == item.value ? 'active' : ''" v-for="item in cateList" :key="item.value" @click="changeTab(item.value)">{{item.label}}</span>
      </div>
    </van-sticky>
    <div class="feed-dom">
      <List v-if="activeTab || activeTab === 0" :goods="sortCurrentIndex" :tag="activeTab"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import List from '../components/list.vue';
import 'swiper/dist/css/swiper.css';

export default {
  data () {
    return {
      sortCurrentIndex: {},
      cateList: [{
        name: '全部',
        value: 0
      }, {
        name: '足球',
        value: 1
      }, {
        name: '篮球',
        value: 2
      }, {
        name: '其他',
        value: 3
      }],
      activeTab: ''
    };
  },
  computed: {...mapState(['userInfo'])},
  created () {
  },
  mounted() {
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'cardList'
      }]
    });
    if (this.$route.query && this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    }
    this.getCate();
  },
  methods: {
    changeTab(value) {
      this.activeTab = value;
      this.$router.replace({
        query: {
          tab: value
        }
      });
    },
    getCurrentUser () {
      this.$axios_passport.get(`/user/info`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.$store.commit('getUserInfo', data.data);
        }
      });
    },
    getCate () {
      this.$axios_goods.get(`/goods/getCategoryList`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.cateList = data.data;
          this.activeTab = this.activeTab ? this.activeTab : data.data[0].value;
          console.log(data.data);
        }
      });
    }
  },
  components: {
    swiper, swiperSlide, List
  }
};
</script>

<style lang="less">
.card-list {
  color: #222;
  background: #F1F3F4;
  height: 100vh;
  width: 100%;
  font-size: 24px;
  .van-pull-refresh {
    min-height: calc(~"100vh - 100px");
    background: #f1f3f4;
  }
  .feed-dom {
    background: #F1F3F4;
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
}
</style>