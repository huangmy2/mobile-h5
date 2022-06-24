<template>
  <div class="login-page">
    <div class="login-index" v-if="type && !userInfo.name">
      正在登录中.....
    </div>
    <div v-else>
      <div class="input-dom"><input type="number" v-model="formData.phone_number" placeholder="请输入手机号"></div>
      <div class="input-dom">
        <input type="number" v-model="formData.code" oninput="if(value.length>6) value = value.slice(0,6)" class="number-code" placeholder="请输入验证码">
        <span v-if="!codeLoading" class="code" @click="getCode()">获取验证码</span>
        <span v-else class="code">重新获取{{codeSeconds}}</span>
      </div>
      <div class="login-btn" @click="userLogin">登录</div>
      <p class="tips-p">未注册手机验证后自动注册</p>
      <div class="bottom-agree">
          <van-checkbox icon-size="14px" checked-color="#30B544" v-model="agreeFile">我已阅读并同意<span class="file-text">《用户协议》《隐私协议》</span></van-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import skeleton from '../components/skeleton.vue';
import {mapState} from 'vuex';
import { _getQuery } from 'src/utils/tool.js';
export default {
  data () {
    return {
      agreeFile: false,
      formData: {
        phone_number: '',
        code: ''
      },
      codeSeconds: '60',
      codeLoading: false,
      openId: '',
      type: _getQuery('type') || '',
      no: _getQuery('no') || '',
      uri: _getQuery('uri') || '',
      userInfo: null
    };
  },
  computed: {...mapState(['userInfo'])},
  created () {
  },
  mounted () {
    this.openId = sessionStorage.getItem('openid');
    this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
    this.type = this.$route.query.type ? this.$route.query.type : this.type;
    this.no = this.$route.query.no ? this.$route.query.no : this.no;
    this.uri = this.$route.query.uri ? this.$route.query.uri : this.uri;
    let code = this.getUrlParam('code');
    if (!this.type && code) {
      this.userBind(code);
    }
    if (this.type && !this.userInfo.name) {
      this.getWchartCode();
    }
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'loginPage'
      }]
    });
  },
  methods: {
    // 获取地址栏的参数
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    },
    // 获取验证码事件，倒计时
    getCode () {
      var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!this.formData.phone_number) {
        this.$toast('请填写手机号码');
        return;
      }
      if (!myreg.test(this.formData.phone_number)) {
        this.$toast('请填写正确格式的手机号码');
        return;
      }
      let params = {
        phone: this.formData.phone_number,
        channel_type: 1,
        open_id: this.openId
      };
      this.$axios_passport.post('/user/regSendSmsCode', params).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          this.$toast('验证码发送成功');
          this.codeLoading = true;
          let timer = setInterval(res => {
            this.codeSeconds--;
            if (this.codeSeconds <= 0) {
              clearInterval(timer);
              this.codeLoading = false;
              this.codeSeconds = 60;
            }
          }, 1000);
        } else {
          this.$toast(data.message);
        }
      });
    },
    userLogin () {
      if (!this.agreeFile) {
        this.$toast('请阅读并勾选下方相关协议规则');
        return;
      }
      if (!this.formData.phone_number) {
        this.$toast('请填写手机号码');
        return;
      }
      if (!this.formData.code) {
        this.$toast('请填写验证码');
        return;
      }
      let params = {
        phone: this.formData.phone_number,
        code: this.formData.code,
        channel_type: 1,
        open_id: this.openId
      };
      this.$axios_passport.post('/user/regByPhone', params).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          if (data.data.union_user_id) {
            this.$toast('登录成功');
            sessionStorage.setItem('userinfo', JSON.stringify(data.data));
            if (this.no) {
              window.location.replace(`${location.origin}/webapp/crowdfunding.html#/goodsDetail?goods_no=${this.no}`);
            } else if (this.uri) {
              window.location.replace(`${location.origin}/webapp/crowdfunding.html#/${this.uri}`);
            } else {
              window.history.go(-1);
            }
          } else {
            this.getWchartCode();
          }
        } else {
          this.$toast(data.message);
        }
      });
    },
    getWchartCode () {
      var code = this.getUrlParam('code'); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      var local = window.location.href;
      var APPID = this.getAppId();
      if (code == null || code === '') {
        window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect');
      } else {
        this.userBind(code); // 把code传给后台获取用户信息
      }
    },
    getAppId() {
      let appid;
      if (location.hostname.indexOf('test') > -1 || location.hostname.indexOf('192.168.1.13') > -1) {
        appid = 'wxd310655463f46282';
      } else {
        appid = 'wx067aae02e7ed4185';
      }
      return appid;
    },
    // 绑定用户微信基础信息
    userBind (code) {
      let params = {
        code: code,
        open_id: this.openId,
        channel_type: 1
      };
      this.$axios_passport.post('/user/bindWechatUserBaseInfo', params).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          sessionStorage.setItem('userinfo', JSON.stringify(data.data));
          if (this.no) {
            window.location.replace(`${location.origin}/webapp/crowdfunding.html#/goodsDetail?goods_no=${this.no}`);
          } else if (this.uri) {
            window.location.replace(`${location.origin}/webapp/crowdfunding.html#/${this.uri}`);
          } else {
            window.history.go(-1);
          }
        } else {
          this.$toast(data.message + '请返回重试');
        }
      });
    }
  },
  components: {
    skeleton
  }
};
</script>
<style lang="less">
.login-page {
  padding-top: 40px;
  .login-index {
    padding-left: 30px;
    font-size: 28px;
  }
  .input-dom {
    width: 80%;
    background: #fff;
    border-radius: 40px;
    padding: 20px 0;
    margin: 28px auto;
    font-size: 30px;
    position: relative;
    input {
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
      border: none;
      background: none;
    }
    .number-code {
      width: 300px;
    }
    .code {
      position: absolute;
      right: 40px;
    }
  }
  .login-btn {
    width: 80%;
    background: #16B13A;
    color: #fff;
    margin: 20px auto;
    margin-top: 40px;
    border-radius: 40px;
    padding: 18px 0;
    font-size: 32px;
    text-align: center;
  }
  .tips-p {
    text-align: center;
    font-size: 24px;
    color: #999999;
    margin-top: 30px;
  }
  .bottom-agree {
    text-align: center;
    font-size: 24px;
    margin-top: 20px;
    .van-checkbox {
      justify-content: center;
    }
    .van-checkbox__label {
      color: #999999;
    }
    .file-text {
      color: #333;
    }
  }
}
</style>
