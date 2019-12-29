<template>
  <div class="Rating-gray">
    <i v-for="(item,index) in itemClass" :key="index" class="fa" :class="item"></i>
  </div>
</template>

<script>
// 星星长度
const LENGTH = 5;
// 星星对应的class
const CLS_ON = "fa-star";
// 有颜色填充的半星
const CLS_HALF = "fa-star-half-empty";
// 没有颜色填充的半星
const CLS_OFF = "fa-star-o"

export default {
  name: "Rating",
  props: {
      rating:Number
  },
  computed: {
      itemClass(){
        //假设分数是4.8  四个全星  一个半星
        let result = [];
        //  对分数进行处理，向下取0.5的倍数
        let score = Math.floor(this.rating * 2) /2;
        // 控制半星,有就有，没有就空
        let hasDecimal = score % 1 !==0;
        //全星
        let integer = Math.floor(score);
        // 全星放入数组中
        for (let i = 0; i < integer; i++) {
                result.push(CLS_ON);            
        }
        // 半星
        if (hasDecimal) {
            result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
            result.push(CLS_OFF);
        }
        return result
      }
  }
};
</script>

<style scoped>
.Rating-gray {
    margin-right: 1.066667vw;
    color: #ffbe00;
    display: inline-block;
}
</style>