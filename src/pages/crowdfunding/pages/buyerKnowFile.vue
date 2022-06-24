<template>
    <div class="buyer-know" v-if="goodsInfo">
        <div v-html="goodsInfo.toast.notice"></div>
        <div v-html="goodsInfo.toast.rule"></div>
    </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
export default {
  data () {
    return {
      goods_no: _getQuery('goods_no') || '',
      goodsInfo: null
    };
  },
  created () {
  },
  mounted () {
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    this.getGoodsDetail();
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'buyerKnowFile'
      }]
    });
  },
  methods: {
    getGoodsDetail() {
      this.$axios_goods.get(`/goods/groupPurchasingGoodsDetail?goods_no=${this.goods_no}`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.goodsInfo = data.data;
        } else {
          this.$toast(data.message);
        }
        console.log(data);
      });
    }
  }
};
</script>
<style lang="less">
.buyer-know {
    background: #fff;
    font-size: 28px;
    padding: 30px;
    height: 100vh;
    box-sizing: border-box;
    overflow: auto;
    div {
        margin-bottom: 20px;
        line-height: 45px;
    }
}
</style>