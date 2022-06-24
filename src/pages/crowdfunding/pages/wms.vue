<template>
  <div class="order-wms">
    <div v-if="!wmsData && !inited">
      <skeleton :height="125"></skeleton>
      <skeleton :height="500"></skeleton>
    </div>
    <div class="goods-info" v-if="wmsData" @click="goGoodsDetail">
      <div class="goods-img"><img :src="wmsData.goods.pic" alt=""></div>
      <div class="goods-con">
        <p class="tit">{{wmsData.order.order_status_desc}}</p>
        <p v-if="!wmsData.if_parent_order">{{wmsData.goods.title}}</p>
      </div>
    </div>
    <div class="wms-content" v-if="wmsData && wmsData.express">
      <p class="wms-title">{{wmsData.express.express_name}} {{wmsData.express.express_no}}
        <span class="copy" v-if="wmsData.express.express_no" v-clipboard:copy="wmsData.express.express_no" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
      </p>
      <div class="wms-info" v-if="wmsData.express.express_locus && wmsData.express.express_locus.length">
        <div v-for="(item, index) in wmsData.express.express_locus" :key="index" :class="index == 0 ? 'wms-item wms-first' : index == (wmsData.express.express_locus.length-1) ? 'wms-item wms-last' : 'wms-item'">
          <p class="status-tit">{{item.time}}</p>
          <p>{{item.content}}</p>
        </div>
      </div>
      <div v-else class="no-data">暂未查询到物流信息</div>
    </div>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
import skeleton from '../components/skeleton.vue';
export default {
  data() {
    return {
      order_no: _getQuery('order_no') || '',
      inited: false,
      wmsData: null
    };
  },
  created() {},
  components: {
    skeleton
  },
  mounted() {
    this.order_no = this.$route.query.order_no
      ? this.$route.query.order_no
      : this.order_no;
    console.log(this.order_no);
    this.getWMS();
    const { aplus_queue } = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [
        {
          is_auto: false
        },
        {
          type: 'pv',
          page: 'wms'
        }
      ]
    });
  },
  methods: {
    onCopy: function(e) {
      this.$toast('复制成功');
    },
    onError() {
      this.$toast('版本过低，请手动复制');
    },
    getWMS() {
      this.$axios_orders.get(`/orders/getGroupPurchasingOrderExpressLocus?order_no=${this.order_no}`).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.wmsData = data.data;
        } else {
          this.$toast(data.message);
        }
        this.inited = true;
      });
    },
    // 跳转商品详情
    goGoodsDetail() {
      if (this.wmsData && this.wmsData.goods && this.wmsData.goods.goods_no) {
        this.$router.push({
          name: 'goodsDetail',
          query: { goods_no: this.wmsData.goods.goods_no }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.order-wms {
  color: #2d2f32;
  .goods-info {
    display: flex;
    background: #fff;
    padding: 30px;
    margin: 10px 0;
    .goods-img {
      display: inline-block;
      width: 200px;
      height: 200px;
      background: #f1f3f4;
      overflow: hidden;
      margin-right: 20px;
      position: relative;
      flex-shrink: 0;
      img {
        min-width: 200px;
        min-height: 200px;
        max-height: 200px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .goods-con {
      color: #999;
      font-size: 28px;
      .tit {
        color: #2d2f32;
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
  }
  .wms-content {
    background: #fff;
    padding: 30px 30px 0;
    .wms-title {
      font-size: 28px;
      display: flex;
      justify-content: space-between;
      .copy {
        color: #30b544;
      }
    }
    .wms-info {
      padding: 50px 20px 0;
      color: #999999;
      font-size: 28px;
      .wms-item {
        padding-bottom: 40px;
        padding-left: 40px;
        border-left: 5px solid #f1f3f4;
        position: relative;
        .status-tit {
          line-height: 30px;
          margin-bottom: 8px;
          font-weight: bold;
        }
      }
      .wms-item:before {
        content: " ";
        display: inline-block;
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #cdb0e2;
        left: -14px;
        top: 2px;
      }
      .wms-first:before {
        background: #30b544;
      }
      .wms-first {
        .status-tit {
          color: #30b544;
        }
      }
      .wms-last {
        border-left: 5px solid #fff;
      }
    }
    .no-data {
      color: #999;
      font-size: 28px;
      text-align: center;
      padding: 80px 0;
    }
  }
}
</style>
