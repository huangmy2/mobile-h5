import Vue from 'vue';
import Router from 'vue-router';
import index from './pages/index.vue';
import cardList from './pages/cardList.vue';
import userCenter from './pages/userCenter.vue';
import login from './pages/login.vue';
import sellerList from './pages/sellerList.vue';
import goodsDetail from './pages/goodsDetail.vue';
import pay from './pages/pay.vue';
import productList from './pages/productList.vue';
import sellerOrder from './pages/sellerOrder.vue';
import buyerOrder from './pages/buyerOrder.vue';
import confirmOrder from './pages/confirmOrder.vue';
import liveList from './pages/liveList.vue';
import liveDetail from './pages/liveDetail.vue';
import buyerList from './pages/buyerList.vue';
import address from './pages/address.vue';
import addAddress from './pages/addAddress.vue';
import wms from './pages/wms.vue';
import feedback from './pages/feedback.vue';
import myGetCard from './pages/myGetCard.vue';
import openCardReport from './pages/openCardReport.vue';
import setOpenCardReport from './pages/setOpenCardReport.vue';
import chooseExpress from './pages/chooseExpress.vue';
import commonProblem from './pages/commonProblem.vue';
import userAgree from './pages/userAgree.vue';
import myCardSecret from './pages/myCardSecret.vue';
import editCardMessage from './pages/editCardMessage.vue';
import productReport from './pages/productReport.vue';
import secretResult from './pages/secretResult.vue';
import secretResultInfo from './pages/secretResultInfo.vue';
import orderCollection from './pages/orderCollection.vue';
import buyerKnowFile from './pages/buyerKnowFile.vue';
import smallTicket from './pages/smallTicket.vue';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      component: index,
      name: 'index',
      meta: {
        title: '首页'
      }
    },
    {
      path: '/index',
      component: index,
      name: 'index',
      meta: {
        title: '首页'
      }
    },
    {
      path: '/cardList',
      component: cardList,
      name: 'cardList',
      meta: {
        title: '拼团'
      }
    },
    {
      path: '/userCenter',
      component: userCenter,
      name: 'userCenter',
      meta: {
        title: '我的'
      }
    },
    {
      path: '/login',
      component: login,
      name: 'login',
      meta: {
        title: '登录'
      }
    },
    {
      path: '/sellerList',
      component: sellerList,
      name: 'sellerList',
      meta: {
        title: '卖家订单'
      }
    },
    {
      path: '/goodsDetail',
      component: goodsDetail,
      name: 'goodsDetail',
      meta: {
        title: '卡片详情'
      }
    },
    {
      path: '/pay',
      component: pay,
      name: 'pay',
      meta: {
        title: '收银台'
      }
    },
    {
      path: '/productList',
      component: productList,
      name: 'productList',
      meta: {
        title: '卡片列表'
      }
    },
    {
      path: '/sellerOrder',
      component: sellerOrder,
      name: 'sellerOrder',
      meta: {
        title: '卖家订单详情'
      }
    },
    {
      path: '/buyerOrder',
      component: buyerOrder,
      name: 'buyerOrder',
      meta: {
        title: '买家订单详情'
      }
    },
    {
      path: '/confirmOrder',
      component: confirmOrder,
      name: 'confirmOrder',
      meta: {
        title: '确认订单页'
      }
    },
    {
      path: '/liveList',
      component: liveList,
      name: 'liveList',
      meta: {
        title: '直播列表'
      }
    },
    {
      path: '/liveDetail',
      component: liveDetail,
      name: 'liveDetail',
      meta: {
        title: '直播详情'
      }
    },
    {
      path: '/buyerList',
      component: buyerList,
      name: 'buyerList',
      meta: {
        title: '买家订单聚合'
      }
    },
    {
      path: '/address',
      component: address,
      name: 'address',
      meta: {
        title: '地址列表'
      }
    },
    {
      path: '/addAddress',
      component: addAddress,
      name: 'addAddress',
      meta: {
        title: '编辑收货地址'
      }
    },
    {
      path: '/wms',
      component: wms,
      name: 'wms',
      meta: {
        title: '物流信息'
      }
    },
    {
      path: '/feedback',
      component: feedback,
      name: 'feedback',
      meta: {
        title: '用户反馈'
      }
    },
    {
      path: '/myGetCard',
      component: myGetCard,
      name: 'myGetCard',
      meta: {
        title: '我的中卡'
      }
    },
    {
      path: '/openCardReport',
      component: openCardReport,
      name: 'openCardReport',
      meta: {
        title: '拆卡报告'
      }
    },
    {
      path: '/setOpenCardReport',
      component: setOpenCardReport,
      name: 'setOpenCardReport',
      meta: {
        title: '填写拆卡报告'
      }
    },
    {
      path: '/chooseExpress',
      component: chooseExpress,
      name: 'chooseExpress',
      meta: {
        title: '发货信息'
      }
    },
    {
      path: '/commonProblem',
      component: commonProblem,
      name: 'commonProblem',
      meta: {
        title: '常见问题'
      }
    },
    {
      path: '/userAgree',
      component: userAgree,
      name: 'userAgree',
      meta: {
        title: '用户协议'
      }
    },
    {
      path: '/myCardSecret',
      component: myCardSecret,
      name: 'myCardSecret',
      meta: {
        title: '我的卡密'
      }
    },
    {
      path: '/editCardMessage',
      component: editCardMessage,
      name: 'editCardMessage',
      meta: {
        title: '编辑中卡信息'
      }
    },
    {
      path: '/productReport',
      component: productReport,
      name: 'productReport',
      meta: {
        title: '生成拆卡报告'
      }
    }, {
      path: '/secretResult',
      component: secretResult,
      name: 'secretResult',
      meta: {
        title: '卡密分配结果'
      }
    },
    {
      path: '/secretResultInfo',
      component: secretResultInfo,
      name: 'secretResultInfo',
      meta: {
        title: '卡密分配结果'
      }
    },
    {
      path: '/orderCollection',
      component: orderCollection,
      name: 'orderCollection',
      meta: {
        title: '订单集合'
      }
    },
    {
      path: '/buyerKnowFile',
      component: buyerKnowFile,
      name: 'buyerKnowFile',
      meta: {
        title: '购买须知'
      }
    },
    {
      path: '/smallTicket',
      component: smallTicket,
      name: 'smallTicket',
      meta: {
        title: '支付小票'
      }
    }
  ]
});
export default router;
