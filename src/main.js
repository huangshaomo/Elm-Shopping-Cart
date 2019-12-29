import Vue from 'vue';
import App from './App.vue';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import router from './router';
import store from './store';
import axios from 'axios';
// import qs from 'qs';    //可以发生正常的post请求

// 引入加载动画
import { Indicator } from 'mint-ui';
Vue.use(MintUI);

 //发送axios网络请求时会自动加上该前缀: 
// axios.defaults.baseURL ="https://ele-interface.herokuapp.com";  


// 请求拦截，设置请求加载动画
axios.interceptors.request.use(config =>{
  // if(config.method == 'post'){
  //   //使用qs转换post请求发送的数据
  //   config.data = qs.stringify(config.data); //将对象 序列化成URL的形式，以&进行拼接
  // }

  // 加载动画
  Indicator.open();
  return config
},error =>{
  return Promise.reject(error);
})

//  响应拦截
axios.interceptors.response.use(response => {
    Indicator.close();
    return response
},error =>{
  // 错误提醒
  Indicator.close();
  return Promise.reject(error)
})

Vue.config.productionTip = false //阻止生产模式信息的产生
Vue.prototype.$axios = axios; //将axios挂载到全局

new Vue({
  router,
  store,
  render: h => h(App)        // 是这个的缩写形式：render: function (createElement) { |  createElement 函数，这个函数的作用就是生成一个 VNode节点，
                             //                        return createElement(App);  ｜  render 函数得到这个 VNode 节点之后，返回给 Vue.js 的 mount 函数，
                             //                  }                               　｜    渲染成真实 DOM 节点，并挂载到根节点上。
}).$mount('#app')
