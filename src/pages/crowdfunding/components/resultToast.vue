<template>
    <div class="reault-toast">
        <div :class="type == 'success' ? 'toast success-toast' : 'toast error-toast'">
            <div class="toast-dom">
                <p>
                    <img v-if="type == 'error'" src="../assets/pay-fail.png" alt="">
                    <img v-else src="../assets/pay-success.png" alt="">
                    <span>{{title}}</span>
                </p>
                <p class="content">{{content}}</p>
            </div>
        </div>
        <div class="bottom-button">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props: {
    type: null,
    title: '',
    content: ''
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang="less">
.reault-toast {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: #F1F3F4;
    z-index: 15;
    .toast {
        width: 100%;
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
        .toast-dom {
            color: #F1F3F4;
            font-size: 28px;
            text-align: center;
            p {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            span {
                font-size: 48px;
            }
            img {
                width: 64px;
                margin-right: 20px;
            }
            .content {
                margin: 14px auto 0;
                width: 76%;
            }
        }
    }
    .success-toast {
        background: linear-gradient(270deg, #9255D5 0%, #30B544 100%);
    }
    .error-toast {
        background: linear-gradient(270deg, #D55585 0%, #FC0050 100%);
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
            background: linear-gradient(270deg, #9255D5 0%, #30B544 100%);
        }
        .cancleBtn {
            color: #2D2F32;
            background: #fff;
        }
    }
}
</style>
