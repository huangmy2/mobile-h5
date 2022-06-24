<template>
  <div class="feedback-wrap">
    <img src="../assets/loading.gif" alt="" class="loading" v-if="loadingShow">
    <div class="pop-wrap" v-if="popShow">
      {{alertMessage}}
    </div>
    <div class="toggle-tab clearfix">
      <span :class="{'selected':selectedToggle === 'feedBack'}" @click="toggle('feedBack')">意见反馈</span>
      <span :class="{'selected':selectedToggle === 'feedBackLog'}" @click="toggle('feedBackLog')">反馈记录</span>
    </div>
    <div class="feedback-part" v-if="selectedToggle === 'feedBack'">
      <div class="feedback-info-wrap">
        <div class="feedback-info">
          <div class="feedback-info-con">
            <div class="fb-content">
              <textarea class="fb-inform" placeholder="必须输入你要反馈的订单编号，和问题图片" v-model="userFbContent"></textarea>
            </div>
            <div class="fb-add-pic">
              <p class="add-pic" v-if="!selectPic">
              </p>
              <div class="img-list-wrap clearfix">
                <p class="img-list" v-for="(elem,index) in selectedImgList" :class="{'mar0': index%5 === 4}">
                  <img src="../assets/close.png" @click="deletePic(elem)" alt="" class="close-icon">
                  <span class="add-img"><img :src="elem.url" alt=""></span>
                </p>
                <p class="add-pic-btn" v-show="addImg">
                  <img src="../assets/add-icon.png" class="add-pic-icon">
                  <input type="file" accept="image/*" id="addFile" @change="selectImg($event)">
                </p>
              </div>
            </div>
          </div>
          <div class="fb-connect" v-if="isReport">
            <p class="feedback-title">您要举报的用户</p>
            <input type="text" name="" placeholder="请输入对方用户名" value="" v-model="reportUsername" class="connect-input report-con">
          </div>
          <div class="fb-connect">
            <p class="feedback-title">联系方式(至少填1项)</p>
            <ul>
              <li>
                <span>QQ</span>
                <input type="text" name="" placeholder="请填写QQ号码" value="" v-model="userFbConnectQq" class="connect-input">
              </li>
              <li>
                <span>手机</span>
                <input type="text" name="" placeholder="请填写手机号码" value="" v-model="userFbConnectTel" class="connect-input">
              </li>
              <li>
                <span>微信</span>
                <input type="text" name="" placeholder="请填写微信号码" value="" v-model="userFbConnectWx" class="connect-input">
              </li>
            </ul>
          </div>
          <!-- <div class="fb-connect">
            <p class="feedback-title">支付信息(退款问题请填写)</p>
            <ul>
              <li>
                <span>真实姓名</span>
                <input type="text" name="" placeholder="请填写真实姓名" value="" v-model="true_name" class="connect-input">
              </li>
              <li>
                <span>支付宝账号</span>
                <input type="text" name="" placeholder="请填写支付宝账号" value="" v-model="alipay_account" class="connect-input">
              </li>
            </ul>
          </div> -->
        </div>
        <p class="btn-wrap">
          <span class="submit" @click="submit">提交</span>
        </p>
      </div>
    </div>
    <div class="feedback-log-part" v-else>
      <div class="noData" v-if="!historyLog || !historyLog.length">
        暂无数据
      </div>
      <div class="feedback-log-list clearfix" v-else v-for="(ele,ind) in historyLog">
        <div class="fb-log-content">
          <p>{{ele.feedback_text}}</p>
        </div>
        <div class="fb-log-pic-list clearfix">
          <span class="fb-log-img" :class="{'mb20': ele.image.length > 5, 'mar0': key%5 === 4}" v-for="(value,key) in ele.image">
            <img :src="value" alt="">
          </span>
        </div>
        <p class="clearfix sub-inform">
          <span class="fb-status">{{ele.feedback_response}}</span>
          <span class="fb-date">{{formatTime(ele.created_at)}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
export default {
  data() {
    return {
      popShow: false,
      selectedToggle: 'feedBack',
      typeList: [],
      selectPic: false,
      selectedFbTypeIndex: null,
      alertMessage: '',
      selectedFbTypeContent: null, // 反馈类型
      userFbContent: '', // 反馈内容
      selectedImgList: [], // 反馈图片
      userFbConnectQq: '', // 联系方式
      userFbConnectTel: '', // 联系方式
      userFbConnectWx: '', // 联系方式
      historyLog: [],
      addImg: true,
      loadingShow: false,
      submitCanClick: true,
      listNoData: false,
      fingerprintShumei: '', // 安卓设备号
      ttDeviceId: null,
      reportUsername: '',
      isReport: false,
      selectedPopType: true, // 选择类型弹窗展示
      feedbackUserSelectType: '',
      true_name: '',
      alipay_account: '',
      order: _getQuery('order_no')
    };
  },
  created() {
    this.getFeedBackLogList();
  },
  mounted() {
    this.order = this.$route.query.order_no ? this.$route.query.order_no : this.order_no;
    if (this.order) {
      this.userFbContent = '订单编号：' + this.order;
    }
    const { aplus_queue } = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [
        {
          is_auto: false
        },
        {
          type: 'pv',
          page: 'feedback'
        }
      ]
    });
  },
  methods: {
    getFeedBackLogList() {
      this.$axios_notice.get(`/notice/getFeedbackList`).then(res => {
        this.historyLog = res && res.data && res.data.data;
      });
    },
    formatTime(val) {
      if (val) {
        let time = val.substr(5, 11);
        return time;
      }
    },
    deletePic(elem) {
      this.selectedImgList.forEach((e, i) => {
        if (elem.id === e.id) {
          this.selectedImgList.splice(i, 1);
          if (this.selectedImgList.length === 0) {
            this.selectPic = false;
          } else {
            this.selectPic = true;
            if (this.selectedImgList && this.selectedImgList.length < 5) {
              this.addImg = true;
            } else {
              this.addImg = false;
            }
          }
        }
      });
    },
    toggle(type) {
      if (type === 'feedBack') {
        this.selectedToggle = 'feedBack';
      } else if (type === 'feedBackLog') {
        this.selectedToggle = 'feedBackLog';
        this.getFeedBackLogList();
      }
    },
    selectImg($event) {
      let file = $event.target.files[0];
      if (file.size && file.size > 5242880) {
        this.alertMessage = '图片大小需小于5M';
        this.popShow = true;
        setTimeout(() => {
          this.popShow = false;
        }, 2000);
        return;
      }
      this.selectPic = true;
      let formData = new FormData();
      formData.append('file', file);
      this.$axios_medias.post('/api/uploadImg', formData).then(res => {
        let data = res.data;
        console.log(data);
        if (data.code === 0) {
          this.selectedImgList.push(data.data[0]);
          if (this.selectedImgList && this.selectedImgList.length >= 5) {
            this.addImg = false;
          } else {
            this.addImg = true;
          }
        } else {
          this.$toast(data.message);
        }
      }).catch(error => {
        console.log(error);
        console.log('网络错误，请稍后再重新上传');
      });
    },
    submit() {
      if (this.submitCanClick === false) {
        return;
      }
      let imgID = [];
      this.selectedImgList.forEach(item => {
        imgID.push(item.id);
      });
      if (!this.userFbContent || !(this.userFbConnectQq || this.userFbConnectTel || this.userFbConnectWx) || !this.selectedImgList.length || (this.isReport && !this.reportUsername)) {
        this.alertMessage = '必要信息未填写';
        this.popShow = true;
        setTimeout(() => {
          this.popShow = false;
        }, 2000);
        return;
      }
      let postData = {
        feedback_text: this.userFbContent,
        image: imgID,
        qq_account: this.userFbConnectQq,
        phone_number: this.userFbConnectTel,
        wechat_account: this.userFbConnectWx,
        image_type: 1
        // true_name: this.true_name,
        // alipay_account: this.alipay_account
      };
      this.submitCanClick = false;
      this.$axios_notice.post(`/notice/postFeedback`, postData).then(res => {
        console.log(res);
        if (parseInt(res.data.code) === 0) {
          this.alertMessage = '提交成功';
          this.popShow = true;
          setTimeout(() => {
            this.popShow = false;
            this.getFeedBackLogList();
            this.loadingShow = true;
            setTimeout(() => {
              this.selectedToggle = 'feedBackLog';
              this.loadingShow = false;
              this.submitCanClick = true;
              this.selectedFbTypeIndex = null;
              this.userFbContent = '';
              this.selectedImgList = [];
              this.userFbConnectQq = '';
              this.userFbConnectTel = '';
              this.userFbConnectWx = '';
              this.feedbackUserSelectType = '';
            }, 2000);
          }, 2000);
        } else {
          this.alertMessage = '提交失败';
          this.popShow = true;
          setTimeout(() => {
            this.popShow = false;
          }, 2000);
        }
      }).catch(() => {
        this.alertMessage = '服务器开小差了～';
        this.popShow = true;
        setTimeout(() => {
          this.popShow = false;
        }, 2000);
      });
    }
  }
};
</script>

<style lang="less" scoped>
@px2rem: 37.5rem;
* {
  margin: 0;
  padding: 0;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.clearfix {
  *zoom: 1;
}
.clear {
  clear: both;
}
.feedback-wrap {
  position: relative;
  overflow: hidden;
  background: #fff;
  min-height: 100%;
}
.toggle-tab {
  width: 100%;
  height: 74px;
  line-height: 74px;
  background: #fafafa;
  border-bottom: 2px solid #ececec;
}
.toggle-tab span {
  display: inline-block;
  width: 50%;
  float: left;
  text-align: center;
  font-size: 28px;
}
.toggle-tab .selected {
  color: #16b13a;
  border-bottom: 4px solid #16b13a;
}
.feedback-type-wrap {
  background: #ececec;
  width: 100%;
  overflow: hidden;
}
.feedback-type-wrap ul {
  list-style-type: none;
  width: 100%;
  background: #fafafa;
  margin-bottom: 10px;
}
.feedback-type-wrap ul li {
  font-size: 34px;
  margin-left: 40px;
  border-bottom: 1px solid #efefef;
  line-height: 100px;
  position: relative;
}
.feedback-type-wrap ul li:last-child {
  border-bottom: none;
}
.feedback-type-wrap ul:last-child {
  margin-bottom: 0;
}
.feedback-info-wrap {
  width: 100%;
  overflow: hidden;
  background: #ececec;
}
.feedback-info {
  background: #fafafa;
}
.feedback-info-con {
  width: 86%;
  overflow: hidden;
  padding: 0 48px;
}
.feedback-title {
  width: 100%;
  height: 70px;
  line-height: 70px;
  overflow: hidden;
  background: #ececec;
  font-size: 28px;
  padding-left: 40px;
  box-sizing: border-box;
}
.arrow-icon {
  width: 15px;
  position: absolute;
  top: 30px;
  right: 30px;
}
.title {
  font-size: 28px;
  color: #555;
  text-align: left;
  margin: 20px 0 15px 0;
  line-height: 46px;
}
.fb-type-list {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.fb-type-list span {
  padding: 10px 30px;
  margin-bottom: 25px;
  border: 1px solid #16b13a;
  color: #16b13a;
  display: inline-block;
  border-radius: 6px;
  font-size: 28px;
  float: left;
  margin-right: 24px;
}
.selectedType {
  background: #16b13a;
  color: #fff !important;
  border: 1px solid #16b13a !important;
}
.fb-inform {
  width: 100%;
  height: 220px;
  background: #fafafa;
  // border: 1px solid #e8e8e8;
  border: none;
  resize: none;
  outline: none;
  padding: 30px 0 26px;
  box-sizing: border-box;
  font-size: 28px;
  -webkit-appearance: none;
}
textarea::-webkit-input-placeholder,
input::-webkit-input-placeholder {
  color: #aaa;
  font-size: 28px;
}
.add-pic {
  font-size: 28px;
  color: #333;
  line-height: 42px;
  position: relative;
}
.addpic-icon {
  display: inline-block;
  width: 44px;
  height: 40px;
  position: relative;
  top: 8px;
  margin-right: 6px;
}
.add-pic b {
  font-weight: normal;
  font-size: 24px;
  color: #999;
}
.img-list-wrap {
  height: auto;
  margin-top: 10px;
}
.img-list {
  position: relative;
  width: 160px;
  height: 160px;
  margin-right: 12px;
  margin-bottom: 15px;
  float: left;
}
.add-img {
  width: 160px;
  height: 160px;
  overflow: hidden;
  display: block;
  background: #eee;
}
.add-img img {
  width: 100%;
}
.close-icon {
  width: 34px;
  position: absolute;
  top: -10px;
  right: -10px;
}
.mar0 {
  margin-right: 0 !important;
}
.fb-add-pic {
  margin: 5px 0 40px 0;
}
.add-pic-btn {
  width: 160px;
  height: 160px;
  background: #eeeeee;
  float: left;
  text-align: center;
  position: relative;
  border-radius: 6px;
}
.add-pic-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -20px;
  margin-left: -22px;
  width: 44px;
  height: 40px;
}

.fb-connect .title {
  background: #ececec;
  line-height: 70px;
}
.fb-connect ul {
  width: 100%;
  overflow: hidden;
  list-style-type: none;
  li {
    margin-left: 44px;
    border-bottom: 1px solid #e9e9e9;
    span {
      display: inline-block;
      width: 150px;
      font-size: 28px;
      text-align: left;
    }
    input {
      width: 480px;
      background: #fafafa;
      border: none;
    }
  }
  li:last-child {
    border-bottom: none;
  }
}
.connect-input {
  background: #f7f7f7;
  width: 100%;
  height: 100px;
  border: 1px solid #e8e8e8;
  padding: 20px 0;
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 28px;
  resize: none;
  outline: none;
  -webkit-appearance: none;
}
.report-con {
  text-indent: 44px;
}
.feedback-log-part {
  background: #ececec;
}
.fb-log-content {
  font-size: 32px;
  color: #262626;
  line-height: 46px;
  margin-bottom: 20px;
}
.fb-log-pic-list {
  margin-bottom: 20px;
}
.fb-log-pic-list img {
  width: 120px;
  border-radius: 6px;
  float: left;
  overflow: hidden;
}
.fb-status {
  color: #555;
  font-size: 24px;
  float: left;
}
.fb-date {
  font-size: 24px;
  color: #999;
  float: right;
}
.sub-inform {
  margin-bottom: 20px;
}
.fb-reply {
  font-size: 28px;
  color: #555;
  padding: 25px 15px;
  background: #f5f5f5;
  border-radius: 6px;
  line-height: 40px;
}
.add-img-btn {
  padding: 6px 30px;
  background: #16b13a;
  color: #fff;
  border-radius: 6px;
  position: relative;
}
#imgFile,
#addFile {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0;
}
#imgFile {
  width: 50%;
}
.pop-wrap {
  width: 400px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -200px;
  z-index: 10;
  border-radius: 10px;
  color: #fff;
  font-size: 30px;
}
.feedback-log-list {
  border-bottom: 1px solid #ededed;
  padding: 25px 48px;
  background: #fff;
}
.fb-log-img {
  display: inline-block;
  overflow: hidden;
  float: left;
  width: 120px;
  height: 120px;
  margin-right: 12px;
  background: #efefef;
}
.mb20 {
  margin-bottom: 20px;
}
.loading {
  width: 60px;
  height: 60px;
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -30px;
  margin-left: -30px;
  z-index: 10;
}
.noData {
  color: #999;
  text-align: center;
  font-size: 32px;
  padding-top: 200px;
  padding-bottom: 200px;
}
.btn-wrap {
  margin-top: 60px;
  text-align: center;
  margin-bottom: 60px;
  span {
    display: inline-block;
    width: 315px;
    height: 90px;
    line-height: 90px;
    border-radius: 50px;
    border: 1px solid #16b13a;
    text-align: center;
    font-size: 32px;
    text-decoration: none;
  }
  .go-back {
    color: #16b13a;
    background: #ececec;
    margin-right: 18px;
  }
  .submit {
    background: #16b13a;
    color: #fff;
  }
}
</style>
