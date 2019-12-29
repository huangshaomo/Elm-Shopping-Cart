<template>
  <div class="myaddress">
    <Header :isLeft="true" :title="title" />
    <!-- 显示收获地址 -->
    <div class="address-view">
      <div class="address-card" v-for="(address,index) in allAddress" :key="index">
        <div class="address-card-select">
            <i class="fa fa-check-circle" v-if="selectIndex == index"></i>
        </div>
        <div class="address-card-body" @click="setAddressInfo(address,index)">
          <p class="address-card-title">
            <span class="username">{{address.name}}</span>
            <span v-if="address.sex" class="gender">{{address.sex}}</span>
            <span class="phone">{{address.phone}}</span>
          </p>
          <p class="address-card-address">
            <span class="tag" v-if="address.tag">{{address.tag}}</span>
            <span class="address-text">{{address.address}}</span>
          </p>
        </div>
        <!-- 编辑和删除 -->
        <div class="address-card-edit">
          <i @click="handleEdit(address)" class="fa fa-edit"></i>
          <i @click="handleDelete(address,index)" class="fa fa-close"></i>
        </div>
      </div>
    </div>

    <!-- 新增收获地址 -->
    <div class="address-view-bottom" @click="addAddress">
      <i class="fa fa-plus-circle"></i>
      <span>新增收获地址</span>
    </div>
  </div>
</template>

<script>
import Header from "../../components/Header";
export default {
  name: "MyAddress",
  data() {
    return {
      title: "我的地址",
      allAddress: [],
      selectIndex: 0,
    };
  },
  methods: {
    addAddress() {
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
    },
    getData() {
      //发送网络请求获取addressInfo数据
      this.$axios(`/api/user/user_info/${localStorage.ele_login}`).then(res => {
        // console.log(res.data);
        this.allAddress = res.data.myAddress;
      });
    },
    handleEdit(address) {
      //编辑地址信息
      this.$router.push({
        name: "addAddress",
        params: {
          title: "编辑地址",
          addressInfo: address
        }
      });
    },
    handleDelete(address, index) {
      //删除地址信息
      if (confirm("确定要删除该地址吗？")) {
        this.$axios
          .delete(`/api/user/address/${localStorage.ele_login}/${address._id}`)
          .then(res => {
            // 对应的也删除数组里面的内容
            this.allAddress.splice(index, 1);
          });
      }
    },
    setAddressInfo(address,index){
    //点击：更改收获地址
        this.selectIndex = index;
        //将address存储到vuex中，方便在别的组件使用
        this.$store.dispatch("SetUserInfo",address);
        this.$router.push("/settlement")
    }
  },
  components: {
    Header
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.getData());
  }
};
</script>

<style scoped>
.myaddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.address-view-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 13.866667vw;
  background-color: #fff;
  color: #3190e8;
  border-top: 0.266667vw solid #ddd;
  font-size: 1rem;
}
.address-view-bottom > i {
  font-size: 1.3rem;
  margin-right: 8px;
}

/* 地址展示部分 */
.address-view {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 13.866667vw;
}
.address-card {
  background-color: #fff;
  padding: 4vw;
  border-bottom: 1px solid #ddd;
  display: flex;
  min-height: 18.133333vw;
}
.address-card-body {
  flex: 1;
  overflow: hidden;
}
.address-card-title {
  font-size: 1rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 1.066667vw;
}
.address-card-title .username {
  color: #333;
  font-weight: 700;
}
.address-card-title .gender {
  padding: 0 1.6vw 0 0.8vw;
}
.address-card-address {
  color: #666;
  font-size: 0.84rem;
  display: flex;
  align-items: center;
}
.address-card-address .tag {
  display: inline-block;
  position: relative;
  margin-right: 0.8vw;
  padding: 0.533333vw;
  color: #ff5722;
  white-space: nowrap;
  border: 1px solid #ff5722;
  border-radius: 0.133333vw;
  font-size: 0.6rem !important;
  line-height: 2.666667vw;
}
.address-text {
  line-height: 4.533333vw;
}

/* 编辑和删除 */
.address-card-edit {
  flex-basis: 13.066667vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.address-card-edit > i {
  color: #aaa;
  font-size: 1.2rem;
}

/*  选中图标 */
.address-card-select {
  flex-basis: 7.333333vw;
  min-width: 7.333333vw;
  display: flex;
  align-items: center;
}
.address-card-select > i {
  font-size: 1.5rem;
  color: #4cd964;
}
</style>