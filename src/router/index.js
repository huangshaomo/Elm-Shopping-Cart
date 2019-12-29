import Vue from 'vue';
import Router from 'vue-router';
import index from '../views/index.vue'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes: [
    {
      path: '/',
      // name: 'index',
      component: index,
      children: [
        {
          path: '',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('../views/Order.vue')
        },
        {
          path: '/me',
          name: 'me',
          component: () => import('../views/Me.vue')
        },
        {
          path: '/address',
          name: 'address',
          component: () => import('../views/Address.vue')
        },
        {
          path: '/city',
          name: 'city',
          component: () => import('../views/City.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/Shops/Shop.vue'),
      redirect: '/goods',
      children: [
        {
          path: '/goods',
          name: 'goods',
          component: () => import('../views/Shops/Goods.vue')
        },
        {
          path: '/comments',
          name: 'comments',
          component: () => import('../views/Shops/Comments.vue')
        },
        {
          path: '/seller',
          name: 'seller',
          component: () => import('../views/Shops/Seller.vue')
        },
      ]
    },
    {
      path: '/myAddress',
      name: 'myAddress',
      component: () => import('../views/Others/MyAddress.vue')
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      component: () => import('../views/Others/AddAddress.vue')
    },
    {
      path: '/settlement',
      name: 'settlement',
      component: () => import('../views/Others/Settlement.vue')
    },
    {
      path: '/remark',
      name: 'remark',
      component: () => import('../views/Others/Remark.vue')
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('../views/Others/Pay.vue')
    },
    {
      path: '/orderInfo',
      name: 'orderInfo',
      component: () => import('../views/Others/OrderInfo.vue')
    },
  ]
});
// 设置全局路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.ele_login ? true : false;
  // 判断用户的访问页面：如果用户访问了登录页面，则正常跳转
  //                   如果用户访问其他页面，验证是否已经登录，如果登录了，正常执行操作
  //                                                        如果未登录，返回登录页面
  if (to.path === '/login') {
    next();
  } else {
    // 是否在登录状态下
    isLogin ? next() : next('/login');
  }

})

export default router