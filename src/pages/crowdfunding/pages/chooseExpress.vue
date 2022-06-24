<template>
  <div class="express-choose">
    <div class="order-item">
      <div class="order-type-dom">
        <van-cell center>
          <template #title>
            <div class="cell-order">
              <div class="order-type-title">服务商</div>
              <van-field readonly v-model="express_name" @click="chooseExpress = true" placeholder="请选择快递服务商" />
            </div>
          </template>
        </van-cell>
      </div>
      <div class="order-type-dom">
        <van-cell center>
          <template #title>
            <div class="cell-order">
              <div class="order-type-title">快递单号</div>
              <van-field v-model="express_no" placeholder="请填写快递单号" />
              <span class="close-btn" @click="closeExpressNo" v-if="express_no">x</span>
            </div>
          </template>
        </van-cell>
      </div>
      <van-action-sheet v-model="chooseExpress" title="" :round="false">
        <van-picker title="请选择快递服务商" show-toolbar :columns="columns" value-key="name" @confirm="onConfirm" @cancel="onCancel" />
      </van-action-sheet>
      <div class="bottom-button">
        <span class="confirmBtn" @click="goSeller()">确认发货</span>
      </div>
    </div>
  </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
export default {
  data() {
    return {
      order_no: _getQuery('order_no') || '',
      express_name: '',
      express_no: '',
      express_id: '',
      chooseExpress: null,
      columns: []
    };
  },
  created() {},
  mounted() {
    this.order_no = this.$route.query.order_no
      ? this.$route.query.order_no
      : this.order_no;
    this.getExpress();
    console.log(this.order_no);
  },
  methods: {
    closeExpressNo() {
      this.express_no = '';
    },
    getExpress() {
      this.$axios_orders
        .get(`/orders/getExpressProvider?order_no=${this.order_no}`)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (data.code === 0) {
            this.columns = data.data.list;
            if (data.data && data.data.express_info) {
              this.express_name = data.data.express_info.express_name;
              this.express_id = data.data.express_info.express_id;
              this.express_no = data.data.express_info.express_no;
            }
          }
        });
    },
    onConfirm(val) {
      console.log(val);
      this.express_name = val.name;
      this.express_id = val.id;
      this.chooseExpress = false;
    },
    onCancel() {
      this.chooseExpress = false;
    },
    goSeller() {
      let params;
      if (!this.express_id) {
        this.$toast('请选择快递服务商');
        return;
      }
      if (!this.express_no) {
        this.$toast('请填写快递单号');
        return;
      }
      params = {
        express_no: this.express_no,
        express_id: this.express_id,
        order_no: this.order_no
      };
      this.$axios_orders
        .post(`/orders/postGroupPurchasingOrderDeliveryInfo`, params)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (data.code === 0) {
            this.$toast('提交成功');
            this.$router.go(-1);
          } else {
            this.$toast(data.message);
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.express-choose {
  .order-item {
    background: #fff;
    margin-top: 10px;
    .order-type-dom {
      border-bottom: 1px solid #ebedf0;
    }
    .cell-order {
      display: flex;
      align-items: center;
      .order-type-title {
        width: 150px;
        font-weight: bold;
        flex-shrink: 0;
      }
      .close-btn {
        position: relative;
        right: 40px;
        font-size: 34px;
      }
      .van-cell {
        padding: 0;
      }
    }
  }
  .bottom-button {
    position: absolute;
    bottom: 120px;
    display: flex;
    justify-content: center;
    width: 100%;
    span {
      margin: 0 20px;
      display: inline-block;
      height: 88px;
      line-height: 88px;
      text-align: center;
      font-size: 32px;
      width: 280px;
      border-radius: 44px;
    }
    .confirmBtn {
      color: #fff;
      background: linear-gradient(270deg, #75c281 0%, #30b544 100%);
    }
    .cancleBtn {
      color: #2d2f32;
      background: #fff;
    }
  }
}
</style>
