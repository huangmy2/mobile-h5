<template>
    <div class="card-item" @click="goDetail(cardData.goods_no)">
        <!-- {{cardData.user.name}} -->
        <div class="main-img" >
            <img :src="cardData.cover ? cardData.cover : defaultAvatar" alt="">
            <!-- <span>{{cardData.goods_info.category}}</span> -->
            <!-- <p class="time" v-if="cardData.goods_info.countdown">{{cardData.goods_info.countdown}}</p> -->
        </div>
        <!-- <img v-if="cardData.goods_info.auction_status == 3" class="success-index" src="../assets/success-index.png" alt=""> -->
        <div class="content">
          <div class="text">{{cardData.title}}</div>
        </div>
        <div class="group-purchasing-type"><span>{{cardData.group_purchasing_type}}</span></div>
        <!-- <div class="content-flex current-money"><span class="gray">当前出价</span></div> -->
        <div class="content-flex money-dom">
          <span class="money"><span>￥</span>{{cardData.price}}起</span>
          <div class="percent-father">
              <div class="percent-son" :style="'right:' + (cardData.stock/cardData.total_count)*100 + '%'"></div>
              <!-- <div class="percent-son" :style="'right:90%'"></div> -->
              <span class="percent-num">余{{cardData.stock}}/共{{cardData.total_count}}</span>
          </div>
        </div>
        <div class="content-flex user-info">
            <span class="user-item" @click.stop.prevent="goUserIndex(cardData.user_info.id)">
                <img :src="cardData.user_info.avatar ? cardData.user_info.avatar : defaultAvatar" alt="">
                <span>{{cardData.user_info.username}}</span>
            </span>
            <span v-if="cardData.user_info.desc" class="user-tip">{{cardData.user_info.desc}}</span>
        </div>
        <!-- <p v-if="cardData.goods_info.countdown">
          <img src="../assets/clock.png" class="clock" alt="">{{cardData.goods_info.countdown}}</p> -->
    </div>
</template>

<script>
import { _getQuery } from 'src/utils/tool.js';
export default {
  data () {
    return {
      defaultAvatar: 'https://img1.qunliao.info/fastdfs5/M00/76/FF/rB8CCmEbIfmADVmrAAANFYGX3Hw504.png',
      source: _getQuery('source')
    };
  },
  props: {
    cardData: null,
    tag: ''
  },
  filters: {
    strTitle(val) {
      if (val.length > 20) {
        return val.substring(0, 20) + '...';
      } else {
        return val;
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    goUserIndex (id) {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['ZCindexlGoUserIndex', 'CLK']
      });
      location.href = `dongqiudi:///url/${location.origin}/webapp/tradingCard.html#/userIndex?user_id=${id}`;
    },
    goDetail(no) {
      const {aplus_queue} = window;
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['ZCindexToGoodsDetailAll', 'CLK']
      });
      location.href = `${location.origin}/webapp/crowdfunding.html#/goodsDetail?goods_no=${no}`;
      // window.open(`${location.origin}/webapp/crowdfunding.html#/goodsDetail?goods_no=${no}`);
    }
  }
};
</script>
<style lang="less" scoped>
.card-item {
    display: block;
    background: #fff;
    border-radius: 12px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
    position: relative;
    .success-index {
      position: absolute;
      right: 10px;
      top: 315px;
      width: 80px;
      z-index: 50;
    }
    .main-img {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        overflow: hidden;
        text-align: center;
        position: relative;
        width: 338px;
        height: 338px;
        img {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        span {
            display: inline-flex;
            height: 40px;
            font-size: 24px;
            position: absolute;
            top: 20px;
            left: 0;
            z-index: 2;
            background: #000;
            color: #fff;
            justify-content: center;
            align-items: center;
            padding:0 13px;
            padding-right: 16px;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
        }
        .time {
            position: absolute;
            bottom: 0;
            width: 100%;
            z-index: 2;
            height: 46px;
            line-height: 46px;
            text-align: left;
            padding-left: 14px;
            box-sizing: border-box;
            color: #fff;
            background: rgba(48,181,68,.55);
        }
    }
    .group-purchasing-type {
      padding: 0 12px;
      color: #666666;
      font-size: 22px;
      margin-top: 10px;
    }
    // .content {
    //     font-size: 28px;
    //     padding: 16px 12px 6px;
    // }
    .content {
      padding: 16px 12px 8px;
      font-size: 28px;
      max-height: 74px;
      line-height: 42px;
      overflow: hidden;
    }
    .content .text {
      float: right;
      margin-left: -5px;
      width: 100%;
      color: #2D2F32;
      word-break: break-all;
    }
    .content::before {
      float: left;
      width: 5px;
      content: '';
      max-height: 74px;
    }
    .gray {
        color:#999EA2;
        font-size: 24px;
    }
    .content-flex {
        padding: 2px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        .money-dom {
           color: #FF0101; 
        }
        .percent-father {
            background: #2D2F32;
            color: #fff;
            position: relative;
            width: 175px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            font-size: 22px;
            overflow: hidden;
            box-sizing: border-box;
            .percent-son {
                background: #FF5307;
                position: absolute;
                right:100%;
                display: block;
                z-index: 10;
                width: 175px;
                height: 28px;
                border-radius: 40px;
                box-sizing: border-box;
            }
            .percent-num {
                position: relative;
                z-index: 20;
            }
        }
        .money {
            color: #FF0101;
            font-size: 30px;
            font-weight: bold;
            span {
              font-size: 28px;
            }
        }
        .times {
            color:#2D2F32;
            font-size: 20px;
        }
    }
    .clock{
      width: 24px;
      margin-right: 6px;
      margin-left: 14px;
      position: relative;
      top: 4px;
    }
    .current-money {
      margin-top: 10px;
    }
    .user-info {
        margin-top: 8px;
        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
        .user-item {
            width: 200px;
            display: inline-flex;
            align-items: center;
            span {
                color: #666;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-left: 6px;
            }
        }
        .user-tip {
            transform: scale(.9);
            color: #B6BEFF;
            padding: 2px 8px;
            font-size: 18px;
            display: inline-block;
            border-radius: 20px;
            margin-right: -5px;
            border: 1px solid #F1F3F4;
        }
    }
}
</style>
