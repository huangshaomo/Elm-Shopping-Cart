<template>
  <!-- settlement下餐具份数组件 -->
  <transition>
    <div class="tableware" v-if="isShow">
      <div class="actions-sheet">
        <i class="fa fa-remove" @click="$emit('close')"></i>
        <h2 class="actions-sheet-header">
          <span class="tag"></span>
          <span class="title">餐具份数</span>
          <span class="tag"></span>
        </h2>
        <ul>
          <li
          :class="{'selected': selectItem == item}"
          v-for="(item,index) in tablewareList" 
          :key="index" 
          @click="clickItem(item)"
          >{{item}}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Tableware",
  data() {
    return {
      tablewareList: ["1", "2", "3", "4", "5", "6"],
      selectItem: "",
    };
  },
  props: {
    isShow: Boolean,
  },
  methods: {
      clickItem(item){
        //将选择的餐具份数数据保存到vuex;
        // console.log(item);
        this.selectItem = item;
        this.$store.dispatch("SetRemarkInfo",{
            remark: this.$store.getters.remarkInfo.remark,
            tableware: item + "份餐具"
        })
        this.$emit('close')
      }
  }
};
</script>

<style scoped>
.tableware {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.actions-sheet {
  position: absolute;
  background-color: #f5f5f5;
  box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.4);
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 5.333333vw 6.933333vw;
  box-sizing: border-box;
  transition: transform 0.2s;
  will-change: transform;
}
.actions-sheet-header {
  margin-bottom: 3.2vw;
  padding: 0 7.466667vw;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}
.actions-sheet-header .tag {
  display: inline-block;
  width: 4.266667vw;
  height: 0.266667vw;
  border-top: 0.266667vw solid #333;
}
.actions-sheet-header .title {
  margin: 0 3.2vw;
}
.actions-sheet ul {
  margin-top: 5.466667vw;
  max-width: 80vw;
  overflow-y: scroll;
}
.actions-sheet ul li {
  margin-bottom: 7.466667vw;
  text-align: center;
}
.fa-remove {
  position: absolute;
  height: 6.4vw;
  width: 6.4vw;
  right: 2.666667vw;
  top: 2.666667vw;
  color: #aaa;
  font-size: 1.2rem;
}

/* 过度动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 选中样式 */
.selected {
  color: #2396ff;
  font-weight: 500;
}
</style>