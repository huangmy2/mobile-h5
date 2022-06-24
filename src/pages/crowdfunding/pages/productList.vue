<template>
  <div class="product-list">
    <form action="javascript:return true">
      <van-search
        v-model="searchWords"
        show-action
        shape="round"
        autofocus
        type="search"
        placeholder="搜搜你想找的球星卡"
        @search="searchFun"
        @clear="searchFun"
      >
        <template slot="action">
          <div class="search-btn" @click="searchFun">开始筛选</div>
        </template>
      </van-search>
    </form>
    <div v-if="productTitle" class="product-title">{{productTitle}}</div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
      >
        <div class="data-list-product">
          <table>
            <tr>
              <th>球员英文名</th><th>球员中文名</th><th>球队英文名</th><th>球队中文名</th><th>卡种</th><th>卡编</th><th>卡号</th>
            </tr>
            <tr v-for="(item, index) in produceListDetail" :key="index">
              <td>{{item.card_player_english}}</td><td>{{item.card_player}}</td><td>{{item.card_team_english}}</td><td>{{item.card_team}}</td><td>{{item.card_set}}</td><td>{{item.card_seq}}</td><td>{{item.card_num}}</td>
            </tr>
          </table>
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
      template_no: _getQuery('template_no') || '',
      isApp: !!browers.appUA,
      produceListDetail: [],
      productTitle: ''
    };
  },
  created () {
    // this.getDataBase();
  },
  mounted () {
    this.template_no = this.$route.query.template_no ? this.$route.query.template_no : this.template_no;
    // this.getProduceDetail();
  },
  methods: {
    onLoad () {
      if (this.refreshing) {
        this.produceListDetail = [];
        this.refreshing = false;
      }
      let url = this.next ? `${this.next}&search=${this.searchWords}` : `/goods/getCardsList?template_no=${this.template_no}&search=${this.searchWords}`;
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
  background: #fff;
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
    background: #fff;
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
