<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <div class="list-item">
          <div class="list-left">
              <Card v-for="(item, index) in list" :key="index"  v-if="index % 2 == 0" :cardData="item" :tag="tag"></Card>
          </div>
          <div class="list-right">
              <Card v-for="(item, index) in list" :key="index" :cardData="item" v-if="index % 2 != 0"></Card>
          </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import Card from './card.vue';
export default {
  data () {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
      page: 0,
      next: '',
      loadingList: false
    };
  },
  props: {
    tag: null,
    keyword: '',
    sort: '0',
    goods: null,
    searchType: null,
    filterType: null
  },
  watch: {
    tag(val) {
      this.finished = false;
      this.getNewData();
    },
    sort(val) {
      this.finished = false;
      this.getNewData();
    },
    filterType (val) {
      this.finished = false;
      this.getNewData();
    },
    searchType (val) {
      this.finished = false;
      this.getNewData();
    },
    goods(val) {
      this.finished = false;
      this.getNewData();
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    getNewData() {
      this.list = [];
      this.next = '';
      this.onLoad();
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false;
      this.list = [];
      this.next = '';
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      let url;
      if (this.$props.tag || +this.$props.tag === 0) {
        url = this.next ? this.next : `/goods/getGroupPurchasingList?category_id=${this.$props.tag}`;
      } else {
        url = this.next ? this.next : `/goods/getGoodsList`;
      }
      this.$axios_goods.get(url).then((res) => {
        let data = res.data;
        if (data.code === 0 && data.data && data.data.list) {
          if (this.next !== data.data.next_url) {
            this.list = this.list.concat(data.data.list);
            this.next = data.data.next_url;
          }
        }
        // 数据全部加载完成
        this.loading = false;
        if (data.code !== 0 || !data.data.list || !data.data.list.length) {
          this.finished = true;
        }
      });
    }
  },
  components: {
    Card
  }
};
</script>
<style lang="less">
.list-item {
    box-sizing: border-box;
    width: calc(~"100% - 60px");
    min-height: 230px;
    margin: 30px auto 2px;
    display: grid;
    grid-template-columns: 49% 49%;
    grid-gap: 15px 0;
    justify-content:space-between;
}
</style>
