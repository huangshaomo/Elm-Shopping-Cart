<template>
    <!-- 标签组件 -->
    <div class="input-wrap">
        <span 
        v-for="(item,index) in tags" 
        :key="index"
        class="form-span" 
        :class="{'checked':selectTag == item}"
        @click="$emit('checkTag',item)"
        >
        {{item}}
        </span>
    </div>
</template>

<script>
export default {
    name: "TabTag",
    props: {
        tags: Array,
        selectTag: String
    },
    created(){
        console.log(this.tags);
    }
}
</script>

<style scoped>
.input-wrap{
    display: flex;
    flex: 1 1 0;
    align-items: center;
    border-top: 1px solid #eee;
    padding: 2.666667vw 0;
}
.input-wrap .form-span {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 1.066667vw;
    font-size:0.9rem;
    color: #666;
    text-align: center;
    line-height: 7.466667vw;
    width: 18.133333vw;
    margin-right: 2.666667vw;
}
.checked {
    color: #2395ff !important;
    background: #eef7ff !important;
    border-color: rgba(35, 149, 255, 0.18) !important;

}
</style>