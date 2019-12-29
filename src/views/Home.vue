<template>
  <div class="home">
    <div class="header">
      <!-- 高德地图 -->
      <div class="address_map" @click="$router.push({name:'address',params: {city: city}})">
        <i class="fa fa-map-marker"></i>
        <span>{{address}}</span>
        <i class="fa fa-sort-desc"></i>
      </div>
    </div>
    <!-- 搜索商家 -->
    <div class="search_wrap" :class="{'fixedview': showFilter}" @click="$router.push('/search')">
      <div class="shop_search">
        <i class="fa fa-search">搜索商家 商家名称</i>
      </div>
    </div>
    <!-- 轮播图和食物分类 -->
    <div id="container">
      <!-- 轮播 -->
      <mt-swipe :auto="4000" class="swiper">
        <mt-swipe-item v-for="(img,index) in swipeImgs" :key="index">
          <img :src="img" alt="轮播图" />
        </mt-swipe-item>
      </mt-swipe>
      <!-- 分类 -->
      <mt-swipe :auto="0" class="entries">
        <mt-swipe-item v-for="(entry,i) in entries" :key="i" class="entry_wrap">
          <div class="foodentry" v-for="(item,index) in entry" :key="index">
            <div class="img_wrap">
              <img :src="item.image" alt />
            </div>
            <span>{{item.name}}</span>
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!-- 推荐商家 -->
    <div class="shoplist-title">推荐商家</div>
    <!-- 导航组件 -->
    <FilterView :filterData="filterData" @searchFixed="showFilterView" @update="update" />
    <!-- mint加载更多组件 -->
    <mt-loadmore
      :top-method="loadData"
      :bottom-method="loadMore"
      :bottom-all-loaded="allLoaded"
      :auto-fill="false"
      :bottomPullText="bottomPullText"
      ref="loadmore"
    >
      <!-- 商家信息组件 -->
      <div class="shoplist">
        <indexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant" />
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Loadmore } from "mint-ui";
// 引入排序导航栏组件跟商家信息组件
import FilterView from "../components/FilterView";
import indexShop from "../components/indexShop";
export default {
  name: "home",
  data() {
    return {
      swipeImgs: [], //轮播图图片容器
      entries: [], //食品分类栏容器
      filterData: null, //排序导航栏数据
      showFilter: false, //搜索商家是否固定开关
      page: 1, //请求餐厅页数
      size: 5, //请求餐厅的条数
      restaurants: [], //存放所有商家容器
      allLoaded: false, //加载更多
      bottomPullText: "没有更多了哦", //下拉请求不到数据以后
      data: null      //接收排序的条件
    };
  },
  computed: {
    address() {
      // 获取详细地址
      return this.$store.getters.address;
    },
    city() {
      // 获取城市或省份
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      // 请求轮播图和分类数据
      this.$axios("/api/profile/shopping").then(res => {
        // console.log(res.data);
        this.swipeImgs = res.data.swipeImgs;
        this.entries = res.data.entries;
      });
      //获取筛选功能数据
      this.$axios("/api/profile/filter").then(res => {
        //   console.log(res.data);
        this.filterData = res.data;
      });
      this.loadData();
    },
    loadData() {
      this.page = 1;
      this.allLoaded = false;
      this.bottomPullText = "上拉加载更多";
      //拉取商家信息
      this.$axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`,this.data)
        .then(res => {
          // console.log(res.data);
          this.$refs.loadmore.onTopLoaded();
          this.restaurants = res.data;
        });
    },
    // 上拉加载
    loadMore() {
      if (!this.allLoaded) {
        this.page++;
      }
      //拉取商家信息
      this.$axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`)
        .then(res => {
          //上拉加载完之后重新渲染
          this.$refs.loadmore.onBottomLoaded();
          if (res.data.length > 0) {
            // 数据不为空
            res.data.forEach(item => {
              this.restaurants.push(item);
            });
            if (res.data < this.size) {
              // 数据的条数少于请求的条数时
              this.allLoaded = true;
              this.bottomPullText = "没有更多了哦";
            }
          } else {
            // 数据为空
            this.allLoaded = true;
            this.bottomPullText = "没有更多了哦";
          }
        });
    },
    showFilterView(isShow) {
      this.showFilter = isShow;
    },
    update(condition) {
      // console.log(condition);
      this.data = condition;
      this.loadData();
    }
  },
  components: {
    FilterView,
    indexShop
  }
};
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: auto;
  /* 宽度包括了padding和border */
  box-sizing: border-box;
}
.header,
.search_wrap {
  background-color: #009eef;
  padding: 10px 16px;
}
.header .address_map {
  color: #fff;
  font-weight: bold;
}
.address_map i {
  margin: 0 3px;
  font-size: 18px;
}
.address_map span {
  display: inline-block;
  width: 80%;
  overflow: hidden;
  /* 规定段落中的文本不进行换行： */
  white-space: nowrap;
  /* 文本溢出时使用省略符合来表示 */
  text-overflow: ellipsis;
}
.search_wrap .shop_search {
  /* margin-top: 10px; */
  background-color: #fff;
  padding: 10px 0;
  border-radius: 4px;
  text-align: center;
  color: #aaa;
}
.search_wrap {
  position: sticky;
  top: 0px;
  z-index: 999;
  box-sizing: border-box;
}
/* 轮播图 */
.swiper {
  height: 100px;
}
.swiper img {
  width: 100%;
  height: 100px;
}
.entries {
  background-color: #fff;
  height: 47.2vw;
  text-align: center;
  overflow: hidden;
}
.foodentry {
  width: 20%;
  float: left;
  position: relative;
  margin-top: 2.933333vw;
}
.foodentry .img_wrap {
  position: relative;
  display: inline-block;
  width: 12vw;
  height: 12vw;
}
.img_wrap img {
  width: 100%;
  height: 100%;
}
.foodentry span {
  display: block;
  color: #666;
  font-size: 0.32rem;
}
/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background-color: #fff;
}
.shoplist-title:before,
.shoplist-title:after {
  display: block;
  content: "一";
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title:before {
  margin-right: 3.466667vw;
}
.shoplist-title:after {
  margin-left: 3.466667vw;
}
/* 遮罩层弹出后搜索商家的样式 */
.fixedview {
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 999;
}
.mint-loadmore {
  height: calc(100% - 95px);
  overflow: auto;
}
</style>