<template>
  <div class="skeleton-dom">
      <div class="skeleton-card" v-if="type === 'title'">
        <div class="card-dom"></div>
      </div>
      <div class="skeleton-tab" v-if="type === 'tab'">
          <div class="skeleton-tab-item" v-for="item in tabLine" v-if="tabCol == 4">
              <span></span><span></span><span></span><span></span>
          </div>
          <div class="skeleton-tab-item tab-three" :style="(!tabPadding)&&'padding:0px !important;'" v-for="item in tabLine" v-if="tabCol == 3">
              <span></span><span></span><span></span>
          </div>
      </div>
      <div class="skeleton-chart" v-if="type === 'chart'">
          <div class="chart-header" v-if="chartLegendShow">
              <span class="chart-legend"></span><span class="sket-text"></span>
              <span class="chart-legend"></span><span class="sket-text"></span>
          </div>
          <div class="chart-height" :style="'height:' + chartHeight"></div>
      </div>
      <div class="skeleton-text" v-if="type === 'text'">
          <div class="skeleton-text-dom" v-for="item in textLine" :style="'width:' + textWidth,'height:' + lineHeight"></div>
      </div>
      <div class="skeleton-chart-label" v-if="type === 'xlabel'">
          <div class="chart-label-header">
              <span class="chart-legend"></span>
              <span class="chart-legend-label"></span>
          </div>
      </div>
      <div class="skeleton-round" v-if="type === 'round'">
          <div class="skeleton-round-item" :style="'width:' + widthR + ';height:' + widthR"></div>
      </div>
      <div class="skeleton-table" v-if="type === 'table'">
          <ul v-for="item in tableLine">
            <li v-for="litem in tableWidth" :style="'width:' + litem"></li>
          </ul>
      </div>
      <div class="skeleton-title" v-if="type === 'blockGroup'">
          <div class="board-title">
            <span></span>
            <img src="./assets/down-arrow.png" alt="" class="arrow">
          </div>
        <div class="board-item-content">
          <p class="reson-tit"><span></span></p>
          <div class="reson-block">
            <div class="block-item" v-for="i in 3" :key="i">
            </div>
          </div>
        </div>
      </div>
      <div class="rectangle" v-if="type === 'rectangle'" :style="'width:' + rectangleWidth+'px;height:'+rectangleHeight+'px;'"></div>
      <div class="" v-if="type === 'newsItem'">
        <div class="skeleton-summary">
          <p class="summary-tit" v-for="i in 2"></p>
          <span class="summary-icon" v-for="i in 2"></span>
          <p class="summary-detail"></p>
        </div>
      </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      tabLine: [],
      textLine: [],
      tableLine: []
    };
  },
  props: {
    lineHeight: {
      default: () => {
        return '20px';
      }
    },
    type: { // 骨架屏种类 目前包括 tab组(tab) 图表(chart) 文本(text) x轴文案(xlabel) 平铺块(blockGroup:参考龙虎榜样式) 矩形（rectangle）列表项（newsItem 参考研报摘要模块）
      default: () => {
        return 'tab';
      }
    },
    chartHeight: { // 图表模块的高度 字符串 带px
      default: () => {
        return '150px';
      }
    },
    chartLegendShow: { // 图表图例是否显示
      default: () => {
        return true;
      }
    },
    tabRow: { // tab展示几行
      default: () => {
        return '1';
      }
    },
    tabCol: { // tab展示几列
      default: () => {
        return '4';
      }
    },
    tabPadding: { // tab是否需要padding
      default: () => {
        return true;
      }
    },
    textRow: { // 文本展示几行
      default: () => {
        return '1';
      }
    },
    textWidth: { // 文本展示宽度 单位是百分比 带%
      default: () => {
        return '100%';
      }
    },
    widthR: { // 圆占位图直径
      default: () => {
        return '50px';
      }
    },
    tableRow: { // 表格行数
      default: () => {
        return '4';
      }
    },
    tableWidth: { // 表格宽度
      default: () => {
        return ['22%', '22%', '22%', '22%'];
      }
    },
    rectangleWidth: { // 表格行数
      default: () => {
        return 300;
      }
    },
    rectangleHeight: { // 表格行数
      default: () => {
        return 150;
      }
    }
  },
  created () {
  },
  mounted () {
    this.tabLine = [];
    for (let i = 0; i < (+this.$props.tabRow); i++) {
      this.tabLine.push('1');
    }
    this.textLine = [];
    for (let i = 0; i < (+this.$props.textRow); i++) {
      this.textLine.push('1');
    }
    this.tableLine = [];
    for (let i = 0; i < (+this.$props.tableRow); i++) {
      this.tableLine.push('1');
    }
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
@-webkit-keyframes skeleton-blink {
    0% {
        background-position: 100% 50%
    }
    to {
        background-position: 0 50%
    }
}
 
@keyframes skeleton-blink {
    0% {
        background-position: 100% 50%
    } to {
        background-position: 0 50%
    }
};
@skeleton-animation: skeleton-blink 1s ease-in-out infinite;
.animate-type {
    animation: skeleton-blink 1.4s ease infinite;
    -webkit-animation: skeleton-blink 1.4s ease infinite;
    background-image: -webkit-gradient(linear, left top, right top, color-stop(25%, #f7f7f7), color-stop(37%, #F1F3F4), color-stop(63%, #f7f7f7));
    background-image: -o-linear-gradient(left, #f7f7f7 25%, #F1F3F4 37%, #f7f7f7 63%);
    background-image: linear-gradient(90deg, #f7f7f7 25%, #F1F3F4 37%, #f7f7f7 63%);
    background-size: 400% 100%
}
.legend {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: #F1F3F4;
    margin-right: 16px;
}
.skeleton-dom {
  background: #FFF;
    .skeleton-tab {
        margin-bottom: 12px;
        .skeleton-tab-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            span {
                width: 22.5%;
                height: 50px;
                border-radius: 4px;
                display: inline-block;
                .animate-type();
            }
        }
        .tab-three {
            span {
                width: 32%;
            }
        }
    }
    .skeleton-chart {
        padding: 12px 0;
        font-size: 0;
        .chart-header {
            height: 14px;
            margin-bottom: 22px;
            .chart-legend {
                .legend()
            }
            .sket-text {
                display: inline-block;
                width: 64px;
                height: 14px;
                margin-right: 24px;
                background: #F1F3F4;
                .animate-type();
            }
        }
        .chart-height {
            width: 100%;
            padding: 12px 0;
            border-radius: 4px;
            .animate-type();
        }
    }
    .skeleton-text {
        margin: 12px auto;
        widows: 100%;
        .skeleton-text-dom {
            height: 20px;
            border-radius: 4px;
            margin-bottom: 18px;
            .animate-type();
        }
    }
    .skeleton-chart-label {
        margin: 20px auto;
        widows: 100%;
        font-size: 0;
        position: relative;
        .chart-legend {
            .legend()
        }
        .chart-legend-label {
            display: inline-block;
            width: 95%;
            height: 14px;
            background: #F1F3F4;
            position: absolute;
            right: 0;
        }
    }
    .skeleton-round {
        .skeleton-round-item {
            border-radius: 50%;
            .animate-type();
        }   
    }
    .skeleton-table {
      width: 100%;
      padding-top: 30px;
      ul {
        width: 100%;
        display: flex;
        justify-content: space-between;
        li {
          float: left;
          width: 22%;
          height: 40px;
          margin-bottom: 20px;
          .animate-type();
        }
      }
    }
}
.skeleton-title{
  height: auto;
  overflow: hidden;
  .board-title{
    height: 64px;
    line-height: 64px;
    padding: 0 22px;
    border-top: 12px solid #F1F3F4;
    border-bottom: 1px solid #F1F3F4;
    overflow: hidden;
    box-sizing: initial;
    span{
      position: absolute;
      width: 550px;
      height: 30px;
      margin-top: 15px;
      border-radius: 4px;
      display: block;
      .animate-type();
    }
    .arrow{
      width: 20px;
      float: right;
      margin-top: 20px;
    }
  }
  .board-item-content{
    padding: 24px 26px 26px;
    .reson-tit{
      margin-bottom: 22px;
      span{
        display: inline-block;
        width: 440px;
        height: 30px;
        position: relative;
        top: 5px;
        .animate-type();
      }
      b{
        position: relative;
        top: -4px;
      }
    }
    .reson-block{
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-bottom: 6px;
      .block-item{
        display: inline-block;
        width: 220px;
        height: 120px;
        border-radius: 8px 8px 0px 0px;
        text-align: center;
        padding: 25px 0 0 0;
        color: #2D2F32;
        font-size: 22px;
        line-height: 40px;
        .animate-type();
      }
    }
  }
}
.rectangle{
  margin: 0 auto;
  .animate-type();
}
.skeleton-summary{
  padding: 24px 26px;
  border-bottom: 1px solid #F1F3F4;
  .summary-tit{
    width: 100%;
    height: 44px;
    line-height: 44px;
    margin-bottom: 6px;
    .animate-type();
  }
  .summary-icon{
    border-radius: 4px;
    margin-bottom: 8px;
    padding: 2px 4px;
    display: inline-block;
    width: 120px;
    height: 34px;
    margin-right: 10px;
    .animate-type();
  }
  .summary-detail{
    width: 70%;
    height: 44px;
    overflow: hidden;
    .animate-type();
  }
}
.skeleton-card {
  margin: 0 auto;
  border-top: 12px solid #F1F3F4;
  border-bottom: 1px solid #F1F3F4;
  padding: 12px 24px;
  .card-dom {
    width: 30%;
    height: 44px;
    .animate-type();
  }
}
</style>