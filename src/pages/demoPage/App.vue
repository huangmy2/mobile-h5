<template>
  <div class="main">
    <p>获取url中id参数：{{id}}</p>
    <p>获取store数据：{{$store.state.testResult}}</p>
    <div>
      组件：<home></home>
    </div>
    <div>
      路由：<router-view></router-view>
    </div>
  </div>
</template>

<script type="text/javascript">
import {_getQuery} from 'src/utils/tool.js';
import home from './components/home';

export default {
  data () {
    return {
      id: _getQuery('id')
    };
  },
  components: {
    home
  },
  mounted () {
    this.changeState();
    this.axiosMock();
  },
  methods: {
    axiosMock () {
      this.$axios.get(`/v3/archive/app/tabs/getlists?id=58`).then((res) => {
        let dataExist = res.data;
        console.log('获取到的数据', dataExist);
      }).catch((err) => {
        console.log('err', err);
      });
    },
    changeState() {
      this.$store.commit('changeTestResult', 'testData数据传参');
      setTimeout(() => {
        console.log('获取state:', this.$store.state.testResult);
        this.$store.commit('changeTestResult', 'testData数据传参111');
      }, 3000);
    }
  }
};
</script>

<style lang="less">
*{
  margin:0;
  padding: 0;
}
body,html{
  background: #22943d;
  height: 100%;
}
.clearfix:after{
  visibility:hidden;
  display:block;
  font-size:0;
  content:" ";
  clear:both;
  height:0;
}
.clearfix{
  *zoom:1;
}
.clear{
  clear:both;
}
.main {
  width: 100%;
  min-height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling:touch;
  background: url('./assets/bg.jpg') no-repeat;
  background-size: 100% auto;
  .title{
    width: 570px;
    display: block;
    margin: 90px auto 30px;
  }
  .btn{
    width: 380px;
    display: block;
    margin: 0px auto 30px;
  }
  .banner{
    width: 620px;
    display: block;
    margin: 0px auto 40px;
  }
}
@media screen and (min-height: 700px) and (min-width:375px) {

}
</style>
