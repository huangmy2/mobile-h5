<template>
    <div class="user-address">
        <div class="address-content">
            <div class="address-item" v-for="item in addressList" @click="goOrder(item.id)">
                <p class="address-text">{{item.detail}}</p>
                <p class="address-info">{{item.username}} {{item.phone}}</p>
                <div class="edit-dom">
                    <span class="default-tip" v-if="item.isDefault">默认地址</span>
                    <span v-else></span>
                    <span @click.stop="editAddress(item.id)"><img src="../assets/edit.png" alt=""></span>
                </div>
            </div>
        </div>
        <div class="before-loading" v-if="!initd">
          <skeleton :height="85"></skeleton>
          <skeleton :height="85"></skeleton>
        </div>
        <div class="no-data" v-if="initd && (!addressList||!addressList.length)">
          <img src="../assets/nodata.png" alt="">
          <p>暂无数据</p>
        </div>
        <div class="bottom-center-btn">
            <span class="btn-span" @click="linkUrl('addAddress')"><span class="font-bold">+</span> 添加收货地址</span>
        </div>
    </div>
</template>

<script>
import skeleton from '../components/skeleton.vue';
export default {
  data () {
    return {
      addressList: [],
      initd: false,
      order: '',
      goods: '',
      addressShow: false
    };
  },
  created () {
    this.getAddress();
  },
  mounted () {
    this.order = this.$route.query.order ? this.$route.query.order : this.order;
    this.goods = this.$route.query.goods ? this.$route.query.goods : this.goods;
    console.log(this.order);
    const {aplus_queue} = window;
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [{
        is_auto: false
      }, {
        type: 'pv',
        page: 'address'
      }]
    });
  },
  components: {
    skeleton
  },
  methods: {
    getAddress () {
      this.$axios_passport.get('/user/groupPurchasingAddressList').then(res => {
        console.log(res);
        let data = res.data;
        if (data.code === 0) {
          this.addressList = data.data;
        }
        this.initd = true;
      });
    },
    editAddress (id) {
      let params = this.order ? {id: id, order: this.order} : {id: id, goods: this.goods};
      this.$router.push({
        name: 'addAddress',
        query: params
      });
    },
    linkUrl (url) {
      let params = this.order ? {order: this.order} : {goods: this.goods};
      this.$router.push({
        name: url,
        query: params
      });
    },
    goOrder (id) {
      if (this.order) {
        this.$router.replace({
          name: 'confirmOrder',
          query: {order_no: this.order, addressID: id}
        });
      }
      if (this.goods) {
        this.$router.replace({
          name: 'confirmOrder',
          query: {goods_no: this.goods, addressID: id}
        });
      }
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
.user-address {
  background: #F1F3F4;
  .before-loading {
    padding: 24px;
  }
  .no-data {
    text-align: center;
    img {
      width: 300px;
      margin-bottom: 30px;
    }
    p {
      font-size: 28px;
    }
  }
  .address-content {
      padding: 24px 24px 230px;
      .address-item {
          background: #fff;
          border-radius: 4px;
          margin-bottom: 20px;
          .address-text {
              font-size: 32px;
              padding: 24px 24px 10px;
          }
          .address-info {
              padding: 0 24px 10px;
              font-size: 28px;
              color: #999;
              border-bottom: 1px solid #F1F3F4;
          }
          .edit-dom {
              padding: 12px 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .default-tip {
                  width: 140px;
                  height: 40px;
                  line-height: 40px;
                  font-size: 24px;
                  text-align: center;
                  background: linear-gradient(270deg, #51b761 0%, #30B544 100%);
                  border-radius: 22px;
                  color: #fff;
              }
              img {
                width: 30px;
              }
          }
      }
  }
}
</style>
 