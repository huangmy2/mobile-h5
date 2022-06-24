<template>
  <div class="add-address">
       <div class="apply-unit">
            <div class="apply-item">
                <van-field
                    label-class="apply-item-label"
                    v-model="formData.username"
                    label="收货人"
                    placeholder="请输入收货人名称"
                />
            </div>
            <div class="apply-item">
                <van-field
                    label-class="apply-item-label"
                    v-model="formData.phone"
                    label="手机号码"
                    placeholder="请输入收货人手机号"
                />
            </div>
            <div class="apply-item" @click="chooseArea = true">
                <van-field
                    label-class="apply-item-label"
                    v-model="area"
                    label="选择地区"
                    readonly
                    right-icon="arrow"
                    placeholder="省、市、区"
                />
            </div>
            <div>
                <van-field
                    label-class="apply-item-label"
                    v-model="formData.detail"
                    rows="3"
                    autosize
                    label="详细地址"
                    type="textarea"
                    maxlength="50"
                    placeholder="小区/楼栋/门牌"
                    />
            </div>
        </div>
        <div class="apply-unit" v-if="(from!=='givePriceBoth')&&(from!=='givePriceAddr')">
            <div class="apply-item">
                <span class="apply-item-title">设置为默认地址</span>
                <van-checkbox icon-size="14px" checked-color="#30B544" v-model="formData.isDefault"></van-checkbox>
            </div>
        </div>
        <van-action-sheet v-model="chooseArea" title="" :round="false">             
            <van-area title="选择地区" :area-list="areaList" :value="areaValue" @confirm="onConfirm" @cancel="chooseArea = false"/>
        </van-action-sheet>
        <div class="bottom-center-btn">
            <span class="btn-span" @click="saveAddress()">
              <em v-if="from==='givePriceBoth'">下一步</em>
              <em v-else>保存</em>
            </span>
        </div>  
  </div>
</template>

<script>
import areaList from '../assets/area.js';
export default {
  data () {
    return {
      addressID: '',
      chooseArea: false,
      area: '',
      areaList,
      areaValue: '',
      goods: '',
      formData: {
        username: '',
        phone: '',
        location: [],
        detail: '',
        isDefault: 0
      },
      from: ''
    };
  },
  created () {
  },
  mounted () {
    if (this.$route.query && this.$route.query.id) {
      this.addressID = this.$route.query.id;
      this.getAddress();
    }
    if (this.$route.query && this.$route.query.goods) {
      this.goods = this.$route.query.goods;
    }
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'addAddress'
      }]
    });
  },
  methods: {
    onConfirm (val) {
      this.chooseArea = false;
      let area = [];
      val.forEach(res => {
        area.push(res.name);
      });
      this.formData.location = val;
      this.area = area.join('/');
    },
    getAddress () {
      this.$axios_passport.get(`/user/groupPurchasingGetAddress?id=${this.addressID}`).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.formData = data.data;
          this.addressID = this.formData.location[2].code;
          this.onConfirm(this.formData.location);
        }
      });
    },
    saveAddress () {
      console.log(this.formData);
      if (!this.formData.username) { this.$toast('请输入收货人名称'); return; }
      if (!this.formData.phone) { this.$toast('请输入收货人手机号'); return; }
      var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!myreg.test(this.formData.phone)) {
        this.$toast('请填写正确格式的手机号码');
        return;
      }
      if (!this.formData.detail) { this.$toast('请输入详细地址'); return; }
      if (!this.formData.location || !this.formData.location.length) { this.$toast('请输入省市区'); return; }

      this.formData.isDefault = this.formData.isDefault ? 1 : 0;
      this.$axios_passport.post('/user/groupPurchasingAlterAddress', this.formData).then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          if (this.goods) {
            this.$router.replace({
              name: 'address',
              query: {goods: this.goods}
            });
          } else {
            this.$router.replace({
              name: 'address'
            });
          }
        } else {
          this.$toast(data.message);
        }
      });
    },
    noScroll () {
      // 控制客户端侧滑   false
      console.log('进入客户端禁止侧滑方法');
      if (browers && ((browers.Android && browers.version >= 196) || browers.iOS)) {
        this.$bridge.callHandler('controlLeftSlide', {
          'isSlide': false
        });
      }
    }
  }
};
</script>
<style lang="less">
.add-address {
    .apply-unit {
        margin-top: 10px;
        .apply-item-label {
            color: #2D2F32;
            font-weight: 500;
        }
        .apply-item {
            padding:30px 34px;
            background: #fff;
            font-size: 28px;
            border-bottom: 1px solid #F1F3F4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .apply-item-title {
                font-weight: 500;
            }
            .van-cell {
                padding: 0;
            }
            .van-cell::after {
                border:none;
            }
        }
    }
}
</style>
 