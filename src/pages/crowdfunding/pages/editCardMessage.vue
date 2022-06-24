<template>
  <div class="edit-card-message">
    <p class="edit-title"><b>卡密名称</b><span>{{cardSecret}}</span></p>
    <p class="edit-title"><b>中卡数量</b><input type="text" v-model="getCardNum" placeholder="请填写中卡数量"></p>
    <div class="upload-card-img">
      <van-uploader v-model="fileList" :after-read="afterImage" :before-delete="delImage" upload-icon="https://img1.qunliao.info/fastdfs6/M00/AB/A3/rBUESWKfDqmAGuTvAACNi-9Hh8A439.png" />
    </div>
    <div class="save-wrap">
      <p class="save-btn" @click="saveInfo">保存</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardSecret: '', // 卡密
      getCardNum: null, // 中卡数量
      cardId: '',
      submitPicIdArr: [], // 图片id数据
      fileList: []
    };
  },
  mounted() {
    this.getId();
    this.getCardData();
  },
  methods: {
    getId() {
      this.cardId = this.$route && this.$route.query && this.$route.query.id;
    },
    getCardData () { // 获取卡片数据
      this.$axios_goods.get(`/goods/getSecretEditPage?secret_id=${this.cardId}`).then(res => {
        let data = res.data;
        if (data.code === 0) {
          this.fileList = data.data.attachment_info || [];
          this.cardSecret = data.data.card_secret;
          this.getCardNum = data.data.hit_count;
          if (this.fileList && this.fileList.length) {
            this.fileList.forEach((e, i) => {
              this.submitPicIdArr.push(Number(e.id));
            });
          }
        } else {
          this.$toast(data.message);
        }
      });
    },
    delImage (file, obj) {
      this.fileList.splice(obj.index, 1);
      this.submitPicIdArr.splice(obj.index, 1);
    },
    afterImage (file) {
      let formData = new FormData();
      if (file.content) {
        formData.append('file', file.file);
        file.status = 'uploading';
      } else {
        file.forEach(item => {
          formData.append('file', item.file);
          item.status = 'uploading';
        });
      }
      this.imageLoad = true;
      this.$axios_medias.post('/api/uploadImg', formData).then(res => {
        let data = res.data;
        if (data.code === 0 && data.data.length) {
          let status = true;
          data.data.forEach((item, index) => {
            if (item.id && +item.id !== 0) {
              this.submitPicIdArr.push(Number(item.id));
            } else {
              status = false;
              this.fileList.splice(index, 1);
            }
          });
          this.fileList.forEach(item => {
            item.status = 'success';
          });
          if (!status) {
            this.$toast('图片上传失败，请检查网络');
          }
        }
        this.imageLoad = false;
        console.log('this.submitPicIdArr', this.submitPicIdArr);
      });
    },
    saveInfo () { // 点击保存
      let data = {
        card_secret_id: Number(this.cardId),
        hit_count: Number(this.getCardNum),
        id: this.submitPicIdArr
      };
      this.$axios_goods.post(`/goods/editSplitReport`, data).then(res => {
        let data = res.data;
        if (data.code === 0) {
          this.$router.go(-1);
        } else {
          this.$toast(data.message);
        }
      });
    }
  }
};
</script>
<style lang="less">
  .edit-card-message{
    box-sizing: border-box;
    background: #fff;
    .edit-title{
      font-size: 28px;
      font-weight: 400;
      color: #2D2F32;
      line-height: 40px;
      margin-bottom: 12px;
      border-bottom: 1px solid #efefef;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      b{
        width: 120px;
        display: inline-block;
        margin-right: 20px;
      }
      input{
        border: none;
        line-height: 40px;
      }
      span{
        display: inline-block;
        width: 500px;
      }
    }
    .has-upload-num{
      width: 134px;
      height: 32px;
      line-height: 32px;
      background: #FF5307;
      border-radius: 8px;
      text-align: center;
      color: #FFFFFF;
      font-size: 22px;
      font-weight: normal;
      margin-bottom: 20px;
      display: block;
    }
    .van-uploader__upload{
      background: #F1F3F4;
    }
    .van-uploader__preview-image,.van-uploader__upload{
      width: 200px;
      height: 200px;
    }
    .upload-card-img{
      padding: 24px;
      .van-icon__image{
        width: 140px !important;
      }
    }
    .save-wrap{
      width: 100%;
      background: #ffffff;
      position: fixed;
      bottom: 0;
      left: 0;
      padding: 20px 30px;
      box-sizing: border-box;
      .save-btn {
        width: 234px;
        height: 70px;
        line-height: 70px;
        color: #fff;
        text-align: center;
        background: #30b544;
        border-radius: 35px;
        margin: 0 auto;
        font-size: 28px;
      }
    }
  }
</style>
