<template>
  <div class="set-open-card">
    <van-sticky>
      <div class="search-wrap">
        <van-search class="report-search-input" v-model="searchValue" placeholder="搜索球队、球员、卡种" :clearable="true" />
        <b class="search-btn" @click="searchFn">搜索</b>
      </div>
    </van-sticky>
    <p class="title" v-if="title">{{title}}</p>
    <div class="open-card-list" v-if="reportList&&reportList.length">
      <div class="open-card-item" v-for="elem,index in reportList" @click="editReport(elem)">
        <div class="card-item-tit">
          <span>{{elem.card_secret}}</span>
          <b>编辑
            <em>></em>
          </b>
        </div>
        <template>
          <p class="has-num" v-if="elem.hit_count">中卡{{elem.hit_count}}张</p>
          <div class="item-list">
            <img :src="e.url" v-for="(e,i) in elem.attachment_info" alt="">
          </div>
        </template>
      </div>
    </div>
    <div class="no-data" v-else>暂无数据</div>
    <div class="preview-report">
      <p class="preview-btn" @click="previewReport">预览拆卡报告</p>
    </div>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';

export default {
  data() {
    return {
      order_no: _getQuery('order_no') || '', // todo
      goodsNo: '', // todo
      searchValue: '',
      title: '',
      canEdit: true, // 是否可以编辑报告todo
      reportList: [{}, {}, {}]
    };
  },
  mounted() {
    this.goodsNo = _getQuery('goods_no') || (this.$route && this.$route.query && this.$route.query.goods_no);
    this.getCardListData();
  },
  methods: {
    previewReport() {
      // 预览拆卡报告
      this.$router.push({
        name: 'productReport',
        query: {
          goodNo: this.goodsNo
        }
      });
    },
    getCardListData() {
      this.$axios_goods.get(`/goods/getSplitCardsPage?goods_no=${this.goodsNo}&search=${this.searchValue}`).then(res => {
        let data = res.data;
        if (data.code === 0) {
          this.title = data.data && data.data.title;
          this.reportList = data.data && data.data.list;
          this.canEdit = data.data.can_edit;
        } else {
          this.$toast(data.message);
        }
      });
    },
    searchFn() { // 筛选卡片
      this.getCardListData();
    },
    editReport(elem) { // 编辑卡片
      if (!this.canEdit) {
        return false;
      }
      this.$router.push({
        name: 'editCardMessage',
        query: {
          id: elem.secret_id
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.set-open-card {
  .search-wrap {
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
    display: flex;
    align-items: center;
    .van-search__content {
      width: 506px;
      height: 70px;
      background: #f1f3f4;
      border-radius: 35px;
    }
    .report-search-input {
      display: inline-block;
    }
    .search-btn {
      width: 162px;
      height: 70px;
      line-height: 70px;
      background: #30b544;
      border-radius: 35px;
      font-size: 28px;
      display: inline-block;
      font-weight: normal;
      color: #fff;
      text-align: center;
    }
  }
  .title {
    width: 750px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    background: #bbbbbb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 20px;
    box-sizing: border-box;
    font-weight: 600;
    font-size: 28px;
  }
  .open-card-list {
    padding-bottom: 100px;
    .open-card-item {
      padding: 0 24px;
      box-sizing: border-box;
      background: #fff;
      border-bottom: 1px solid #f1f3f4; /*no*/
      .card-item-tit {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 88px;
        background: #ffffff;
        font-size: 28px;
        span{
          max-width: 80%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        b {
          font-weight: normal;
          em {
            color: #999ea2;
          }
        }
      }
      .has-num {
        width: 118px;
        height: 32px;
        background: #ff5307;
        border-radius: 8px;
        font-size: 22px;
        font-weight: 400;
        color: #ffffff;
        line-height: 32px;
        text-align: center;
        margin-bottom: 20px;
      }
      .item-list {
        width: 100%;
        height: auto;
        overflow-x: scroll;
        white-space: nowrap;
        overflow-y: hidden;
        padding-bottom: 20px;
        img {
          width: 200px;
          height: 200px;
          margin-right: 10px;
        }
      }
    }
  }
  .no-data {
    text-align: center;
    font-size: 26px;
    color: #999ea2;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .preview-report {
    width: 100%;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 20px 30px;
    box-sizing: border-box;
    .preview-btn {
      width: 234px;
      height: 70px;
      line-height: 70px;
      color: #fff;
      text-align: center;
      background: #30b544;
      border-radius: 35px;
      float: right;
      font-size: 28px;
    }
  }
}
</style>
