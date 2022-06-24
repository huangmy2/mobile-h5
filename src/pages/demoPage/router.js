import Vue from 'vue';
import Router from 'vue-router';
import home from './components/home.vue';
import home2 from './components/home2.vue';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      component: home,
      name: 'home'
    },
    {
      path: '/home2',
      component: home2,
      name: 'home2'
    }
  ]
});
export default router;
