<template>
    <div class="confirm-order">
        <div class="before-loading" v-if="!goodsInfo && !inited">
          <skeleton :height="115"></skeleton>
          <skeleton :height="60"></skeleton>
          <skeleton :height="165"></skeleton>
          <skeleton :height="40"></skeleton>
          <skeleton :height="40"></skeleton>
          <skeleton :height="40"></skeleton>
          <skeleton :height="165"></skeleton>
        </div>
        <div class="order-content" v-if="goodsInfo">
            <!-- -1买家违约，-2卖家违约，1待支付，2支付完成/待发货，3已发货，4已送达，5订单关闭 6正在退款 7退款完成 -->
            <van-cell
                @click="goGetAddress()"
                center
                :title="addressData ? area + addressData.detail : '请添加收货地址'"
                title-class="title-address"
                label-class="label-address"
                :label="addressData ? addressData.username + ' ' + addressData.phone : ''"
                :is-link="true"/>
            <div class="order-item">
                <div class="seller-info">
                    <img :src="sellerInfo.avatar" alt="">{{sellerInfo.username}}
                </div>
                <div class="shop-item" v-if="goodsInfo.title">
                    <div class="shop-img" @click="goGoodsDetail()"><img :src="goodsInfo.cover[0].url" alt=""></div>
                    <div class="shop-content">
                        <div class="shop-title" @click="goGoodsDetail()">
                            <div class="text">{{goodsInfo.title}}</div>
                        </div>
                        <div class="price-con success">
                            <p class="price">最终价格：<span>￥{{totalPrice}}</span></p>
                        </div>
                        <div class="goods-num">
                            数量 <van-stepper button-size="24px" v-model="goodsNum" :max="goodsInfo.stock" @change="changeGoodsNum"/>
                        </div>
                    </div>
                </div>
                <div class="goods-tips"><img src="../assets/real.png" alt="">商品由该商家在平台寄卖</div>
            </div>
            <div class="order-item">
                <div class="order-type-dom">
                    <van-cell title="价格明细" title-class="title-order"/>
                    <van-cell title="商品总价" title-class="title-order">
                        <template #right-icon>
                            <span class="order-price"><span class="fuhao">￥</span>{{totalPrice}}</span>
                        </template>
                    </van-cell>
                    <van-cell title="运费" title-class="title-order">
                        <template #right-icon>
                            <span class="order-price-daofu">
                                包邮
                                <!-- <span class="fuhao">￥</span>{{goodsInfo.price || 0}} -->
                            </span>
                        </template>
                    </van-cell>
                </div>
                <div class="order-type-dom">
                    <van-cell title="">
                        <template #right-icon>
                            <span class="order-price"><span class="price-text">合计  </span><span class="fuhao">￥</span>{{totalPrice}}</span>
                        </template>
                    </van-cell>
                </div>
            </div>
        </div>
        <div class="bottom-btn-dom buyer-bottom" v-if="goodsInfo">
            <span class="order-price"><span class="fuhao">￥</span>{{totalPrice}}</span>
            <p>
                <span class="btn" @click="submitOrder()">提交订单</span>
            </p>
        </div>
        <div class="bottom-agree" @click="linkBuyerKnow">除拼团显示届满未满员外，所购买商品因其商品属性及价值的特殊性，不支持退款。查看详情></div>
    </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
import skeleton from '../components/skeleton.vue';
export default {
  data () {
    return {
      goods_no: _getQuery('goods_no') || '', // 一口价商品通过商品编号取数据
      addressShow: false,
      addressID: '',
      area: '',
      addressData: null,
      remark: '',
      goodsInfo: null,
      sellerInfo: null,
      inited: false,
      goodsNum: 1,
      totalPrice: ''
    };
  },
  created () {
  },
  components: {
    skeleton
  },
  mounted () {
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    this.getGoodsDetail();
    if (this.$route.query && this.$route.query.addressID) {
      this.addressID = this.$route.query.addressID;
      this.getAddress();
    }
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'confirmOrder'
      }]
    });
    aplus_queue.push({
      action: 'aplus.record',
      arguments: ['buyerOrderPage', 'CLK']
    });
  },
  methods: {
    onCopy: function (e) {
      this.$toast('复制成功');
    },
    onError () {
      this.$toast('版本过低，请手动复制');
    },
    getGoodsDetail() {
      // /goods/groupPurchasingGoodsDetail
      this.$axios_goods.get(`/goods/groupPurchasingGoodsDetail?goods_no=${this.goods_no}`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.goodsInfo = data.data;
          this.sellerInfo = data.data.user_info;
          this.totalPrice = data.data.price;
          if (data.data.default_id && !this.$route.query.addressID) {
            this.addressID = data.data.default_id;
            this.getAddress();
          }
        } else {
          this.$toast(data.message);
        }
        console.log(data);
        this.inited = true;
      });
    },
    linkBuyerKnow () {
      this.$router.push({
        name: 'buyerKnowFile',
        query: {goods_no: this.goods_no}
      });
    },
    // 跳转商品详情
    goGoodsDetail (goodsNo) {
      this.$router.push({
        name: 'goodsDetail',
        query: {goods_no: this.goods_no}
      });
    },
    goUserIndex (id) {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['BuyerOrderGoUserIndex', 'CLK']
      });
      location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/userIndex?user_id=${id}`;
    },
    // 地址信息处理
    onConfirm (val) {
      console.log(val);
      let area = [];
      val.forEach(res => {
        area.push(res.name);
      });
      this.addressData.location = val;
      this.area = area.join('');
    },
    getAddress () {
      this.$axios_passport.get(`/user/groupPurchasingGetAddress?id=${this.addressID}`).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.addressData = data.data;
          this.onConfirm(this.addressData.location);
        }
      });
    },
    goGetAddress () {
      this.$router.push({
        name: 'address',
        query: {goods: this.goods_no}
      });
    },
    changeGoodsNum () {
      this.totalPrice = this.goodsNum * this.goodsInfo.price;
    },
    // 提交订单，成功跳转收银台
    submitOrder () {
      let addressID = +this.addressID ? +this.addressID : this.goodsInfo.address_id;
      if (!addressID) {
        this.$toast('请添加您的收货地址！');
        return;
      }
      let params = {
        goods_no: this.goods_no,
        buyer_address_id: addressID,
        remark: '',
        goods_amount: this.goodsNum
      };
      let url = `/orders/createCrowdFundingOrder`;
      this.$axios_orders.post(url, params).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          // this.orderInfo = data.data;
          if (data.data.order_no) {
            this.$toast('提交订单成功，请尽快支付');
            this.$router.push({
              name: 'pay',
              query: {order_no: data.data.order_no}
            });
          } else {
            this.$toast(data.message);
            // if (data.data.deposit_enough) {
            //   location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/myDeal?tab=4&order_tab=1`;
            // } else {
            //   this.$toast('请缴纳保证金');
            //   this.$router.push({
            //     name: 'pay',
            //     query: {type: 2}
            //   });
            // }
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
.confirm-order {
    font-size: 28px;
    color: #2D2F32;
    padding-bottom: 112px;
    background: #F1F3F4;
    .sheet-content {
        padding: 10px 30px 50px 30px;
        font-size: 28px;
        p {
        margin: 20px 0;
        line-height: 48px;
        }
    }
    .bottom-btn-dom .btn {
        background: #FF8507;
    }
    .title-address {
        span {
            font-size: 32px;
            font-weight: 700;
        }
    }
    .label-address {
        font-size: 28px;
    }
    .title-order {
        span {
            font-size: 28px;
            font-weight: 700;
        }
    }
    .value-order-info {
        span {
            font-size: 28px;
            color:#2D2F32
        }
    }
    .order-item {
        background: #fff;
        margin-top: 10px;
        .seller-info {
            padding: 22px 30px;
            display: flex;
            align-items: center;
            img {
                border-radius: 50%;
                width: 40px;
                height: 40px;
                background: #f1f3f4;
                margin-right: 10px;
            }
        }
        .goods-tips {
            color: #74A5F7;
            padding: 0 30px 20px;
            display: flex;
            align-items: center;
            font-size: 28px;
            img {
                width: 40px;
                margin-right: 10px;
            }
        }
        .shop-item {
            padding: 0 30px 30px 30px;;
            display: flex;
            align-items: center;
            .shop-img {
                display: inline-block;
                width: 200px;
                height: 200px;
                background: #F1F3F4;
                overflow: hidden;
                margin-right: 20px;
                position: relative;
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
            .shop-content {
                display: inline-block;
                width: calc(~"100% - 220px");
                .shop-title {
                  font-size: 28px;
                  height: 80px;
                  line-height: 40px;
                  overflow: hidden;
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
                .price-con {
                    color: #999EA2;
                    .price {
                        display: flex;
                        align-items: center;
                        margin-bottom: 18px;
                    }
                    .price span {
                        color:#30B544;
                        font-size: 32px;
                        font-weight: 400;
                    }
                    .status span {
                        padding: 6px 20px;
                        display: inline-block;
                        background: #30B544;
                        color: #fff;
                        border-radius: 26px;
                    }
                }
                .success .price span {
                    color:#FF5307;
                }
                .success .status span {
                    background:#FF5307;
                }
                .no-success .price span {
                    color:#2D2F32;
                }
                .no-success .status span {
                    background:#BBBBBB;
                }
                .before .price span {
                    color:#419bfc;
                }
                .before .status span {
                    background:#419bfc;
                }
                .goods-num {
                    display: flex;
                    align-items: center;
                    .van-stepper {
                        display: inline-block;
                        margin-left: 12px;
                    }
                }
            }
        }
        .order-type-dom {
            border-bottom: 1px solid #ebedf0;
            .secret-first {
                background: #F1F3F4;
                margin: 0 30px 20px 30px;
                padding: 14px 20px;
                border-radius: 8px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .secret-first-sl {
                    background: #FF5307;
                    border-radius: 8px;
                    padding: 4px 15px;
                    display: inline-block;
                    color: #ffffff;
                }
            }
        }
        .cell-order {
            display: flex;
            align-items: center;
            .order-type-title {
                width: 150px;
                font-weight: bold;
                flex-shrink: 0;
            }
            .van-cell {
                padding: 0;
            }
        }
    }
    .order-price {
        color: #FF5307;
        font-size: 36px;
        .fuhao {
            font-size: 24px;
            font-weight: 400;
        }
        .price-text {
            font-size: 28px;
            color: #2D2F32;
        }
    }
    .van-cell::after {
        border:none
    }
    .buyer-bottom {
        justify-content: space-between;
        .btn-cancle {
            background: #fff;
            color: #2D2F32;
            border:5px solid #F1F3F4;
            margin-right: 10px;
            box-sizing: border-box;
        }
    }
    .remark-page {
        height:100vh
    }
    .header-info {
        height: 240px;
        width: 100%;
        background: linear-gradient(270deg, #15CD88 0%, #00BE8D 100%);
        position: relative;
        display: flex;
        align-items: center;
        .bg-img {
            position: absolute;
            width: 266px;
            right: 36px;
            top: 10px;
        }
        .header-text {
            color: #fff;
            font-size:32px;
            margin-left: 50px;
            margin-right: 10px;
            line-height: 50px;
            .get-tips {
                color:rgba(255, 255, 255, .5);
                font-size:24px;
                max-width:530px;
            }
        }
        .header-button {
            position: absolute;
            right: 30px;
            bottom: 30px;
            background: rgba(255, 83, 7, 0.5);
            border-radius: 36px;
            border: 5px solid #FFFFFF;
            color: #fff;
            padding: 10px 20px;
            font-size: 24px;
        }
        .header-btn-dom {
            position: absolute;
            right: 30px;
            bottom: 30px;
            span {
                border-radius: 36px;
                padding: 10px 20px;
                font-size: 24px;
                border: 5px solid #FFFFFF;
                color: #fff;
                background: rgba(255, 83, 7, 0.5);
            }
            .btn-two {
                background: #fff;
                color: #333;
                margin-left: 10px;
            }
            .btn-gray {
                background: #F1F3F4;
                color: #bbb;
                border: 5px solid #F1F3F4;
            }
        }
        .go-fahuo {
            position: absolute;
            right: 30px;
            bottom: 30px;
            background: #fff;
            border-radius: 36px;
            color: #333;
            padding: 15px 35px;
            font-size: 24px;
        }
    }
    .header-orange {
        background: linear-gradient(270deg, #FFB161 0%, #FF8507 100%);
    }
    .header-purple {
        background: linear-gradient(90deg, #CDB0E2 0%, #E6DBEE 100%);
    }
    .seller-order-item {
        background: #fff;
        margin-bottom: 10px;
        .seller-info {
            padding: 22px 30px;
            display: flex;
            align-items: center;
            img {
                border-radius: 50%;
                width: 40px;
                height: 40px;
                background: #f1f3f4;
                margin-right: 10px;
            }
        }
        .shop-item {
            padding: 28px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ebedf0;
            .shop-img {
                display: inline-block;
                width: 200px;
                height: 200px;
                background: #F1F3F4;
                overflow: hidden;
                margin-right: 20px;
                position: relative;
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
            .shop-content {
                display: inline-block;
                width: calc(~"100% - 220px");
                .shop-title {
                  font-size: 28px;
                  height: 80px;
                  line-height: 40px;
                  overflow: hidden;
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
                .price-con {
                    color: #999EA2;
                    .price {
                        display: flex;
                        align-items: center;
                        margin-bottom: 18px;
                    }
                    .price span {
                        color:#30B544;
                        font-size: 32px;
                        font-weight: 400;
                    }
                    .status span {
                        padding: 6px 20px;
                        display: inline-block;
                        background: #30B544;
                        color: #fff;
                        border-radius: 26px;
                    }
                }
                .success .price span {
                    color:#FF5307;
                }
                .success .status span {
                    background:#FF5307;
                }
                .no-success .price span {
                    color:#2D2F32;
                }
                .no-success .status span {
                    background:#BBBBBB;
                }
                .before .price span {
                    color:#419bfc;
                }
                .before .status span {
                    background:#419bfc;
                }
            }
        }
        .order-type-dom {
            border-bottom: 1px solid #f00;
        }
        .cell-order {
            display: flex;
            align-items: center;
            position: relative;
            .order-type-title {
                width: 150px;
                font-weight: bold;
                flex-shrink: 0;
            }
            .van-cell {
                padding: 0;
            }
        }
        .cell-order-tip {
            position: absolute;
            right: 10px;
            bottom: 0;
            color: #30B544;
        }
    }
    .bottom-agree {
        position: fixed;
        bottom: 110px;
        width: 100%;
        background: #fee4af;
        padding: 15px 30px;
        box-sizing: border-box;
        color: #FF8507;
        font-size: 24px;
    }
}
</style>