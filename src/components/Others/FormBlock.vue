<template>
<!-- 表单组件 -->
    <div class="formblock">
        <div class="label-wrap">{{label}}</div>
        <div class="input-group-wrap" @click="$emit('click')">
            <div class="input-wrap">
                <input 
                v-if="!textarea"
                :type="type" 
                :value="value" 
                :placeholder="placeholder" 
                @input="$emit('input',$event.target.value)"
                :maxlength="maxLength"
                >
                
                <textarea
                v-else 
                :type="type" 
                :value="value" 
                :placeholder="placeholder" 
                @input="$emit('input',$event.target.value)"
                rows="2"
                maxlength="100"
                >
                </textarea>
                <i v-if="icon" :class="'fa fa-'+icon"></i>
            </div>
            <TabTag  v-if="tags" :tags="tags" @checkTag="checkTag" :selectTag="selectTag"/>
        </div>
    </div>
</template>

<script>
// 引入标签组件
import TabTag from './TabTag'
export default {
    name: "FormBlock",
    props: {
        type:{
            type:String,
            default: "text"
        },
        label: String,      //输入框前面的标签名
        value: String,      //输入框绑定的值
        placeholder: String,//提示文字
        icon: String,       // icon图标
        textarea: String,   // 复文本框
        tags: Array,        //
        selectTag: String,  //
        maxLength:Number,
    },
    methods: {
        checkTag(item){
            // console.log(item);
            this.$emit("checkSex",item)
        }
    },
    components: {
        TabTag,
    }
}
</script>

<style scoped>
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
.input-group-wrap {
    flex: 1;
}
.input-wrap {
    flex: 1 1 0%;
    padding: 3.733333vw;
    display: flex;
    align-items: center;
}
.input-wrap input {
    flex: 1;
    outline: none;
    border: none;
    line-height: 4.8vw;
    color: #333;
    padding-right: 4vw;
    padding-left: 0;
    font-size: 0.9rem;
}

.input-wrap textarea {
    font-family: '微软雅黑';
    outline: none;
    border:none;
    font-size: 0.9rem;
    line-height: 4.8vw;
    color: #333;
    padding-right: 4vw;
    padding-left: 0;
    flex: 1;
}
.input-wrap i {
    margin-right: 3.2vw;
    color: rgb(102,102,102);
    font-size: 1.2rem;
}
</style>