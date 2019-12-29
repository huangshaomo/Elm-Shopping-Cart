<template>
  <div :class="{'open': isSort || isScreen}" @click.self="hideView">
    <!-- 导航 -->
    <div v-if="filterData" class="filter_wrap">
      <aside class="filter">
        <div
          class="filter-nav"
          v-for="(item,index) in filterData.navTab"
          :key="index"
          :class="{'filter-bold': currentFilter == index}"
          @click="filterSort(index)"
        >
          <span>{{item.name}}</span>
          <i v-if="item.icon" :class="'fa fa-'+item.icon"></i>
        </div>
      </aside>
    </div>
    <!-- 排序 -->
    <section class="filter-extend" v-if="isSort">
      <ul>
        <li v-for="(item,index) in filterData.sortBy" :key="index" @click="selectSort(item,index)">
          <span :class="{'selectName': currentSort == index}">{{item.name}}</span>
          <i class="fa fa-check" v-show="currentSort == index"></i>
        </li>
      </ul>
    </section>
    <!-- 筛选 -->
    <section class="filter-extend" v-if="isScreen">
      <div class="filter-sort">
        <div v-for="(screen,index) in filterData.screenBy" :key="index" class="morefilter">
          <p class="title">{{screen.title}}</p>
          <ul>
            <li
              v-for="(item,i) in screen.data"
              :key="i"
              :class="{'selected': item.select}"
              @click="selectScreen(item,screen)"
            >
              <img v-if="item.icon" :src="item.icon" alt />
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="morefilter-btn">
        <span :class="{'edit':edit}" class="morefilter-clear" @click="clearFilter">清空</span>
        <span class="morefilter-ok" @click="filterOk">确定</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "FilterView",
  props: {
    filterData: Object
  },
  data() {
    return {
      currentFilter: 0, //导航栏排序加粗
      isSort: false, //综合排序遮罩层样式开关
      currentSort: 0, //综合排序当前排序
      isScreen: false //筛选排序遮罩层样式开关
    };
  },
  computed: {
    edit() {
    //   清空 按键是否可用    
      let edit = false;
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach(item => {
          if (item.select) {
            edit = true;
          }
        });
      });
      return edit;
    }
  },
  methods: {
    filterSort(index) {
    // 导航栏排序点击事件
      // 字体加粗
      this.currentFilter = index;
      // 遮罩层开关
      switch (index) {
        case 0:
          this.isSort = true;
          this.isScreen = false;
          this.$emit("searchFixed", true); //固定搜索商家位置开关
          break;
        case 1:
          this.$emit("update", {
            condition: this.filterData.navTab[1].condition
          });
          this.hideView();
          break;
        case 2:
          this.$emit("update", {
            condition: this.filterData.navTab[2].condition
          });
          this.hideView();
          break;
        case 3:
          this.isScreen = true;
          this.isSort = false;
          this.$emit("searchFixed", true);
          break;
        default:
          this.hideView();
          break;
      }
    },
    hideView() {
      // 遮罩层隐藏
      this.isSort = false;
      this.isScreen = false;
      this.$emit("searchFixed", false);
    },

    selectSort(item, index) {
      // 综合排序排序类别更改
      this.currentSort = index;
      // 替换对应导航栏名字
      this.filterData.navTab[0].name = this.filterData.sortBy[index].name;
      this.hideView();

      // 在home.vue中更新数据
      this.$emit("update", { condition: item.code });
    },

    selectScreen(item, screen) {
      // 筛选选择 多选和单选
      if (screen.id !== "MPI") {
        // 单选
        screen.data.forEach(ele => {
          ele.select = false;
        });
      }
      // 多选
      item.select = !item.select;
    },
    clearFilter() {
      // 清空筛选条件：将所有select置为false
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach(item => {
          item.select = false;
        });
      });
    },
    filterOk() {
      // 确定筛选条件ok：获取到筛选条件进行更新
      let screenData = {
        MPI: "",
        offer: "",
        per: ""
      };
      let mpiStr = "";
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach((item, index) => {
          // 判断选中的筛选条件是否存在code
          if (item.select) {
            // 两种清空  1.多选   2.单选
            if (screen.id !== "MPI") {
              // 单选
              screenData[screen.id] = item.code;
            } else {
              // 多选
              mpiStr += item.code + ",";
              screenData[screen.id] = mpiStr;
            }
          }
        });
      });
      // 在home.vue中更新数据
      this.$emit("update", { condition: screenData });
      this.hideView();
    }
  }
};
</script>

<style scoped>
.filter_wrap {
  background-color: #fff;
  position: sticky;
  position: -webkit-sticky;
  top: 54px;
  z-index: 10;
}
.filter {
  position: relative;
  border-bottom: 1px solid #ddd;
  line-height: 10.4vw;
  z-index: 101;
  height: 10.666667vw;
  display: flex;
  justify-content: space-around;
}
.filter-nav {
  flex: 1;
  text-align: center;
  color: #666;
  font-size: 0.8333rem;
}
.filter-nav i {
  width: 1.6vw;
  height: 0.8vw;
  margin-left: 1.333333vw;
  margin-bottom: 0.533333vw;
  fill: #333;
  /* will-change属性可以提前通知浏览器我们要对元素做什么动画，这样浏览器可以提前准备合适的优化设置。
  这样可以避免对页面响应速度有重要影响的昂贵成本。元素可以更快的被改变，渲染的也更快，这样页面可以快速更新，表现的更加流畅。 */
  will-change: transform;
}
/* 字体加粗样式 */
.filter-bold {
  font-weight: 600;
  color: #333;
}
/* 遮罩层 */
.open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 3;
}
/* 排序样式 */
.filter-extend {
  background-color: #fff;
  color: #333;
  padding-top: 2.133333vw;
  position: absolute;
  width: 100%;
  z-index: 4;
  left: 0;
  top: 24.533333vw;
}
.filter-extend li {
  position: relative;
  padding-left: 5.333333vw;
  line-height: 10.666667vw;
  overflow: hidden;
}
.fa-check {
  float: right;
  color: #009eef;
  margin-right: 3.733333vw;
  line-height: 10.666667vw;
}
.selectName {
  color: #009eef;
}
/* 筛选 */
.filter-sort {
  background: #fff;
  padding: 0 2.666667vw;
  line-height: normal;
}
.morefilter {
  margin: 2.666667vw 0;
  overflow: hidden;
}
.morefilter .title {
  margin-bottom: 2vw;
  color: #666;
  font-size: 0.5rem;
}
.morefilter ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.8rem;
}
.morefilter li {
  box-sizing: border-box;
  width: 30%;
  height: 9.333333vw;
  line-height: 9.333333vw;
  margin: 0.8vw 1%;
  background: #fafafa;
}
.morefilter li img {
  width: 3.466667vw;
  height: 3.466667vw;
  vertical-align: middle;
  margin-right: 0.8vw;
}
.morefilter li span {
  margin-left: 2%;
  vertical-align: middle;
}
.morefilter-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fafafa;
  box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
  line-height: 11.466667vw;
  box-sizing: border-box;
}
.morefilter-btn span {
  font-size: 0.826667rem;
  text-align: center;
  text-decoration: none;
  flex: 1;
}
.morefilter-clear {
  color: #ddd;
  background-color: #fff;
}
.morefilter-ok {
  color: #fff;
  background-color: #00d762;
  border: 0.133333vw solid #00d762;
}
.selected {
  color: #3190e8 !important;
  background-color: #edf5ff !important;
}

.edit {
  color: #333 !important;
}
</style>