import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import Home from '@/views/Home.vue'
import { articleNo } from '@/utils/articleNo'

Vue.use(VueRouter);
Vue.use(VueCookies);

let routeArticle = function() {
  let ret = [];
  for (let i = 0; i < articleNo.length; i++) {
    ret.push({});
    ret[i].path = '/article/' + i;
    ret[i].name = 'article' + i;
    ret[i].component = () => import('@/views/Articles/' + i);
  }
  console.log(ret);
  return ret;
};

const routes = [
  {
    path: '/',
    name: 'User',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('@/views/Article'),
    children: routeArticle()
  },
  {
    path: '/home-insurance',
    component: () => import('@/views/Article'),
    name: 'Home',
    children: [
      {
        path: 'insurance',
        name: 'HomeInsurance',
        component: () => import('@/views/home/insurance'),
      },
      {
        path: 'home',
        name: 'HomeHome',
        component: () => import('@/views/home/home'),
      },
      {
        path: 'invoice',
        name: 'HomeInvoice',
        component: () => import('@/views/home/invoice'),
      },
      {
        path: 'payment',
        name: 'HomePayment',
        component: () => import('@/views/home/payment'),
      }
    ]
  },

  {
    path: '/automobile-insurance',
    component: () => import('@/views/Article'),
    name: 'Automobile',
    children: [
      {
        path: 'insurance',
        name: 'AutomobileInsurance',
        component: () => import('@/views/automobile/insurance'),
      },
      {
        path: 'automobile',
        name: 'AutomobileAutomobile',
        component: () => import('@/views/automobile/automobile'),
      },
      {
        path: 'driver',
        name: 'Driver',
        component: () => import('@/views/automobile/driver'),
      },
      {
        path: 'invoice',
        name: 'AutomobileInvoice',
        component: () => import('@/views/automobile/invoice'),
      },
      {
        path: 'payment',
        name: 'AutomobilePayment',
        component: () => import('@/views/automobile/payment'),
      }
    ]
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  //所有需要检测登录状态的路由页面都放在这个数组里面
  let isLogin = false;
  if (router.app.$cookies.get('user_cookie') === "true") {
    isLogin = true;
  }
  console.log('isLogin:' + isLogin);

  console.log(to.path.split('/')[1])
  //nextRoute.indexOf(to.path.split('/')[1]) >= 0表示导航栏能够获取到数据，表示进入到了该页面中
  if (to.path.split('/')[1] !== "login") {
    //检测是不是未登录状态，如果登录了就不做处理（页面跳转到上面数组的哪就是哪），未登录就去登录页
    if (!isLogin) {
      next({
        path: '/login'
      })
      location.reload();
    }
  }

  if (to.path.split('/')[to.path.split('/').length - 1] === 'login') {

    if (isLogin) {
      router.push({ path: '/' });
      location.reload();
    }
  }
  next();
});

export default router
