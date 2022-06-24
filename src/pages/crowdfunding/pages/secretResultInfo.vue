<template>
  <div class="product-list-info">
    <div v-if="productTitle" class="product-title">{{productTitle}}</div>
    <div v-if="produceListDetail[0]" class="secret-name">
      {{produceListDetail[0].username}}
    </div>
    <div class="data-list-product">
      <div v-for="(item, index) in produceListDetail" :key="index" class="product-item-info">
          {{item.secret_name}}
      </div>
    </div>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
export default {
  data () {
    return {
      searchWords: '',
      loading: false,
      finished: false,
      refreshing: false,
      next: '',
      goods_no: _getQuery('goods_no') || '',
      user_no: _getQuery('user_no') || '',
      produceListDetail: [],
      productTitle: ''
    };
  },
  created () {
    // this.getDataBase();
  },
  mounted () {
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    this.user_no = this.$route.query.user_no ? this.$route.query.user_no : this.user_no;
    this.getDetail();
  },
  methods: {
    getDetail () {
      let url = `/goods/secretDetail?goods_no=${this.goods_no}&user_no=${this.user_no}`;
      this.$axios_goods.get(url).then((res) => {
        let data = res.data;
        if (data.code === 0 && data.data) {
          this.produceListDetail = data.data.secret_info;
          this.productTitle = data.data.title;
        }
      });
    }
  }
};
</script>
<style lang="less">
.product-list-info {
  width: 100%;
  color: #2D2F32;
  background: #F1F3F4;
  .product-title {
    background: #bbbbbb;
    color: #2D2F32;
    font-weight: bold;
    font-size: 28px;
    padding: 20px 30px;
  }
  .secret-name {
    font-weight: bold;
    font-size: 28px;
    padding: 20px 30px; 
  }
  .van-pull-refresh__track {
    min-height: calc(~"100vh - 117px");
  }
  .search-btn {
    background: #30B544;
    color: #fff;
    width: 160px;
    height: 70px;
    line-height: 70px;
    border-radius: 50px;
    text-align: center;
  }
  .van-search__content {
    background: #F1F3F4;
  }
  .van-search .van-cell {
    padding: 14px 15px 14px 0;
  }
  .data-list-product {
    width: 100%;
    overflow: auto;
    table {
      width: max-content;
      th, td {
        padding: 24px;
        width: 200px;
        font-size: 24px;
        border-bottom: 2px solid #F1F3F4;
      }
      th {
        background: #F1F3F4;
        font-weight: bold;
      }
      th:first-child {
        width: 400px;
      }
    }
    .product-item-info {
        background: #fff;
        padding: 20px 30px;
        margin: 0 24px 24px 24px;
    }
  }
}
</style>
