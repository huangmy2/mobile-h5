<template>
  <div class="goods-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="更新成功">
      <div v-if="!goodsInfo">
        <skeleton :height="370"></skeleton>
        <skeleton :height="100"></skeleton>
        <skeleton :height="120"></skeleton>
        <skeleton :height="195"></skeleton>
      </div>
      <div class="goods-detail" v-if="goodsInfo">
        <div class="good-img-arr">   
            <van-swipe class="my-swipe" indicator-color="white" ref="swiper">
                <van-swipe-item v-for="(item,index) in goodsInfo.cover" :key="index">
                    <img :src="item.url" alt="" @click="showImgArr(index)">
                </van-swipe-item>
            </van-swipe>
            <img class="success-status" v-if="goodsInfo.goods_status == 3" src="../assets/team-success.png" alt="">
            <img class="success-status" v-if="goodsInfo.goods_status == 4" src="../assets/team-fail.png" alt="">
            <span class="wait-img" v-if="!refreshing && (!goodsInfo.cover || !goodsInfo.cover.length)">待上传商品图片</span>
        </div>
        <div class="card-timestamp" v-if="+goodsInfo.goods_status < 3">
          <div class="card-money">
            <span class="together-logo">限时拼团</span><span class="price-now">￥{{goodsInfo.price}}</span>
          </div>
          <div class="card-time">
            <p>距离{{goodsInfo.goods_status==1?'开始':'结束'}}还有<br><span class="time-introduce">{{timestamp}}</span></p>
          </div>
        </div>
        <div class="card-info">
            <div class="card-header-info">
              <div>
                <div class="flex-dom card-price">
                    <span class="price-detail" v-if="+goodsInfo.goods_status > 2">￥<label>{{goodsInfo.price}}</label></span>
                </div>
                <div class="flex-dom card-span"><span>商品编号：{{goodsInfo.goods_no}}</span></div>
                <p class="card-title">{{goodsInfo.title}}</p>
              </div>
              <div class="live-info" v-if="goodsInfo.live_info && goodsInfo.live_info.playback_url" @click="linkLive">
                <img class="live-img" :src="goodsInfo.live_info.pic_url" alt="">
                <span class="live-text">
                  <img src="../assets/play.png" alt="">
                  <p v-if="goodsInfo.spilt_status == 3">直播中</p>
                  <p v-if="goodsInfo.spilt_status == 4">回放</p>
                </span>
              </div>
            </div>
            <p class="cate-list"><span>{{goodsInfo.subtitle}}</span></p>
            <div class="plugin-list">
              <div class="plugin-item"><p>{{goodsInfo.group_purchasing_type}}</p>玩法</div>
              <div class="plugin-item"><p>{{goodsInfo.product_standard}}</p>规格</div>
              <div class="plugin-item"><p>{{goodsInfo.product_configuration}}</p><div class="goods-plugin" @click="showGoodsDetail = true">商品配置<img src="../assets/help.png" alt=""></div></div>
            </div>
        </div>
        <div class="together-percent">
          <p class="together-title"><span class="title">拼团进度</span>
            <span v-if="goodsInfo.goods_status == 3">拼团成功</span>
            <span v-else>余{{goodsInfo.stock}}/共{{goodsInfo.total_count}}</span>
          </p>
          <div class="together-percent-hand">
            <div class="together-percent-son" :style="'left: 0%;width:' + ((goodsInfo.total_count - goodsInfo.stock)/goodsInfo.total_count)*100 + '%'"></div>
            <span class="together-percent-num" :style="'right:' + (goodsInfo.stock/goodsInfo.total_count)*96 + '%'">{{goodsInfo.total_count - goodsInfo.stock}}</span>
          </div>
        </div>
        <div class="seller">
            <div class="seller-dom flex-dom">
                <img class="seller-avatar" :src="sellerInfo.avatar ? sellerInfo.avatar : defaultAvatar" alt="">
                <div>
                    <p class="seller-name">{{sellerInfo.username}}</p>  
                    <div class="zfb-info">
                        <span><img src="../assets/real.png" alt=""> 商品由该商家在平台寄卖</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="menu-list">
          <div class="menu-item">
            <span class="menu-item-title">拼团方式</span><span class="menu-item-info" @click="showTeamDetail = true">{{goodsInfo.group_purchasing_type}}<img src="../assets/help.png" alt=""></span>
          </div>
          <div class="menu-item">
            <span class="menu-item-title">开售时间</span><span>{{goodsInfo.stime}}</span>
          </div>
          <div class="menu-item" v-if="goodsInfo.goods_status == 3">
            <span class="menu-item-title">拼团完成时间</span><span>{{goodsInfo.finish_time}}</span>
          </div>
          <div class="menu-item">
            <span class="menu-item-title">随机方式</span><span class="menu-item-info" @click="showRandom = true">{{goodsInfo.random_type}}<img src="../assets/help.png" alt=""></span>
          </div>
          <div class="menu-item">
            <span class="menu-item-title">卡片列表</span><span class="menu-item-info" @click="goProductList(goodsInfo.template_no)">查看列表<img src="../assets/arrow-right.png" alt=""></span>
          </div>
          <div class="menu-item" v-if="goodsInfo.goods_status == 3">
            <span class="menu-item-title">卡密分配结果</span><span class="menu-item-info" @click="goSecretList()">查看卡密<img src="../assets/arrow-right.png" alt=""></span>
          </div>
          <div class="menu-item">
            <span class="menu-item-title">购买须知</span><span class="menu-item-info" @click="linkBuyerKnow">查看须知<img src="../assets/arrow-right.png" alt=""></span>
          </div>
        </div>
        <div class="menu-list">
          <div class="menu-introduce" v-html="goodsInfo.toast.remark"></div>
        </div>
        <div class="go-buy">
          <!-- goods_status  1待拼团，2拼团中，3拼团成功，4拼团失败 -->
          <!-- spilt_status  1未预约，2已预约&待开始，3直播中，4直播结束 -->
          <span class="buy-btn btn-gray" v-if="goodsInfo.goods_status==1">距开售还剩{{timestamp}}</span>
          <span class="buy-btn btn-gray" v-else-if="goodsInfo.goods_status==4">拼团失败</span>
          <span v-else-if="goodsInfo.goods_status==2" class="buy-btn" @click="goPay()">立即购买</span>
          <span class="buy-btn btn-gray" v-else-if="goodsInfo.goods_status==3 && !goodsInfo.is_seller && goodsInfo.spilt_status == 1">拼团成功</span>
          <span class="buy-btn" v-else-if="goodsInfo.goods_status==3 && goodsInfo.is_seller && goodsInfo.spilt_status == 1" @click="chooseLiveTime = true">预约直播</span>
          <span class="buy-btn btn-gray" v-else-if="goodsInfo.goods_status==3 && goodsInfo.spilt_status == 2">等待直播拆卡</span>
          <span class="buy-btn" v-else-if="goodsInfo.goods_status==3 && goodsInfo.spilt_status == 3 && goodsInfo.live_info && goodsInfo.live_info.playback_url" @click="linkLive">观看直播拆卡</span>
          <span class="buy-btn" v-else-if="goodsInfo.goods_status==3 && goodsInfo.spilt_status == 4 && !goodsInfo.if_have_report && goodsInfo.is_seller" @click="goSetCardReport()">填写拆卡报告</span>
          <span class="buy-btn btn-gray" v-else-if="goodsInfo.goods_status==3 && goodsInfo.spilt_status == 4 && !goodsInfo.if_have_report && !goodsInfo.is_seller">等待卖家填写拆卡报告</span>
          <span class="buy-btn" v-else-if="goodsInfo.goods_status==3 && goodsInfo.spilt_status == 4 && goodsInfo.if_have_report" @click="goCardReport()">查看拆卡报告</span>
        </div>
      </div>
    </van-pull-refresh>
    <van-image-preview v-model="showBigImg" :images="bigImgArr" :startPosition="imgIndex" @change="imgChange" />
    <van-action-sheet v-model="showGoodsDetail" title="商品配置信息" :round="false">
      <div class="sheet-content" v-if="goodsInfo && goodsInfo.toast">
        <p class="normal-content" v-html="goodsInfo.toast.configuration"></p>
      </div>
    </van-action-sheet>
    <van-action-sheet v-model="showTeamDetail" title="限时拼团说明" :round="false">
      <div class="sheet-content" v-if="goodsInfo && goodsInfo.toast">
        <p class="normal-content" v-html="goodsInfo.toast.random_player_desc"></p>
        <p class="normal-content" v-html="goodsInfo.toast.random_team_desc"></p>
      </div>
    </van-action-sheet>
    <van-action-sheet v-model="showRandom" title="随机方式说明" :round="false">
      <div class="sheet-content" v-if="goodsInfo && goodsInfo.toast">
        <p class="normal-content" v-html="goodsInfo.toast.random_type_desc"></p>
      </div>
    </van-action-sheet>
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
import { _getQuery } from 'src/utils/tool.js';
import miment from 'miment';
import 'swiper/dist/css/swiper.css';
import skeleton from '../components/skeleton.vue';

export default {
  data () {
    return {
      refreshing: false,
      goodsInfo: null,
      imgIndex: 0,
      showBigImg: false,
      bigImgArr: [],
      timestamp: '',
      sellerInfo: null,
      showGoodsDetail: false,
      showTeamDetail: false,
      showRandom: false,
      goods_no: _getQuery('goods_no') || '',
      defaultAvatar: 'https://img1.qunliao.info/fastdfs5/M00/76/FF/rB8CCmEbIfmADVmrAAANFYGX3Hw504.png',
      userInfo: null,
      chooseLiveTime: false,
      currentDate: new Date(),
      minDate: new Date(),
      maxDate: new Date(2030, 1, 1),
      dqdName: '',
      timer: null
    };
  },
  created () {
  },
  components: {
    skeleton
  },
  mounted() {
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
    this.getGoodsDetail();
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
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer);
      this.timer = null;
    });
  },
  methods: {
    // 预约直播
    onConfirmLiveTime (value) {
      let time = miment(this.currentDate).format('YYYY-MM-DD hh:mm');
      let params = {
        dqd_username: this.dqdName,
        reserve_time: time,
        goods_no: this.goods_no
      };
      this.$axios_goods.post('/goods/reserveLive', params).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.$toast('预约成功！已将直播时间通知给拼团用户，请按时开播。');
          this.getGoodsDetail();
          this.chooseLiveTime = false;
        } else {
          this.$toast(data.message);
        }
      });
    },
    goSetCardReport () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/setOpenCardReport?goods_no=${this.goods_no}`;
    },
    goCardReport () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/openCardReport?goods_no=${this.goods_no}`;
    },
    goSecretList() {
      this.$router.push({
        name: 'secretResult',
        query: {goods_no: this.goods_no}
      });
    },
    linkBuyerKnow () {
      this.$router.push({
        name: 'buyerKnowFile',
        query: {goods_no: this.goods_no}
      });
    },
    imgChange (index) {
      console.log(index);
      this.$refs.swiper.swipeTo(index);
    },
    showImgArr (index) {
      this.imgIndex = index;
      this.showBigImg = true;
    },
    onRefresh () {
      this.showBigImg = false;
      this.bigImgArr = [];
      this.getGoodsDetail();
    },
    linkLive () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/liveDetail?goods_no=${this.goods_no}`;
    },
    goProductList (templateNo) {
      location.href = `${location.origin}/webapp/crowdfunding.html#/productList?template_no=${templateNo}`;
    },
    goPay () {
      if (this.goodsInfo.is_seller) {
        this.$toast('商家不能参与购买');
        return;
      }
      // alert(sessionStorage.getItem('userinfo'));
      this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
      if (this.userInfo && +this.userInfo.is_has_phone === 1 && this.userInfo.name) {
        location.href = `${location.origin}/webapp/crowdfunding.html#/confirmOrder?goods_no=${this.goods_no}`;
      } else {
        if (this.userInfo && +this.userInfo.is_has_phone === 1) {
          location.href = `${location.origin}/webapp/crowdfunding.html#/login?type=bind&no=${this.goods_no}`;
        } else {
          location.href = `${location.origin}/webapp/crowdfunding.html#/login?no=${this.goods_no}`;
        }
      }
    },
    getGoodsDetail() {
      // /goods/groupPurchasingGoodsDetail
      this.$axios_goods.get(`/goods/groupPurchasingGoodsDetail?goods_no=${this.goods_no}`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.goodsInfo = data.data;
          this.sellerInfo = data.data.user_info;
          // 给大图预览传数据
          if (data.data.cover && data.data.cover.length) {
            data.data.cover.forEach(elem => {
              this.bigImgArr.push(elem.url);
            });
          }
          if ((+this.goodsInfo.goods_status === 1 || +this.goodsInfo.goods_status === 2) && this.goodsInfo.time_stamp) {
            this.makeTimer();
          }
        } else {
          this.$toast(data.message);
        }
        console.log(data);
        this.inited = true;
        this.refreshing = false;
      });
    },
    makeTimer () {
      console.log(this.goodsInfo.time_stamp);
      let current = (new Date()).getTime();
      if (this.goodsInfo.time_stamp > (current / 1000)) {
        this.timestamp = this.$parent.formatSeconds(this.goodsInfo.time_stamp - (current / 1000));
      }
      this.timer = setInterval(() => {
        let current = (new Date()).getTime();
        if (this.goodsInfo.time_stamp > (current / 1000)) {
          this.timestamp = this.$parent.formatSeconds(this.goodsInfo.time_stamp - (current / 1000));
        } else {
          clearInterval(this.timer);
          this.getGoodsDetail();
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less">
.goods-list {
  color: #2D2F32;
  background: #F1F3F4;
  .goods-detail {
    padding-bottom: 130px;
    .good-img-arr {
        height:700px;
        width: 100%;
        text-align: center;
        background: #fff;
        overflow: hidden;
        position: relative;
        .wait-img {
          font-size: 32px;
          color: #999;
          display: flex;
          height: 700px;
          align-items: center;
          justify-content: center;
        }
        .van-swipe-item {
            position: relative;
            overflow: hidden;
            height:700px !important;
        }
        .van-swipe img {
            height: 700px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        .success-status {
          position: absolute;
          top: 500px;
          right: 8px;
          width: 250px;
          height: 190px;
          z-index: 10;
        }
    }
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
            user-select:text;
        }
        .card-price {
            .price-detail {
                color: #FF0101;
                font-size: 32px;
                label {
                  font-size: 60px; 
                }
            }
            .success-price {
                color: #FF5307;
            }
            .done-price {
                color: #222;
            }
            .before-price {
                color:#419bfc
            }
            .card-timer {
                background: #30B544;
                padding: 4px 22px;
                color: #fff;
                border-radius: 26px;
                font-size: 24px;
            }
            .success-timer {
                background: #FF5307;
            }
            .done-timer {
                background: #bbb;
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
      margin-top: 10px;
      padding: 0 30px 20px 30px;
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
    .seller {
        font-size: 28px;
        background: #fff;
        margin-top: 10px;
        .seller-dom {
            .seller-avatar {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                margin: 24px 30px;
            }
            .seller-name {
                font-size: 34px;
                font-weight: bold;
            }
            .zfb-info {
                color: #74A5F7;
                span {
                    margin-right: 30px;
                    line-height: 60px;
                    display: inline-flex;
                    align-items: center;
                }
                img {
                    height: 28px;
                    margin-right:10px;
                }
            }
        }
    }
    .flex-dom {
        display: flex;
        align-items: center;
    }
    .menu-list {
      background: #fff;
      margin-top: 10px;
      .menu-item {
        font-size: 28px;
        display: flex;
        justify-content: space-between;
        padding: 30px;
        border-bottom:2px solid #F1F3F4;
        .menu-item-title {
          color: #666;
        }
        .menu-item-info {
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
            margin-left: 8px;
          }
        }
      }
      .menu-introduce {
        padding: 30px;
        font-size: 28px;
        line-height: 48px;
      }
    }
    .go-buy {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      background: #fff;
      height: 120px;
      line-height: 120px;
      text-align: center;
      z-index: 2999;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      .buy-btn {
        background: #FF5307;
        color: #fff;
        display: inline-block;
        width: 700px;
        font-size: 28px;
        height: 80px;
        line-height: 80px;
        border-radius: 40px;
      }
      .btn-gray {
        background: #BBBBBB;
      }
    }
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
  .sheet-content {
    padding: 10px 30px 130px 30px;
    font-size: 28px;
    p {
      margin: 20px 0;
      line-height: 48px;
    }
  }
  .van-action-sheet__header {
    border-bottom: 2px solid #F1F3F4;
  }
}
@media only screen 
  and (device-width : 375px) 
  and (device-height : 812px) 
  and (-webkit-device-pixel-ratio : 3) {
  .goods-detail {
    padding-bottom: 215px;
  }
  .goods-detail .go-buy{
    height: 140px;
    line-height: 100px;
  }
  .goods-list .sheet-content {
    padding: 10px 30px 170px 30px;
  }
}
</style>