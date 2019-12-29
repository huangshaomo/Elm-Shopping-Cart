<template>
  <div class="city">
    <div class="search_wrap">
      <div class="search">
        <i class="fa fa-search"></i>
        <input type="text" v-model="city_val" placeholder="请输入城市名" />
      </div>   
      <button @click="$router.push({name:'address',params: {city: city}})">取消</button>
    </div>
    <!-- 要想实现滚动,子容器的高度必须大于父容器的高度，因此需要限制父容器的高度 -->
    <div style="height:100%" v-if="searchList.length == 0"> 
      <div class="location">
        <Location @click="selectCity({name:city})" :address="city" />
      </div>
      <Alphabet @selectCity="selectCity" ref="allcity" :cityInfo="cityInfo" :keys="keys" />
    </div>
    <div class="search_list" v-else>
      <ul>
        <li
          v-for="(item,index) in searchList"
          :key="index"
          @click="selectCity(item)"
        >{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Location from "../components/Location";
import Alphabet from "../components/Alphabet";
export default {
  name: "City",
  data() {
    return {
      city_val: "", //city输入框输入的内容
      cityInfo: null, //获取所有城市的数据（字母+所有城市的数据，包括热门城市）
      keys: [], //获取A-Z大写字母 
      allcities: [],    //获取所有城市数据，只有城市数据
      searchList: []    //执行搜索时，匹配的城市
    };
  },
  computed: {
    // 获取城市名或省份名显示在当前定位
    city() {
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  watch: {
    city_val(){
      // console.log(this.city_val);
      this.searchCity();
    }
  },
  components: {
    // 注册组件
    Location,
    Alphabet
  },
  // 创建钩子(生命周期函数)，进入页面就加载所有城市
  created() {
    this.getCityInfo();
  },
  methods: {
    getCityInfo() {
      // 发送网络请求获取所有城市列表
      this.$axios("/api/posts/cities")
        .then(res => {
          this.cityInfo = res.data;
          // console.log(this.cityInfo);
          // 处理key
          this.keys = Object.keys(res.data);
          // console.log(this.keys);
          // 移除hotcity
          this.keys.pop();
          // keys排序
          this.keys.sort();
          // console.log(this.keys);
          this.$nextTick(() => {
               this.$refs.allcity.initScroll();
          });

          // 获取到所有城市名,push到allcities里
          this.keys.forEach(key => {
            // console.log(key);
                this.cityInfo[key].forEach(city =>{
                  // console.log(city);
                  this.allcities.push(city);
                })
          });

        })
        .catch(err => {
          console.log(err);
        });
    },

    // 选择城市
    selectCity(city){
      // console.log(city);
      this.$router.push({name: 'address',params:{city:city.name}})
    },

    searchCity(){
      // 根据搜索框筛选匹配城市
      if(!this.city_val){
        // 如果搜索框为空，数组置空
        this.searchList = [];
      }else{
        // 根据输入框的 关键字检索城市，并存入到searchList数组中
        this.searchList = this.allcities.filter(item =>{
          // 在所有城市数据中遍历出与在搜索框中输入的名称有交集的城市
          return item.name.indexOf(this.city_val) != -1;
        })
        // console.log(this.searchList);
      }
    }
  }
};
</script>
<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background-color: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
  outline: none;
  border: none;
  color: #009eef;
  background-color: transparent;
}
.location {
  background-color: #fff;
  padding: 8px 16px;
  height: 65px;
  box-sizing: border-box;
}
.search_list {
  background-color: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>