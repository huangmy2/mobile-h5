<template>
    <div class="trading-card-index">
        <div v-if="source != 'top'" class="header">
          <div class="banner" v-if="bannerList && bannerList.length">
            <van-swipe class="my-swipe" :autoplay="2000" indicator-color="white" :touchable="isIOS ? true : false">
              <van-swipe-item v-for="(item, index) in bannerList" class="swiper-img" :key="index">
                <img  @click="jumpUrl(item.jump_url)" :src="item.img_url" alt="">
              </van-swipe-item>
            </van-swipe>
          </div>
          <van-sticky v-if="vajraArr&&vajraArr.length">
            <div class="vajra">
                <span v-for="elem,index in vajraArr" @click="jumpLoc(elem)"><img :src="elem.icon"/>{{elem.name}} <em class="message-num" v-if="elem.type === 'message' && messageNum">{{messageNum}}</em></span>
            </div>
           </van-sticky>
        </div>
        <keep-alive>
            <div class="feed-dom">
              <List :goods="sortCurrentIndex"/>
            </div>
        </keep-alive>
    </div>
</template>

<script>
import browers from 'src/utils/browers.js';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import List from '../components/list.vue';
import 'swiper/dist/css/swiper.css';
import { _getQuery } from 'src/utils/tool.js';

export default {
  data () {
    return {
      filterList: [],
      sortPopShow: false,
      filterPopShow: false,
      vajraApi: '/user/getHomepageTabList', // 金刚位api接口地址
      messageNum: 0, // 消息提示数量
      sellerInfo: {},
      showSeller: false,
      showStatus: false,
      showUpload: false,
      vajraArr: [],
      isIOS: browers.iOS,
      data: [],
      searchshow: false,
      activeTab: '',
      queryTab: _getQuery('tab'),
      showResult: false,
      searchKeywords: '',
      searchHistory: [],
      tab: [],
      hisData: [],
      selectSort: [], // 拍卖模式首页搜索项
      bargainSelectList: [], // 一口价模式首页搜索项，删除智能排序
      currentIndexSortList: [],
      activeSort: {value: 0},
      showSort: false,
      goodsList: [],
      source: _getQuery('source'),
      showAddPhone: false,
      searchTypeList: [],
      searchTypeIndexList: [],
      sortCurrentSelected: {},
      filterCurrentSelected: {},
      sortCurrentIndex: {},
      searchType: {},
      isShowSearchType: false,
      bannerList: [],
      filterIndexShow: false,
      sortPopShowIndex: false,
      activeTabIndex: 0,
      userInfo: null
    };
  },
  created () {
    this.getCateData();
    this.getBanner();
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
    let url = `${location.origin}/webapp/crowdfunding.html`;
    let config = {
      title: '众筹平台',
      desc: '众筹平台content',
      imgUrl: 'https://img1.qunliao.info/fastdfs3/M00/10/B9/ChONolxrsfSACS2BAAHS9Co6MWQ235.png',
      link: url
    };
    this.$wechatShare(config);
  },
  methods: {
    filterIndex (data, active) {
      let result = 0;
      if (data && data.length) {
        data.forEach((elem, index) => {
          if (elem.name === active) {
            result = index;
          }
        });
      }
      return result;
    },
    cancleSort (data) {
      this.sortPopShow = false;
    },
    jumpLoc (elem) { // 金刚位跳转
      let logName = 'ZCindexPageVajra' + elem;
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: [logName, 'CLK']
      });
      if (!elem.scheme) {
        this.$toast('功能暂未开放');
        return;
      }
      this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
      if (elem.name === '我的') {
        if (this.userInfo && +this.userInfo.is_has_phone === 1 && this.userInfo.name) {
          location.href = elem.scheme;
        } else {
          if (this.userInfo && +this.userInfo.is_has_phone === 1) {
            location.href = `${location.origin}/webapp/crowdfunding.html#/login?type=bind&uri=index`;
          } else {
            location.href = `${location.origin}/webapp/crowdfunding.html#/login?uri=index`;
          }
        }
      } else if (elem.name === '拼团') {
        location.href = elem.scheme + '?tab=0';
      } else {
        location.href = elem.scheme;
      }
    },
    getBanner () {
      this.$axios_goods.get(`/goods/kingKong`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          console.log(data.data);
          this.bannerList = data.data.list;
          this.vajraArr = data.data.inner_tab;
        }
      });
    },
    jumpUrl (url) {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['ZCgoBannerScheme', 'CLK']
      });
      location.href = url;
    },
    getFocus () {
      this.showResult = false;
    },
    getCateData () {
      this.$axios_goods.get('/goods/getCategoryList').then((res) => {
        let data = res.data;
        if (data.code === 0) {
        }
        console.log(data);
      });
    },
    noScroll () {
      if (browers && ((browers.Android && browers.version >= 196) || (browers.iOS && browers.version >= 751))) {
        this.$bridge.callHandler('controlLeftSlide', {
          'isSlide': false
        });
      }
    }
  },
  components: {
    swiper, swiperSlide, List
  }
};
</script>

<style lang="less">
.trading-card-index {
  color: #222;
  background: #F1F3F4;
  height: 100vh;
  width: 100%;
  font-size: 24px;
  .van-sticky--fixed {
    padding: 0 30px;
    background: #fff;
  }
  .phone-content {
    padding: 0 20px 10px 20px;
  }
  .header {
    padding: 0px 30px 0 30px;
    background: #fff;
    .first-line{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .search {
        width: 506px;
        height:70px;
        line-height: 70px;
        border-radius: 54px;
        position: relative;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        font-size: 28px;
        // border: 5px solid #30B544;
        color: #999;
        background: #F1F3F4;
        input {
          border: none;
          height: 50px;
          line-height: 50px;
        }
        .search-text {
          position: absolute;
          right: -4px;
          width: 140px;
          height:65px;
          color: #fff;
          font-size: 28px;
          text-align: center;
          border-radius: 54px;
          background: #30B544;
        }
        img {
          width: 28px;
          margin: 0 20px;
        }
      }
      .sell-btn{
        border-radius: 35px;
        border: 4px solid #F1F3F4;
        width: 162px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 28px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        .add-btn{
          width: 24px;
          margin-right: 8px;
        }
      }
    }
    .banner {
      width: 100%;
      border-radius: 26px;
      overflow: hidden;
      transform: translateY(0);
      .swiper-img {
        max-height: 300px;
        border-radius: 26px;
        overflow: hidden;
      }
      img {
        width: 100%;
        border-radius: 26px;
        display: block;
      }
    }
    .vajra{
      width: 100%;
      padding-top: 30px;
      display: flex;
      padding-bottom: 20px;
      margin-bottom: 1px; /*no*/
      background: #fff;
      span{
        margin: auto;
        position: relative;
        img{
          width: 52px;
          display: block;
          margin:0 auto 10px;
        }
        .message-num{
          padding: 5px 10px;
          font-weight: 600;
          background: #FF0101;
          border-radius: 22px;
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          line-height: 22px;
          font-size: 16px;
          position: absolute;
          box-sizing: border-box;
          top: -10px;
          right: -50%;
        }
      }
    }
  }
    .sort-item {
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: right;
      background: #fff;
      height: 80px;
      position: absolute;
      right: 24px;
      top: 5px;
      font-size: 24px;
      color: #999;
      
      img {
        width: 14px;
        height: 8px;
        margin-left: 12px;
      }
    }
    .sort-dom {
      position: absolute;
      right: 30px;
      top: 94px;
      background: #fff;
      z-index: 10;
      overflow: hidden;
      padding: 0px 10px;
      border-radius: 14px;
      box-shadow: 2px 1px 5px #ececec;
      p {
        margin: 18px;
      }
      .active-sort {
        color: #30B544;
      }
    }
  .search-type {
    width: 220px;
    position: relative;
    text-align: right;
    display: flex;
    align-items: center;
    .sort-current {
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: right;
      font-size: 24px;
      display: inline-block;
      color: #999;
      margin-right: 20px;
      img {
        width: 14px;
        height: 8px;
        margin-left: 8px;
        margin-top: -3px;
      }
    }
    .sort-select {
      position: absolute;
      left: 2px;
      top: 70px;
      background: #fff;
      z-index: 10;
      overflow: hidden;
      padding: 0px 10px;
      border-radius: 14px;
      font-size: 24px;
      box-shadow:  1px 2px 1px 5px #f7f7f7;
      p {
        margin: 8px 18px;
      }
      .active-sort {
        color: #30B544;
      }
    }
  }
  .menu-tab {
    background: #fff;
    padding: 26px 26px 30px 30px;
    position: relative;
    display: flex;
    align-items: center;
    .menu-item {
      width:100%;
      // overflow: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
      white-space: nowrap;
    }
    .menu-item::-webkit-scrollbar {
        display: none;
    }
    span {
      font-size: 28px;
      position: relative;
    }
    .active {
      color: #30B544;
      font-weight: 700;
    }
    .active:after {
      content: '';
      position: absolute;
      right: 0;
      bottom: -16px;
      display: inline-block;
      width: 100%;
      height: 6px;
      background: #30B544;
      border-radius: 12px;
    }
  }
  .feed-dom {
    background: #F1F3F4;
  }
  .sort-rule-wrap{
    width: 100%;
    height: 70px;
    color: #333;
    z-index: 10;
    position: absolute;
    top: 120px;
    background: #fff;
    display: flex;
    span{
      width: 50%;
      text-align: center;
      img{
        width: 28px;
        position: relative;
        top: 4px;
        margin-right: 10px;
      }
      b{
        font-size: 28px;
        font-weight: normal;
        margin-right: 20px;
      }
      em{
        font-size: 24px;
        font-style: normal;
        font-weight: normal;
        color: #999999;
      }
    }
  }
  .sort-rule-outside {
    position: relative;
    top: 0;
  }
  .search-page {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    position: relative;
    .search-dom {
      position: absolute;
      top: 0;
      width: 100%;
      background: #fff;
      z-index: 3;
      display: flex;
      padding: 4px 20px;
      box-sizing: border-box;
      align-items: center;
      .arrow {
        width: 34px;
        height: 34px;
        display: inline-block;
      }
    }
    .history {
      position: absolute;
      top: 143px;
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      .his-tit {
        display: flex;
        justify-content: space-between;
        color: #999;
        font-size: 28px;
        span {
          display: inline-flex;
          align-items: center;
          img {
            width: 28px;
            margin-right: 10px;
          }
        }
        span:first-child{
          color: #2D2F32;
          font-size: 32px;
          font-weight: 500;
        }
      }
      .hit-data {
        span {
          color: #2D2F32;
          font-size: 28px;
          padding: 12px 40px;
          background: #F1F3F4;
          border-radius: 50px;
          margin: 24px 10px 0 0;
          display: inline-block;
        }
      }
    }
    .search-data {
      background: #F1F3F4;
      height: calc(~"100vh - 180px");
      width: 100%;
      overflow: auto;
      position: absolute;
      top: 180px;
      .no-result {
        color: #999;
        text-align: center;
        font-size: 28px;
        margin: 80px auto;
      }
    }
  }
  .swiper-pagination-bullets {
    bottom: 8px !important;
    .swiper-pagination-bullet {
      background: rgba(195, 195, 195, 1);
      opacity: 1;
      width: 6px !important; /*no*/
      height: 6px !important; /*no*/
      margin: 0 2px !important; /*no*/
      vertical-align: middle;
      opacity: 0.6;
    }
    .swiper-pagination-bullet-active {
      background: #fff;
      opacity: 1;
    }
  }
  .van-search__content {
    background: #fff;
    border: 5px solid #30B544;
    border-radius:46px;
    box-sizing: border-box;
  }
  .van-search .van-cell {
    padding: 4px 8px 4px 0;
  }
  form {
     width: 100%;
  }
  .van-dialog--round-button .van-dialog__footer {
    padding: 0 0 2px 0;
  }
  .van-search {
    width: 100%;
    padding: 30px 12px;
  }
  .van-search__action {
    padding: 0 16px 0 10px;
  }
  @-webkit-keyframes page8_ani {0%{opacity:0}100%{opacity:1}}
    @keyframes page8_ani {0%{opacity:0}100%{opacity:1}}
    .page8_animation{-webkit-animation: page8_ani 0.7s 0s both;animation: page8_ani 0.7s 0s both;}
}
.trading-card-index .van-dialog--round-button .van-dialog__footer {
  width: 260px;
  margin: 0 auto;
}
.van-dialog--round-button .van-dialog__footer {
  padding: 0 0 8px 0;
}
.dialog-dom {
  text-align: center;
  margin: 30px auto 40px;
  .title {
    font-size: 34px;
    margin: 20px auto 36px;
    padding: 0 40px;
  }
  .apply-btn {
    font-size: 32px;
    width: 480px;
    height: 88px;
    line-height: 84px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    background: linear-gradient(270deg, #51b761 0%, #30B544 100%);
    color: #fff;
    border-radius: 50px;
    img {
      height: 36px;
      margin-right: 16px;
    }
  }
  .apply-als {
    box-sizing: border-box;
    background: #fff;
    border: 5px solid #F1F3F4;
    color: #2D2F32;
    font-weight:bold;
  }
  .i-know {
    width: 230px;
    margin: 20px auto 0;
  }
}
</style>