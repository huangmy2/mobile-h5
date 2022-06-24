<template>
  <div class="my-get-card">
    <van-list v-model="loading" :finished="finished" @load="onLoad" :offset="100">
      <template v-if="currentPicList&&currentPicList.length && !loading">
        <dl class="card-item" v-for="(elem,index) in currentPicList">
          <dt @click="showAllPic(elem,index)">
            <template v-if="elem.attachment_info&&elem.attachment_info.length">
              <img :src="elem.attachment_info[0]" alt="">
            </template>
            <span v-if="elem&&elem.hit_count">中卡{{elem.hit_count}}张</span>
          </dt>
          <dd @click="jumpDetail(elem)">
            <p class="title">拼团名称：{{elem.title}}</p>
            <p>卡密名称：{{elem.card_secret}}</p>
            <p>拆卡时间：{{elem.split_time}}</p>
          </dd>
        </dl>
      </template>
      <div class="no-data" v-else-if="!loading">暂无数据</div>
    </van-list>
    <van-image-preview v-model="show" :images="largeImages" @change="onChange">
    </van-image-preview>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      nextUrl: '',
      show: false,
      index: 0,
      largeImages: [],
      currentPicList: []
    };
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
          page: 'myGetCard'
        }
      ]
    });
    this.getNextUrl();
  },
  methods: {
    onLoad() {
      this.getCardList();
    },
    getNextUrl() {
      this.nextUrl = '/user/myHitCard';
    },
    getCardList () { // 获取卡片列表
      this.$axios_passport.get(this.nextUrl).then((res) => {
        let data = res.data;
        this.loading = false;
        if (data.code === 0) {
          if (data.data && data.data.list && data.data.list.length) {
            this.currentPicList = [...this.currentPicList, ...data.data.list];
          }
          if (data.data && data.data.next_url === '') {
            this.finished = true;
            this.nextUrl = '';
          } else {
            this.finished = false;
            this.nextUrl = data.data.next_url;
          }
        } else {
          this.$toast(data.message);
        }
      });
    },
    onChange(index) {
      this.index = index;
    },
    showAllPic (elem, index) { // 查看大图
      this.largeImages = [];
      if (elem && elem.attachment_info && elem.attachment_info.length) {
        elem.attachment_info.forEach((e, i) => {
          this.largeImages.push(e);
        });
        this.show = true;
      }
    },
    jumpDetail(elem) { // 跳转商详页
      this.$router.push({
        name: 'goodsDetail',
        query: {
          goods_no: elem.goods_no
        }
      });
    }
  }
};
</script>

<style lang="less">
.my-get-card {
  background: #F1F3F4;
  .no-data{
    color: #aaa;
    font-size: 28px;
    text-align: center;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .card-item{
    width: 100%;
    height: 256px;
    background: #FFFFFF;
    padding: 28px 24px;
    box-sizing: border-box;
    border-bottom: 2px solid #F1F3F4;/*no*/
    dt{
      width: 200px;
      height: 200px;
      position: relative;
      float: left;
      margin-right: 20px;
      img{
        width: 100%;
        height: 100%;
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
    dd{
      float: left;
      margin-top: 10px;
      width: 450px;
      .title{
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        overflow: hidden;
      }
      p{
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2D2F32;
        line-height: 40px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>