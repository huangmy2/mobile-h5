<template>
    <div class="seller-order">
        <div class="before-loading" v-if="!orderInfo && !inited">
          <skeleton :height="120"></skeleton>
          <skeleton :height="150"></skeleton>
          <skeleton :height="60"></skeleton>
          <skeleton :height="60"></skeleton>
          <skeleton :height="50"></skeleton>
          <skeleton :height="150"></skeleton>
          <skeleton :height="50"></skeleton>
        </div>
        <div class="order-content" v-if="orderInfo">
            <!-- 1待支付，2支付完成/待发货，3已发货/待收货，4已送达，5已完成 6已退款 -->
            <div class="header-info" v-if="+orderInfo.order_status === 1">
                <img class="bg-img" src="../assets/promise-bg.png" alt="">
                <div class="header-text">
                    待付款
                    <p>剩余时间：{{timeOrder}}</p>
                </div>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 2">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    待发货
                </div>
                <span class="go-fahuo" @click="sellerGo">去发货</span>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 3">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    运输中
                </div>
                <span class="header-button" @click="goWMS">查看物流</span>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 4">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    已送达
                </div>
                <span class="header-button" @click="goWMS">查看物流</span>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 5">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    已完成
                    <p>订单已完成</p>
                </div>
                <span class="header-button" @click="goWMS">查看物流</span>
            </div>
            <div class="header-info header-purple" v-if="+orderInfo.order_status > 5">
                <img class="bg-img" src="../assets/promise-bg.png" alt="">
                <div class="header-text" v-if="+orderInfo.order_status === 6">已退款</div>
            </div>
            <div class="seller-order-item">
              <div class="shop-item" v-if="orderInfo.goods_info.title" @click="goGoodsDetail()">
                    <div class="shop-img"><img :src="orderInfo.goods_info.pic_url" alt=""></div>
                    <div class="shop-content">
                        <div class="shop-title">
                            <div class="text">{{orderInfo.goods_info.title}}</div>
                        </div>
                        <div class="price-con success">
                            <p class="price"><span>￥{{orderInfo.goods_info.price}}</span></p>
                        </div>
                        <div>数量 {{orderInfo.goods_info.goods_amount}}</div>
                    </div>
                </div>
                <div class="shop-item" v-else v-for="item in orderInfo.goods_info" @click="goGoodsDetail()">
                    <div class="shop-img"><img :src="item.pic_url" alt=""></div>
                    <div class="shop-content">
                        <div class="shop-title">
                            <div class="text">{{item.title}}</div>
                        </div>
                        <div class="price-con success">
                            <p class="price"><span>￥{{item.price}}</span></p>
                        </div>
                        <div>数量 {{item.goods_amount}}</div>
                    </div>
                </div>
                <div class="order-type-dom" v-if="orderInfo && orderInfo.address_info">
                    <van-cell center>
                        <template #title>
                            <div class="cell-order">
                                <div class="order-type-title">收件信息</div>
                                <div class="order-buyer-adress">{{orderInfo.address_info.username}}<br>手机号：{{orderInfo.address_info.phone}}<br>收货地址：{{orderInfo.address_info.address}}</div>
                            </div>
                        </template>
                        <template #right-icon>
                            <span class="cell-order-tip" v-clipboard:copy="orderInfo.address_info.username + ' ' + orderInfo.address_info.phone + ' ' +orderInfo.address_info.address" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
                        </template>
                    </van-cell>
                </div>
                <!-- <div class="order-type-dom" v-if="orderInfo && orderInfo.buyer && orderInfo.buyer.address">
                    <van-cell center>
                        <template #title>
                            <div class="cell-order">
                                <div class="order-type-title">收货地址</div>
                                <div>{{orderInfo.buyer.address}}</div>
                            </div>
                        </template>
                        <template #right-icon>
                            <span class="cell-order-tip" v-clipboard:copy="orderInfo.buyer.address" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
                        </template>
                    </van-cell>
                </div> -->
                <!-- <div class="order-type-dom">
                    <van-cell center>
                            <template #title>
                                <div class="cell-order">
                                    <div class="order-type-title">订单备注</div>
                                    <van-field rows="1" autosize readonly type="textarea" v-model="orderInfo.order.remark" placeholder="无备注" />
                                </div>
                            </template>
                    </van-cell>
                </div> -->
            </div>
            <div class="seller-order-item">
                <div class="order-type-dom">
                    <van-cell title="拼团信息" title-class="title-order" value-class="value-order-info"/>
                    <van-cell title="卡片列表" title-class="title-order" value-class="value-order-info" is-link value="查看列表" @click="goProductList"/>
                    <van-cell title="拼团进度" title-class="title-order" value-class="value-order-info" :value="orderInfo.stock + '/' + orderInfo.total_count" />
                    <van-cell title="卡密信息" title-class="title-order" value-class="value-order-info" is-link value="查看全部卡密" @click="goSecretList"/>
                    <div class="secret-first" v-for="item in orderInfo.card_secret" @click="goSecretList">
                      <span>{{item.secret}}</span><span class="secret-first-sl" v-if="item.is_select == 1">中卡</span>
                    </div>
                </div>
            </div>
            <div class="seller-order-item">
                <div class="order-type-dom">
                    <van-cell title="价格明细" title-class="title-order"/>
                    <van-cell title="商品总价" title-class="title-order">
                        <template #right-icon>
                            <span class="order-price"><span class="fuhao">￥</span>{{orderInfo.order_price}}</span>
                        </template>
                    </van-cell>
                    <van-cell title-class="title-order">
                        <template slot="title">
                            <span>运费</span>
                        </template>
                        <template #right-icon>
                            <span>已免运费</span>
                        </template>
                    </van-cell>
                </div>
                <div class="order-type-dom">
                    <van-cell title="">
                        <template #right-icon>
                            <span class="order-price"><span class="price-text">实收款  </span><span class="fuhao">￥</span>{{orderInfo.order_price}}</span>
                        </template>
                    </van-cell>
                </div>
            </div>
            <div class="seller-order-item">
                <div class="order-type-dom">
                    <van-cell title="订单信息" title-class="title-order"/>
                </div>
                <div class="order-type-dom">
                    <van-cell center>
                        <template #title>
                            <div class="cell-order">
                                <div class="order-type-title">买家昵称</div>
                                <div><b>{{orderInfo.order_info.buyer_name}}</b></div>
                            </div>
                        </template>
                    </van-cell>
                </div>
                <div class="order-type-dom">
                    <van-cell center>
                        <template #title>
                            <div class="cell-order">
                                <div class="order-type-title">订单编号</div>
                                <div><b>{{order_no}}</b></div>
                            </div>
                        </template>
                        <template #right-icon>
                            <span class="cell-order-tip" v-clipboard:copy="order_no" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
                        </template>
                    </van-cell>
                </div>
            </div>
        </div>
        <div class="bottom-btn-dom" v-if="orderInfo">
            <!-- <span class="btn-aff" v-if="orderInfo.if_child_order" @click="seeMergeOrder()">查看主订单</span> -->
            <span class="btn-aff" @click="goGoodsDetail()">商品详情</span>
            <!-- <span class="btn" @click="linkSellerNotice()">联系买家</span> -->
        </div>
    </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
import skeleton from '../components/skeleton.vue';
export default {
  data () {
    return {
      order_no: _getQuery('order_no') || '',
      addressShow: false,
      addressID: '',
      area: '',
      addressData: null,
      remark: '',
      orderInfo: null,
      timerBuyer: null,
      timeOrder: '',
      inited: false,
      showFreight: false
    };
  },
  created () {
  },
  components: {
    skeleton
  },
  filters: {
    expressDesc: function(val) {
      if (val.length > 35) {
        return val.substring(0, 35) + '...';
      } else {
        return val;
      }
    }
  },
  mounted () {
    this.order_no = this.$route.query.order_no ? this.$route.query.order_no : this.order_no;
    console.log(this.order_no);
    this.getOrderInfo();
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timerBuyer);
      this.timerBuyer = null;
    });
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'selleOrder'
      }]
    });
    aplus_queue.push({
      action: 'aplus.record',
      arguments: ['selleOrderPage', 'CLK']
    });
  },
  methods: {
    onCopy: function (e) {
      this.$toast('复制成功');
    },
    onError () {
      this.$toast('版本过低，请手动复制');
    },
    linkSellerNotice () {
      let params = {
        to_user_no: this.orderInfo.buyer.user_no
      };
      this.$axios_notice.post('/notice/createImRelation', params).then((res) => {
        let data = res.data;
        if (data.code === 0 && +data.data.result === 1) {
          location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/noticeMessage?user_no=${this.orderInfo.buyer.user_no}`;
        } else {
          this.$toast(data.message);
        }
      });
    },
    // 跳转卡密分配页面
    goSecretList () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/myCardSecret?order_no=${this.order_no}`;
    },
    goProductList () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/productList?template_no=${this.orderInfo.template_no}`;
    },
    getOrderInfo () {
      // /orders/getGroupPurchasingOrder?order_no=${this.order_no}
      let url = `/orders/getGroupPurchasingOrder?order_no=${this.order_no}`;
      this.$axios_orders.get(url).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.orderInfo = data.data;
          if (+this.orderInfo.order_status === 1 && this.orderInfo.pay_close_time_stamp) {
            this.timerBuyer = setInterval(() => {
              let current = (new Date()).getTime();
              if (this.orderInfo.pay_close_time_stamp > (current / 1000)) {
                this.timeOrder = this.$parent.formatSeconds(this.orderInfo.pay_close_time_stamp - (current / 1000));
              } else {
                clearInterval(this.timerBuyer);
                this.getOrderInfo();
              }
            }, 1000);
          }
        } else {
          this.$toast(data.message);
        }
        this.inited = true;
      });
    },
    // 卖家去发货
    sellerGo () {
      this.$router.push({
        name: 'chooseExpress',
        query: {order_no: this.order_no}
      });
    },
    // 查看物流信息
    goWMS () {
      this.$router.push({
        name: 'wms',
        query: {order_no: this.order_no}
      });
    },
    // 跳转商品详情
    goGoodsDetail () {
      this.$router.push({
        name: 'goodsDetail',
        query: {goods_no: this.orderInfo.goods_no}
      });
    },
    seeMergeOrder () {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['sellerOrderGoMerge', 'CLK']
      });
      location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/sellerOrder?order_no=${this.orderInfo.parent_order_no}`;
    }
  }
};
</script>
<style lang="less" scoped>
.seller-order {
    font-size: 28px;
    color: #2D2F32;
    padding-bottom: 112px;
    background: #F1F3F4;
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
        .freight {
            background: #FF8507;
            color: #fff;
            padding: 4px 14px;
            border-radius: 4px;
            font-weight: 400;
            margin-left: 14px;
        }
    }
    .value-order-info {
        span {
            font-size: 28px;
            color:#2D2F32
        }
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
            line-height: 50px;
            .get-tips {
                max-width: 530px;
                color:rgba(255, 255, 255, .5);
                font-size:24px;
            }
            .new-tips {
                max-width: 530px;
                font-size: 28px;
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
            position: relative;
            .order-type-title {
                width: 150px;
                font-weight: bold;
                flex-shrink: 0;
            }
            .order-buyer-adress {
                width:480px
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
    .order-price {
        color: #FF5307;
        font-size: 36px;
        display: inline-flex;
        align-items: center;
        .fuhao {
            font-size: 24px;
            font-weight: 400;
            margin-left: 10px;
        }
        .price-text {
            font-size: 28px;
            font-weight: bold;
            color: #2D2F32;
        }
        .change-express {
          font-size: 28px;
          background: #30B544;
          padding: 3px 20px;
          border-radius: 26px;
          color: #fff;
        }
        .freight-input {
          width: 90px;
          padding: 0;
          font-size: 36px;
          font-weight: bold;
        }
    }
    .van-cell::after {
        border:none
    }
    .remark-page {
        height:100vh
    }
}
@media only screen 
  and (device-width : 375px) 
  and (device-height : 812px) 
  and (-webkit-device-pixel-ratio : 3) {
    .seller-order {
        padding-bottom: 135px;
    }
}
</style>
