<template>
<!-- 支付页面 -->
    <div class="pay">
        <Header title="在线支付"/>
        <div class="main" v-if="orderInfo">
            <div class="tip">
                <p class="countdown-title">支付剩余时间</p>
                <h3 class="countdown-text">{{countDown}}</h3>
            </div>
            <section class="home">
                <ul class="list info-list">
                    <li>
                        <span class="order-name">{{orderInfo.shopInfo.name}}</span>
                        <span class="text highlight">￥{{totalPrice}}</span>
                    </li>
                </ul>
                <div class="title">在线支付</div>
                <ul class="list payment-list">
                    <li class="payment-list-item">
                        <div class="icon">
                            <img src="../../assets/wechat.jpg" alt="">
                            <span>微信</span>
                        </div>
                        <i class="fa fa-check-circle selected"></i>  
                    </li>
                </ul>
            </section>
            <div class="btn-submit-wrap">
                <button @click="pay"  :disabled="timeOut" class="btn-submit">确认支付</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "../../components/Header"
export default {
    name: "Pay",
    data(){
        return {
            countDown: "00:15:00",    //倒计时时间
            timer: null, 
            timeOut: false            //按钮是否禁用开关             
        }
    },
    beforeRouteEnter(to,from,next){
        next(vm=>{
            vm.countTimeDown();
        })
    },
    computed: {
        orderInfo() {
        //订餐食品的信息（数据存在vuex）
            return this.$store.getters.orderInfo;
        },
        totalPrice(){
        //订餐食品的总价格（数据存在vuex）
            return this.$store.getters.totalPrice;
        },
        userInfo(){
        //获取已选的用户地址信息（数据存在vuex）
            return this.$store.getters.userInfo;
        },
        remarkInfo(){
        //获取订单备注信息（数据存在vuex）
            return this.$store.getters.remarkInfo;
        },
    },
    methods: {
      countTimeDown(){
        clearInterval(this.timer);
      //倒计时方法：首先判断时间是否还有剩余，有就继续倒计时，没有就提示订单已超时
            let minute = 14;
            let second = 60;
            this.timer = setInterval(() => {
                second--;
                if (second == "00" && minute == "00") {
                  this.countDown = "订单已超时";
                  clearInterval(this.timer)
                  this.timeOut = true;
                  return;
                }
                if(second == "00"){
                  second = 59;
                  minute--;

                  if(minute < 10){
                    minute = "0" + minute;
                  }
                }
                if(second < 10){
                  second = "0" +second;
                }
                this.countDown = "00:" + minute + ":" + second;
            }, 1000);
      },
      pay(){
        this.addOrder();
        return;
      //调用微信支付接口完成支付: 首先向后端传递参数（data），
        const data = {
          body: "小红红",   //商品描述
          out_trade_no: new Date().getTime().toString(),  //商户订单号
          total_fee: 0.02 //标价金额
        }
        alert("进入到pay方法中");
        // 请求 http://www.thenewstep.cn/wxzf/example/jsapi.php
        fetch("http://www.thenewstep.cn/wxzf/example/jsapi.php",{
          methods: "POST",
          headers: {
          "Content-type": "application/json"
          },
          body: JSON.stringify(data)  //给后端传递的参数
        })
        .then(res => res.json())    //fetch成功下来得到的数据是一个promise对象，需要用.json()方法进行解析
        .then(data =>{              //解析完成后得到的后端返回来的Object对象
        //调用微信支付方法  
          onBridgeReady(data);     
        })
        .catch(err =>{
          alert("请求失败");
        })
      },
      onBridgeReady(data){
      // 微信支付方法，传递参数，调起支付
        WeixinJSBridge.invoke({data},(res)=>{
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
            // 使用以上方式判断前端返回,微信团队郑重提示：
                  //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                  // alert("支付成功");
                  // 生成订单
                  // this.addOrder();
            } 
        }); 
      },
      addOrder(){
      //点击提交订单按钮时把订单信息存储到数据库.然后跳转到订单页面
        let orderlist = {
          orderInfo: this.orderInfo,
          totalPrice: this.totalPrice,
          userInfo: this.userInfo,
          remarkInfo: this.remarkInfo

        }
        // console.log(orderList);
        this.$axios.post(`/api/user/add_order/${localStorage.ele_login}`,orderlist)
        .then(res =>{
          // console.log(res.data);
          this.$router.push('/order');
        })
      }
    },
    components: {
        Header,
    }
}
</script>

<style scoped>
.pay {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}

.main {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.tip {
  display: block;
  text-align: center;
  background-color: #fff;
  color: #333;
  padding: 2rem 0;
  line-height: 2rem;
}
.countdown-title {
  font-size: 0.88rem;
  color: #999;
}
.countdown-text {
  height: 2rem;
  color: #333;
  font-size: 1.8rem;
}
.list {
  border-bottom: 0.5px solid #eee;
  background: #fff;
}
.info-list {
  padding: 0 1.5rem;
}
.info-list li {
  border-top: 0.5px solid #eee;
  display: flex;
  padding: 1.5rem 0;
  font-size: 1rem;
  line-height: 1rem;
  justify-content: space-between;
}
.info-list li .order-name {
  color: #333;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 16px;
  max-width: 60%;
}
.text-highlight {
  color: #ff6000;
}
.title {
  background-color: #f5f5f5;
  font-size: 0.88rem;
  padding: 1.2rem 1.2rem 1rem;
  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.payment-list-item {
  border-bottom: 0.5px solid #eee;
  padding: 0.9rem 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon {
  display: flex;
  align-items: center;
}
.payment-list-item img {
  width: 2.4rem;
  height: 2.4rem;
  margin-right: 20px;
}
.payment-list-item > i {
  font-size: 1.5rem;
  color: #eee;
}
.selected {
  color: #4cd964 !important;
}
.btn-submit-wrap {
  margin: 1rem auto;
  width: 90%;
}
.btn-submit {
  font-size: 1.1rem;
  line-height: 1.5rem;
  background-color: #4cd964;
  width: 100%;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 5px;
  padding: 0.5rem;
  box-sizing: border-box;
}

/* 不可点击btn */
.btn-submit[disabled] {
  background-color: #bbb !important;
}

</style>