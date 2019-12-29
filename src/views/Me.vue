<template>
  <div class="me">
    <div class="headInfo">
      <div class="head-img"></div>
      <div class="head-profile">
        <p class="user-id" v-if="userInfo">{{userInfo._id}}</p>
        <p class="user-id" v-else @click="handleLogin">登录/注册</p>
        <p class="user-phone">
          <i class="fa fa-mobile"></i>
          <span v-if="userInfo">{{encryptPhone(userInfo.phone)}}</span>
          <span v-else>登录后享受更多特权</span>
        </p>
      </div>
      <i class="fa fa-angle-right"></i>
    </div>
    <div v-if="userInfo">
      <div class="address-cell">
        <i class="fa fa-map-marker"></i>
        <div class="address-index" @click="myAddress">
          <span>我的地址</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <button @click="handleLogout" class="loginOut-btn">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "me",
  data() {
    return {
      userInfo: ""
    };
  },
  // 组件间守卫-进入该界面时触发（此时还不能通过this获得组件实例）
  beforeRouteEnter(to, from, next) {
    next(vm => vm.getData()); //允许导航过去并调用一个函数
  },
  methods: {
    getData() {
      // 发送网络请求获取数据
      const user_id = localStorage.ele_login;
      this.$axios(`/api/user/user_info/${user_id}`).then(res => {
        this.userInfo = res.data;
        console.log(res.data);
      });
    },
    handleLogin() {
      //未登录状态：跳转登录
      this.$router.push("/login");
    },
    handleLogout() {
      //退出登录： 清除storage对应的数据，然后返回到登录界面
      localStorage.removeItem("ele_login");
      this.$router.push("/login");
    },
    myAddress() {
      //点击我的地址触发： 判断我的地址是否存在信息，存在则展示我的地址（myaddress）,不存在跳转到添加地址（addaddress）
      if (this.userInfo.myAddress.length > 0) {
        this.$router.push("/myAddress");
      } else {
        this.$router.push({
          name: "addAddress",
          params: {
            title: "添加地址",
            addressInfo: {
              tag: "", //标签
              sex: "", //性别
              address: "", //保存地址搜索组件传递过来数据，然后传给formblock组件
              name: "", //联系人
              phone: "", //手机号码
              bottom: "" //门牌号
            }
          }
        });
      }
    },
    encryptPhone(phone) {
      //对号码加星星保护
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    }
  }
};
</script>
<style scoped>
.me {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.headInfo {
  display: flex;
  background-image: linear-gradient(90deg, #0af, #0085ff);
  padding: 6.666667vw 4vw;
  color: #fff;
  align-items: center;
}
.head-img {
  width: 60px;
  height: 60px;
  background-image: url(https://shadow.elemecdn.com/faas/h5/static/sprite.3ffb5d8.png);
  background-size: 60px;
  background-position: 0px 0px;
  border-radius: 50%;
}
.head-profile {
  overflow: hidden;
  margin-left: 4.8vw;
  flex-grow: 1;
}
.head-profile .user-id {
  max-width: 40vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 1.3rem;
  margin-bottom: 2.133333vw;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.head-profile .user-phone {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
}
.user-phone > i {
  margin-right: 0.666667vw;
  font-size: 1rem;
}
.headInfo > i {
  font-size: 1.2rem;
}
.address-cell {
  margin-top: 2.666667vw;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  line-height: 4.533333vw;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding-left: 6.66667vw;
  color: #333;
}
.address-cell > i {
  font-size: 1.3rem;
  color: rgb(74, 165, 240);
  margin-right: 2.666667vw;
}
.address-index {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 3.733333vw 2.666667vw 3.733333vw 0;
  align-items: center;
}
.address-index i {
  font-size: 1.3rem;
  color: #ccc;
}
.loginOut-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 3.733333vw 0;
  margin: 5.333333vw 0;
  border-radius: 0.8vw;
  font-size: 1rem;
  font-weight: 700;
  background-color: #fff;
  border: none;
  color: #ff5339;
}
</style>