<template>
  <div class="seller" v-if="sellerInfo">
    <section>
      <img :src="sellerInfo.header_image" />
      <h3>{{sellerInfo.title}}</h3>
      <p>{{sellerInfo.brand_intros[0].brief}}</p>
      <div>查看品牌故事</div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Seller",
  data() {
    return {
      sellerInfo: null
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios("/api/profile/seller").then(res => {
        console.log(res.data);
        this.sellerInfo = res.data;
      });
    }
  }
};
</script>

<style scoped>
.seller section {
  background-color: #fff;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2.666667vw;
  padding: 4.266667vw 4vw 4vw;
  border-bottom: 1px solid #eee;
}
section > img {
  width: 92vw;
  height: 52vw;
  margin-bottom: 4.2666667vw;
}
section h3 {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1.0666667vw;
  color: #333;
}
section > p {
  height: 40px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
section > div {
    text-align: center;
    margin: 4vw 0 -4vw;
    padding: 4vw 0;
    font-size: 0.346667cw;
}
</style>