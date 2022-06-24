<template>
    <div class="buyer-order">
        <div class="before-loading" v-if="!orderInfo && !inited">
          <skeleton :height="115"></skeleton>
          <skeleton :height="60"></skeleton>
          <skeleton :height="165"></skeleton>
          <skeleton :height="40"></skeleton>
          <skeleton :height="40"></skeleton>
          <skeleton :height="40"></skeleton>
          <skeleton :height="165"></skeleton>
        </div>
        <div class="order-content" v-if="orderInfo">
            <!-- 1待支付，2支付完成/待发货，3已发货/待收货，4已送达，5已完成 6已退款 -->
            <div class="header-info" v-if="+orderInfo.order_status === 1">
                <img class="bg-img" src="../assets/promise-bg.png" alt="">
                <div class="header-text">
                    待付金额：￥{{orderInfo.order_price}}
                    <p v-if="!goods_no">剩余时间：
                      <van-count-down :time="timeOrder" format="mm分ss秒" @finish="getOrderInfo"/>
                    </p>
                </div>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 2">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    已付款
                </div>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 3">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    待收货
                </div>
                <div class="header-btn-dom">
                    <span class="btn-one" @click="goWMS">查看物流</span>
                    <span class="btn-two" @click="showReceive = true">确认收货</span>
                </div>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 4">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    已送达
                </div>
                <div class="header-btn-dom">
                    <span class="btn-one" v-if="!orderInfo.if_child_order" @click="goWMS">查看物流</span>
                    <span class="btn-two" v-if="!orderInfo.if_child_order" @click="showReceive = true">确认收货</span>
                </div>
            </div>
            <div class="header-info header-orange" v-if="+orderInfo.order_status === 5">
                <img class="bg-img" src="../assets/order-bg.png" alt="">
                <div class="header-text">
                    已完成
                    <p>订单结束</p>
                </div>
                <span class="header-button" v-if="!orderInfo.if_child_order" @click="goWMS">查看物流</span>
            </div>
            <div class="header-info header-purple" v-if="+orderInfo.order_status > 5">
                <img class="bg-img" src="../assets/promise-bg.png" alt="">
                <div class="header-text" v-if="+orderInfo.order_status === 6">已退款</div>
            </div>
            <van-cell
                center
                :title="orderInfo.address_info.address"
                title-class="title-address"
                label-class="label-address"
                :label="orderInfo.address_info.username + ' ' + orderInfo.address_info.phone"
                :is-link="false"/>
            <div class="order-item">
                <div class="seller-info" @click="goUserIndex(orderInfo.UserInfo.id)">
                    <img :src="orderInfo.UserInfo.avatar" alt="">{{orderInfo.UserInfo.username}}
                </div>
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
            </div>
            <div class="order-item">
                <div class="order-type-dom">
                    <van-cell title="拼团信息" title-class="title-order" value-class="value-order-info"/>
                    <van-cell title="卡片列表" title-class="title-order" value-class="value-order-info" is-link value="查看列表" @click="goProductList"/>
                    <van-cell title="拼团进度" title-class="title-order" value-class="value-order-info" :value="orderInfo.stock + '/' + orderInfo.total_count" />
                    <van-cell v-if="+orderInfo.order_status > 1" title="卡密信息" title-class="title-order" value-class="value-order-info" is-link value="查看更多" @click="goSecretList"/>
                    <div v-if="+orderInfo.order_status > 1" class="secret-first" v-for="item in orderInfo.card_secret" @click="goSecretList">
                      <span>{{item.secret}}</span><span class="secret-first-sl" v-if="item.is_select == 1">中卡</span>
                    </div>
                </div>
            </div>
            <div class="order-item">
                <div class="order-type-dom">
                    <van-cell title="价格明细" title-class="title-order"/>
                    <van-cell title="商品总价" title-class="title-order">
                        <template #right-icon>
                            <span class="order-price"><span class="fuhao">￥</span>{{orderInfo.order_price}}</span>
                        </template>
                    </van-cell>
                    <van-cell title="运费" title-class="title-order">
                        <template #right-icon>
                            <span class="order-price baoyou">已免运费</span>
                        </template>
                    </van-cell>
                </div>
                <div class="order-type-dom">
                    <van-cell title="">
                        <template #right-icon>
                            <span class="order-price"><span class="price-text">合计  </span><span class="fuhao">￥</span>{{orderInfo.order_price}}</span>
                        </template>
                    </van-cell>
                </div>
            </div>
            <div class="seller-order-item" style="margin-top:5px">
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
        <div class="bottom-btn-dom buyer-bottom" v-if="orderInfo && +orderInfo.order_status === 1">
            <span class="order-price"><span class="fuhao">￥</span>{{orderInfo.order_price}}</span>
            <p>
                <span class="btn" @click="submitOrder()">去支付</span>
            </p>
        </div>
        <div class="bottom-btn-dom" v-else>
            <span class="btn-aff" @click="linkFeedback()">申请售后</span>
            <span class="btn" style="background: #FF6E11" v-if="orderInfo && !orderInfo.if_have_report" @click="repeatGoods()">再来一组</span>
            <span class="btn" v-if="orderInfo && orderInfo.if_have_report" @click="goCardReport()">查看拆卡报告</span>
        </div>
        <van-dialog v-model="showReceive" :closeOnClickOverlay="true" theme='round-button' :showConfirmButton="false">
            <div class="dialog-dom">
              <p class="title">确认收货后将无法退款，请认真检查</p>
              <p>
                <span class="apply-btn i-know apply-als" @click="showReceive=false">我再想想</span>
                <span  class="apply-btn i-know" @click="confirmDesc">确认收货</span>
              </p>
            </div>
        </van-dialog>
        <van-action-sheet
            v-model="showParcel"
            :actions="actions"
            :round="false"
            theme="round-button"
            cancel-text="取消"
            description="快递选择"
            close-on-click-action
            @select="onSelectAction"
        />
    </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
import skeleton from '../components/skeleton.vue';
export default {
  data () {
    return {
      order_no: _getQuery('order_no') || '',
      goods_no: _getQuery('goods_no') || '', // 一口价商品通过商品编号取数据
      order_type: _getQuery('order_type') || '',
      addressShow: false,
      addressID: '',
      area: '',
      addressData: null,
      showParcel: false,
      actions: [{ name: '京东快递' }, { name: '小件达' }],
      remark: '',
      orderInfo: null,
      showReceive: false,
      timeOrder: '',
      timerBuyer: null,
      inited: false
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
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    this.order_type = this.$route.query.order_type ? this.$route.query.order_type : this.order_type;
    console.log(this.order_no);
    this.getOrderInfo();
    if (this.$route.query && this.$route.query.addressID) {
      this.addressID = this.$route.query.addressID;
      this.getAddress();
    }
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
        page: 'buyerOrder'
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
    repeatGoods () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/confirmOrder?goods_no=${this.orderInfo.goods_no}`;
    },
    goCardReport () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/openCardReport?goods_no=${this.orderInfo.goods_no}`;
    },
    // 查看物流信息
    goWMS () {
      this.$router.push({
        name: 'wms',
        query: {order_no: this.order_no}
      });
    },
    // 延迟收货事件
    delayGet () {
      this.showDelay = false;
      let params = {order_no: this.order_no};
      this.$axios_orders.post(`/orders/delayReceive`, params).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.$toast('延迟收货成功');
          this.getOrderInfo();
          this.$forceUpdate();
        } else {
          this.$toast(data.message);
        }
      });
    },
    getOrderInfo () {
      let url = `/orders/getGroupPurchasingOrder?order_no=${this.order_no}&order_type=${this.order_type}`;
      this.$axios_orders.get(url).then(res => {
        let data = res.data;
        if (data.code === 0) {
          this.orderInfo = data.data;
          if (+this.orderInfo.order_status === 1 && this.orderInfo.pay_close_time_stamp) {
            let current = (new Date()).getTime();
            if (this.orderInfo.pay_close_time_stamp > (current / 1000)) {
              this.timeOrder = (this.orderInfo.pay_close_time_stamp * 1000) - current;
            }
          }
        } else {
          this.$toast(data.message);
        }
        this.inited = true;
      });
    },
    // 跳转卡密分配页面
    goSecretList () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/myCardSecret?order_no=${this.order_no}`;
    },
    // 跳转卡片列表页面
    goProductList () {
      location.href = `${location.origin}/webapp/crowdfunding.html#/productList?template_no=${this.orderInfo.template_no}`;
    },
    // 跳转商品详情
    goGoodsDetail () {
      this.$router.push({
        name: 'goodsDetail',
        query: {goods_no: this.orderInfo.goods_no}
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
    // 确认收货事件
    confirmDesc () {
      let params = {order_no: this.order_no};
      this.$axios_orders.post(`/orders/groupPurchasingConfirmOrder`, params).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.$toast('确认收货成功');
          this.getOrderInfo();
          this.$forceUpdate();
        } else {
          this.$toast(data.message);
        }
      });
      this.showReceive = false;
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
    // 选择快递事件，暂时不做
    onSelectAction (action, index) {
      console.log(action);
    },
    getAddress () {
      this.$axios_passport.get(`/user/getAddress?id=${this.addressID}`).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.addressData = data.data[0];
          this.onConfirm(this.addressData.location);
        }
      });
    },
    // 申请售后，跳转反馈页
    linkFeedback () {
      this.$router.push({
        name: 'feedback',
        query: {order_no: this.order_no}
      });
    },
    linkSellerNotice () {
      let params = {
        to_user_no: this.orderInfo.seller.user_no
      };
      this.$axios_notice.post('/notice/createImRelation', params).then((res) => {
        let data = res.data;
        if (data.code === 0 && +data.data.result === 1) {
          location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/noticeMessage?user_no=${this.orderInfo.seller.user_no}`;
        } else {
          this.$toast(data.message);
        }
      });
    },
    seeMergeOrder () {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['buyerOrderGoMerge', 'CLK']
      });
      location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/buyerOrder?order_no=${this.orderInfo.parent_order_no}`;
    },
    // 待支付状态订单，提交订单，跳转订单收银台
    submitOrder () {
      this.$router.push({
        name: 'pay',
        query: {order_no: this.order_no}
      });
    }
  }
};
</script>
<style lang="less">
.buyer-order {
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
        .shop-item {
            padding: 0 30px 30px 30px;;
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
    .baoyou {
      font-size: 28px;
      color: #666;
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
            .van-count-down {
              display: inline-block;
              color: #fff;
              font-size: 32px;
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
}
@media only screen 
  and (device-width : 375px) 
  and (device-height : 812px) 
  and (-webkit-device-pixel-ratio : 3) {
    .buyer-order {
        padding-bottom: 135px;
    }
}
</style>
