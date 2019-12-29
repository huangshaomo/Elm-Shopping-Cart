import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// types vue 显示的类型
const types = {
  SET_LOCATION: "SET_LOCATION",
  SET_ADDREDD: "SET_ADDRESS",
  OTHER_INFO: "OTHER_INFO",
  USER_INFO:　"USER_INFO",
  REMARK_INFO: "REMARK_INFO",
} 

// state
const state = {
  location: {},   //存放定位信息
  address:"",     //存放具体的定位信息
  orderInfo: null,//存放已选的商品（selectFoods）信息与商家信息(shopInfo)
  userInfo: null, //存放已选的用户地址信息
  remarkInfo: {   //存放订单备注信息
    remark: "",   //订单备注
    tableware: "" //餐具份数
  }
}

// getters 类似于computed,
const getters = {
  location: state => state.location,
  address: state => state.address,
  orderInfo: state=> state.orderInfo,
  userInfo: state=> state.userInfo,
  totalPrice: state =>{                 //计算订单的总价格
    let price = 0;
    if(state.orderInfo){
      const selectFoods = state.orderInfo.selectFoods;
      selectFoods.forEach(food =>{
        price +=(food.activity.fixed_price * food.count);
      })
      price +=state.orderInfo.shopInfo.float_delivery_fee
    }
    return price
  },
  remarkInfo: state => state.remarkInfo

}

// Mutations(第一个参数是state,第二个参数是传递过来的数值)
const mutations = {
  [types.SET_LOCATION](state,location) {
    if(location){
      state.location = location
    }else{
      state.location = null;
    }
  },
  [types.SET_ADDREDD](state,address) {
    if(address){
      state.address = address
    }else{
      state.address = null;
    }
  },
  [types.OTHER_INFO](state,orderInfo) {
    if(orderInfo){
      state.orderInfo = orderInfo
    }else{
      state.orderInfo = null;
    }
  },
  [types.USER_INFO](state,userInfo) {
    if(userInfo){
      state.userInfo = userInfo
    }else{
      state.userInfo = null;
    }
  },
  [types.REMARK_INFO](state,remarkInfo) {
    if(remarkInfo){
      state.remarkInfo = remarkInfo
    }else{
      state.remarkInfo = null;
    }
  }
}

// actions
const actions = {
  // 在这里调用mutations
  setLocation: ({ commit }, location) =>{
    commit(types.SET_LOCATION,location)
  },
  setAddress: ({ commit }, address) =>{
    commit(types.SET_ADDREDD,address)
  },
  SetOrderInfo: ({commit},orderInfo)=>{
    commit(types.OTHER_INFO,orderInfo)
  },
  SetUserInfo: ({commit},userInfo)=>{
    commit(types.USER_INFO,userInfo)
  },
  SetRemarkInfo: ({commit},remarkInfo)=>{
    commit(types.REMARK_INFO,remarkInfo)
  }
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
