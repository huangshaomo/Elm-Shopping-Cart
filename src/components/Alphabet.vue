<template>
<!-- v-if是为了等hotCities获取到才渲染，否则报错在先，渲染在后  。 area_scroll是实现插件滚动的属性，滚动位于该区域-->
  <div class="area" ref="area_scroll" v-if="cityInfo">
      <div class="scroll_wrap cityList">
        <!-- 热门城市 -->
        <div class="hot_wrap">
          <div class="title">热门城市</div>
          <ul class="hot_city">
            <li 
            v-for="(item,index) in cityInfo.hotCities" 
            :key="index"
            @click="$emit('selectCity',item)"
            >{{item.name}}</li>
          </ul>
        </div>
        <!-- 所有城市 -->
        <div class="city_wrap">
          <!-- 循环按字母排序的key -->
          <div class="city_content cityList" 
              v-for="(item,index) in keys" 
              :key="index">
            <!-- 展示A-Z字母 -->
            <div class="title">{{item}}</div>
            <ul>
            <!-- 根据字母展示对应城市名 -->
              <li 
                v-for="(city,index) in cityInfo[item]" 
                :key="index"
                 @click="$emit('selectCity',city)"
                >{{city.name}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="area_keys">
        <ul>
          <!-- 给右边所有字母添加点击事件 -->
          <li @click="selectKey(0)" >#</li>
          <li 
              v-for="(item,index) in keys" 
              :key="index"
              @click="selectKey(index + 1)"
          >{{item}}</li>
        </ul>
      </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
  name: "Alphabet",
  props: {
    cityInfo: Object,
    keys: Array
  },
  data(){
      return {
          scroll: null
      }
  },
  methods: {
      initScroll(){
        //   实例化   第一个参数是实现滚动的位置，第二个参数是设置滚动的一些属性
          this.scroll = new BScroll(this.$refs.area_scroll, {
          click: true
        });
         //   这个方法写完后实际还没有被触发，我们需要在网络请求加载请求完成并拿到所有数据时才调用该方法 
                  //  console.log(this.scroll);
        },
        selectKey(index){
          // console.log(index);
          // console.log(this.$refs.area_scroll.getElementsByClassName('cityList'));
          const cityList = this.$refs.area_scroll.getElementsByClassName('cityList');
          // 根据下表滚动到相应元素上
          let el = cityList[index];
          
          // 滚动到对应的位置上
          this.scroll.scrollToElement(el,250);
        }
  }
};
</script>
<style scoped>
.area {
  margin-top: 10px;
  box-sizing: border-box;
  padding: 0 16px;
  background: #fff;
  height: calc(100% - 65px);
  overflow: hidden;
}
.scroll_wrap {
  background: #fff;
  overflow: auto;
}
.title {
  color: #aaa;
  padding: 15px 0;
}
.hot_city {
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.hot_city li {
  width: 30%;
  background: #f1f1f1;
  margin: 0 10px 10px 0;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
.city_content li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.area_keys {
  position: fixed;
  right: 0;
  top: 25%;
  color: #aaa;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  padding: 0 5px;
}
</style>