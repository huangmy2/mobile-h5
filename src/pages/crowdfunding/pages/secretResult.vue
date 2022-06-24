<template>
  <div class="product-list">
    <div v-if="productTitle" class="product-title">{{productTitle}}</div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
      >
        <div class="data-list-product">
          <van-cell v-for="(item, index) in produceListDetail"  :key="index" :title="item.username" is-link :value="item.count + '份卡密'" @click="linkInfo(item.user_no)" />
        </div>
      </van-list>
    </van-pull-refresh>
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
      isApp: !!browers.appUA,
      produceListDetail: [],
      productTitle: ''
    };
  },
  created () {
    // this.getDataBase();
  },
  mounted () {
    this.goods_no = this.$route.query.goods_no ? this.$route.query.goods_no : this.goods_no;
    // this.getProduceDetail();
  },
  methods: {
    linkInfo (no) {
      location.href = `${location.origin}/webapp/crowdfunding.html#/secretResultInfo?goods_no=${this.goods_no}&user_no=${no}`;
    },
    onLoad () {
      // /goods/cardSecretList?goods_no=${this.goods_no}
      if (this.refreshing) {
        this.produceListDetail = [];
        this.refreshing = false;
      }
      let url = this.next ? `${this.next}` : `/goods/cardSecretList?goods_no=${this.goods_no}`;
      this.$axios_goods.get(url).then((res) => {
        let data = res.data;
        if (data.code === 0 && data.data) {
          if (this.next !== data.data.next) {
            this.produceListDetail = data.data.list ? this.produceListDetail.concat(data.data.list) : this.produceListDetail;
            this.productTitle = data.data.title;
            this.next = data.data.next_url;
          }
        }
        // 数据全部加载完成
        this.loading = false;
        this.inited = true;
        if (data.code !== 0 || !data.data.list || !data.data.list.length) {
          this.finished = true;
        }
      });
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false;
      this.produceListDetail = [];
      this.next = '';
      this.loading = true;
      this.onLoad();
    },
    searchFun () {
      this.finished = false;
      this.produceListDetail = [];
      this.next = '';
      this.loading = true;
      this.onLoad();
    }
  }
};
</script>
<style lang="less">
.product-list {
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
  }
}
</style>
