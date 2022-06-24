<template>
  <div class="opencard-report">
    <div class="search-wrap">
      <van-search class="report-search-input" v-model="searchValue" placeholder="请输入搜索关键词" :clearable="true" />
      <b class="search-btn" @click="searchFn">开始筛选</b>
    </div>
    <div class="my-card-info card-info" v-if="myCardList&&myCardList.length">
      <p class="my-label">我的中卡</p>
      <dl class="card-item" v-for="(elem,index) in myCardList">
        <dt @click="previewBigImg(elem)">
          <template v-if="elem.attachment_info&&elem.attachment_info.length&&elem.attachment_info[0]&&elem.attachment_info[0].url">
            <img :src="elem.attachment_info[0].url" alt="">
          </template>
          <span v-if="elem&&elem.hit_count">中卡{{elem.hit_count}}张</span>
        </dt>
        <dd>
          <p>卡密名称：{{elem.card_secret}}</p>
          <p>拆卡时间：{{elem.split_time}}</p>
          <p>中卡用户：{{elem.username}}</p>
        </dd>
      </dl>
    </div>
    <div class="other-card-info card-info">
      <p class="other-tit">其他中卡</p>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <dl class="card-item other" v-for="(elem,index) in otherCardList">
          <dt @click="previewBigImg(elem)">
            <template v-if="elem.attachment_info&&elem.attachment_info.length&&elem.attachment_info[0]&&elem.attachment_info[0].url">
              <img :src="elem.attachment_info[0].url" alt="">
            </template>
            <span v-if="elem&&elem.hit_count">中卡{{elem.hit_count}}张</span>
          </dt>
          <dd>
            <p>卡密名称：{{elem.card_secret}}</p>
            <p>拆卡时间：{{elem.split_time}}</p>
            <p>中卡用户：{{elem.username}}</p>
          </dd>
        </dl>
      </van-list>
    </div>
    <div class="live-info" @click="jumpLive" v-if="backUrl">
      <img class="live-img" :src="backPic" alt="">
      <span class="live-text">
        <img src="../assets/play.png" alt="">
        <p>回放</p>
      </span>
    </div>
    <van-image-preview v-model="show" :images="imagesList" @change="onChange">
    </van-image-preview>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initLoad: true,
      searchValue: '',
      nextUrl: '',
      loading: false,
      finished: false,
      myCardList: [],
      otherCardList: [],
      goodsNo: '',
      backPic: '',
      backUrl: '',
      show: false,
      imagesList: [] // 预览大图

    };
  },
  mounted() {
    this.goodsNo = this.$route.query.goods_no;
    this.getNextUrl();
  },
  methods: {
    jumpLive () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/liveDetail?goods_no=${this.goodsNo}`;
    },
    onChange(index) {
      this.index = index;
    },
    getNextUrl() {
      this.nextUrl = `/goods/goodsSplitReport?goods_no=${this.goodsNo}&search=${this.searchValue}`;
    },
    onLoad() {
      this.getData();
    },
    getData(type) {
      this.$axios_goods.get(this.nextUrl).then(res => {
        let data = res.data;
        this.loading = false;
        if (data.code === 0) {
          if (this.initLoad || (type === 'init')) {
            this.myCardList = data.data.my_hit;
            this.backUrl = data.data.playback_url;
            this.backPic = data.data.playback_pic_url;
          }
          if (data.data && data.data.others_hit && data.data.others_hit.length) {
            if (type === 'init') {
              this.otherCardList = data.data.others_hit;
            } else {
              this.otherCardList = [...this.otherCardList, ...data.data.others_hit];
            }
          }
          if (!(data.data && data.data.next_url)) {
            this.finished = true;
            this.nextUrl = '';
          } else {
            this.finished = false;
            this.nextUrl = data.data.next_url;
          }
          if (this.initLoad) {
            this.initLoad = false;
          }
        } else {
          this.$toast(data.message);
        }
      });
    },
    searchFn() {
      // 筛选卡片
      this.getNextUrl();
      this.getData('init');
    },
    previewBigImg(elem) {
      this.imagesList = [];
      if (elem && elem.attachment_info && elem.attachment_info.length) {
        elem.attachment_info.forEach((e, i) => {
          this.imagesList.push(e.url);
        });
        this.show = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.opencard-report {
  width: 100%;
  .search-wrap {
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .van-search__content {
      width: 506px;
      height: 70px;
      background: #f1f3f4;
      border-radius: 35px;
    }
    .report-search-input {
      display: inline-block;
    }
    .search-btn {
      width: 162px;
      height: 70px;
      line-height: 70px;
      background: #30b544;
      border-radius: 35px;
      font-size: 28px;
      display: inline-block;
      font-weight: normal;
      color: #fff;
      text-align: center;
    }
  }
  .card-info {
    background: #fff;
    box-sizing: border-box;
    margin-bottom: 10px;
    padding-top: 18px;
    .other-tit {
      font-size: 28px;
      font-weight: 600;
      color: #2d2f32;
      line-height: 40px;
      margin-bottom: 25px;
      margin: 0px 24px 0px;
    }
    .my-label {
      width: 152px;
      height: 44px;
      line-height: 44px;
      background: #ff5307;
      border-radius: 22px;
      font-size: 28px;
      color: #fff;
      text-align: center;
      margin: 0px 24px 0px;
    }
    .card-item {
      display: flex;
      padding: 28px 24px 28px;
      border-bottom: 1px solid #f1f3f4;
      dt {
        width: 200px;
        height: 200px;
        background: #d8d8d8;
        margin-right: 20px;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
        }
        span{
          padding: 0 20px;
          height: 30px;
          line-height: 30px;
          background: #2D2F32;
          border-radius: 10px 0px 0px 0px;
          position: absolute;
          bottom: 0;
          right: 0;
          color: #fff;
          font-size: 22px;
          text-align: center;
        }
      }
      dd {
        color: #2d2f32;
        font-size: 28px;
        width: 480px;
        margin-top: 10px;
        p {
          font-weight: 400;
          color: #2d2f32;
          line-height: 40px;
          margin-bottom: 12px;
        }
      }
    }
  }
  .live-info {
    width: 200px;
    height: 112px;
    border-radius: 16px;
    border: 1px solid #FFFFFF;
    position: fixed;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 2px 2px 16px #abaaaa;
    margin-top: 15px;
    bottom: 20px;
    right: 0px;
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
  .no-data{
    text-align: center;
    padding-top: 300px;
    color: #aaa;
    font-size: 28px;
  }
}
</style>
