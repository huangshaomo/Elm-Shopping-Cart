<template>
  <div class="addAddress">
    <Header :isLeft="true" :title="title" />
    <!-- 添加地址 -->
    <div class="viewbody">
      <div class="content">
        <FormBlock
          v-model="addressInfo.name"
          label="联系人"
          placeholder="姓名"
          :tags="sexes"
          @checkSex="checkSex"
          :selectTag="addressInfo.sex"
        />
        <FormBlock
          v-model="addressInfo.phone"
          label="电话"
          placeholder="手机号码"
          :maxLength="maxLength"
        />
        <FormBlock
          v-model="addressInfo.address"
          label="地址"
          placeholder="小区/写字楼/学校等"
          icon="angle-right"
          @click="showSearch=true"
        />
        <FormBlock
          v-model="addressInfo.bottom"
          label="门牌号"
          placeholder="10号楼5单元404"
          textarea="textarea"
          icon="edit"
        />
        <div class="formblock">
          <div class="label-wrap">标签</div>
          <TabTag :tags="tags" :selectTag="addressInfo.tag" @checkTag="checkTag" />
        </div>
      </div>
      <!-- 确定按钮 -->
      <div class="form-buttom-wrap">
        <button @click="handleSave" class="form-button">确定</button>
      </div>
    </div>
    <!-- 搜索地址 -->
    <AddressSearch :showSearch="showSearch" @close="showSearch=false" :addressInfo="addressInfo" />
  </div>
</template>

<script>
// 引入头部组件、表单组件、标签组件、地址搜索组件,mint-ui的toast弹窗插件
import Header from "../../components/Header";
import FormBlock from "../../components/Others/FormBlock";
import TabTag from "../../components/Others/TabTag";
import AddressSearch from "../../components/Others/AddressSearch";
import { Toast } from "mint-ui";
export default {
  name: "addAddress",
  data() {
    return {
      title: "", //header组件所需头部数据
      maxLength: 11, //手机号长度
      tags: ["家", "公司", "学校"], //标签组件数据
      sexes: ["先生", "女士"], //标签组件数据
      addressInfo: {},//存储地址信息
      showSearch: false //地址搜索组件开关
    };
  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
      vm.addressInfo = to.params.addressInfo,
      vm.title = to.params.title
      console.log(vm);
    });
  },
  methods: {
    checkTag(item) {
      //获取标签数据
      this.addressInfo.tag = item;
    },
    checkSex(item) {
      //获取性别标签数据
      this.addressInfo.sex = item;
      // console.log(this.addressInfo.sex);
    },
    handleSave() {
      //addressInfo数据打包上传到后台服务器，首先检验数据格式是否正确
      // console.log(this.addressInfo);
      if (!this.addressInfo.name) {
        this.showMsg("请输入联系人");
        return;
      }
      if (!this.addressInfo.phone) {
        this.showMsg("请输入手机号码");
        return;
      }
      if (!/^1[345678]\d{9}$/.test(this.addressInfo.phone)) {
        this.showMsg("手机号格式不正确");
        return;
      }
      if (!this.addressInfo.address) {
        this.showMsg("请输入收获地址");
        return;
      }
      // 点击确认有两种情况，一种是编辑后，一种是新增后，编辑是修改数据信息，新增是新增加一条数据
      if(this.title === "添加地址"){
          this.addAddress();    //新增地址操作     
      }else{
          this.editAddress();   //编辑地址操作
      }
    },
    showMsg(msg) {
      //弹窗提示
      Toast({
        message: msg,
        position: "bottom",
        duration: 5000
      });
    },
    alertMsg(){
      Toast({
        message: "操作成功",
        iconClass: "icon icon-success"
      });
    },
    addAddress() {
    //发送网络请求，将addressInfo数据存储到登录用户的空间
      this.$axios
        .post(
          `/api/user/add_address/${localStorage.ele_login}`,
          this.addressInfo
        )
        .then(res => {
          this.alertMsg();
          // 判断vuex的userInfo是否存在数据,没有则把新增的这个地址写入vuex
          // 这个步骤的目的是在于没有地址时，从（settlement）点击新增收获地址的也能够把地址加入到vuex中
          if(!this.$store.getters.userInfo){
            this.$store.dispatch("setUsreInfo",this.addressInfo)
          }
          this.$router.push("/myAddress");
        })
        .catch(err => console.log(err));
    },
    editAddress(){
    //编辑地址操作：发送网络请求进行编辑操作，需要传入用户身份id和要修改的地址的id(这个id是后台自动加上的),跟参数
      this.$axios.post(`/api/user/edit_address/${localStorage.ele_login}/${this.addressInfo._id}`,this.addressInfo)
      .then(res=>{
        this.$router.push("/myAddress");
      })

    },
  },
  components: {
    Header,
    FormBlock,
    TabTag,
    AddressSearch
  }
};
</script>

<style scoped>
.addAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.viewbody {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #f5f5f5;
}
.content {
  padding-left: 4vw;
  background-color: #fff;
  font-size: 0.94rem;
}

/* 标签 */
.formblock {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
}
.formblock .label-wrap {
  flex-basis: 17.333333vw;
  padding: 3.733333vw 0;
  line-height: 4.8vw;
  color: #333;
  font-weight: 700;
}

/* 确定按钮 */
.form-buttom-wrap {
  padding: 5.333333vw 4vw;
  display: flex;
}
.form-buttom-wrap .form-button {
  background: #00d762;
  text-align: center;
  border-radius: 0.533333vw;
  flex: 1;
  border: none;
  font-size: 1.1rem;
  line-height: 5.066667vw;
  color: #fff;
  padding: 3.333333vw;
  font-weight: 500;
}
</style>