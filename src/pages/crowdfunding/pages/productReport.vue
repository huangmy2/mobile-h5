<template>
  <div class="product-report">
    <van-sticky>
      <div class="search-wrap">
        <van-search class="report-search-input" v-model="searchValue" placeholder="搜索球队、球员、卡种" :clearable="true" />
        <b class="search-btn" @click="searchFn">搜索</b>
      </div>
    </van-sticky>
    <p class="title" v-if="title">{{title}}</p>
    <div class="preview-list">
      <dl class="card-item" v-for="elem,index in cardList">
        <dt @click="previewBigImg(elem)">
          <template v-if="elem.attachment_info&&elem.attachment_info.length&&elem.attachment_info[0]&&elem.attachment_info[0].url"><img :src="elem.attachment_info[0].url" alt=""></template>
          <p class="no-img" v-else>暂未上传图片</p>
          <span class="upload-pic-num" v-if="elem.hit_count">中卡{{elem.hit_count}}张</span>
        </dt>
        <dd>
          <p v-if="elem.card_secret">卡密名称：{{elem.card_secret}}</p>
          <p v-if="elem.split_time">拆卡时间：{{elem.split_time}}</p>
          <p v-if="elem.username">中卡用户：{{elem.username}}</p>
        </dd>
      </dl>
    </div>
    <div class="preview-report">
      <p class="preview-btn" @click="generate">生成拆卡报告</p>
    </div>
    <van-image-preview v-model="show" :images="imagesList" @change="onChange">
    </van-image-preview>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
export default {
  data() {
    return {
      getGoodsNo: '',
      order_no: _getQuery('') || '',
      searchValue: '',
      show: false,
      index: 0,
      title: '',
      cardList: [{}, {}],
      imagesList: [] // 预览大图
    };
  },
  mounted() {
    this.getGoodsNo = this.$route.query.goodNo || _getQuery('goodNo');
    this.getPreviewReportData();
  },
  methods: {
    onChange(index) {
      this.index = index;
    },
    getPreviewReportData() {
      this.$axios_goods.get(`/goods/getSplitCardsPage?goods_no=${this.getGoodsNo}&search=${this.searchValue}`).then(res => {
        let data = res.data;
        if (data.code === 0) {
          this.title = data.data && data.data.title;
          this.cardList = data.data && data.data.list;
        } else {
          this.$toast(data.message);
        }
      });
    },
    generate() {
      this.$dialog
        .confirm({
          title: '生成拆卡报告？',
          message: '确认后不可修改，且立即通知中卡用户'
        })
        .then(() => {
          // on confirm
          this.submitData();
        })
        .catch(() => {
          // on cancel
        });
    },
    submitData() {
      let data = {
        goods_no: this.getGoodsNo
      };
      this.$axios_goods.post(`/goods/finishReport`, data).then(res => {
        let data = res.data;
        if (data.code === 0) {
          this.$toast('已生成拆卡报告');
        } else {
          this.$toast(data.message);
        }
      });
    },
    searchFn() { // 筛选卡片
      this.getPreviewReportData();
    },
    previewBigImg(elem) {
      this.imagesList = [];
      if (elem && elem.attachment_info && elem.attachment_info.length) {
        elem.attachment_info.forEach((e, i) => {
          this.imagesList.push(e.url);
        });
        this.show = true;
      }
    }
  }
};
</script>
<style lang="less">
.product-report {
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
    font-size: 28px;
    font-weight: 600;
  }
  .preview-list {
    padding-bottom: 100px;
    .card-item {
      display: flex;
      padding: 28px 24px 28px;
      border-bottom: 1px solid #f1f3f4;
      background: #fff;
      dt {
        width: 200px;
        height: 200px;
        background: #d8d8d8;
        margin-right: 20px;
        position: relative;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
        .no-img {
          font-size: 28px;
          font-weight: 400;
          color: #999999;
          text-align: center;
          margin-top: 85px;
        }
        .upload-pic-num {
          padding: 0 10px;
          height: 30px;
          background: #2d2f32;
          border-radius: 10px 0px 0px 0px;
          position: absolute;
          bottom: 0;
          right: 0;
          color: #fff;
          text-align: center;
          font-size: 22px;
        }
      }
      dd {
        color: #2d2f32;
        font-size: 28px;
        width: 480px;
        margin-top: 10px;
        p {
          font-weight: 400;
          color: #2d2f32;
          line-height: 40px;
          margin-bottom: 12px;
        }
      }
    }
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
    }
  }
}
.van-dialog__confirm {
  color: #30b544 !important;
}
</style>
