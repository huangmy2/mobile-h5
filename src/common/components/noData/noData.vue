<template>
  <div class="no-data" :class="{'page-no-data':typeData==='page'}">
    <img src="./assets/no-data.png" class="no-data-img" alt="">
    <p class="no-data-text">数据还在收录中</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    typeData: {
      type: String,
      default: 'module' // module模块样式；page页面样式
    }
  }
};
</script>

<style lang='less' scoped>
  .no-data{
    padding: 30px 0 60px;
    .no-data-img{
      width: 250px;
      display: block;
      margin: 0 auto 15px;
    }
    .no-data-text{
      text-align: center;
      line-height: 40px;
      width: 100%;
      color: #999EA2;
    }
  }
  .page-no-data{
    width: 100%;
    height: 100%;
    background: #FFF;
    padding: 0;
    .no-data-img{
      position: fixed;
      top: 45%;
      left: 50%;
      width: 250px;
      z-index: 10;
      transform: translate(-50%,-50%);
    }
    .no-data-text{
      top: 45%;
      left: 50%;
      transform: translate(-50%,-50%);
      margin-top: 150px;
      position: fixed;
      z-index: 10;
    }
  }
</style>
