<template>
    <div class="login">
        <div class="logo">
            <img src="../assets/logo.jpg" alt="my login img">
        </div>
        <!-- 手机号 -->
        <inputGroup 
        type="number" 
        placeholder="请输入手机号" 
        v-model="phone" 
        :btnTitle="btnTitle" 
        :disabled="disabled" 
        :error="errors.phone"
        @btnClick="getVerifyCode"
        />
        <!-- 验证码 -->
        <inputGroup type="number"  v-model="verifyCode" placeholder="验证码"
        :error="errors.code"/>
        <!-- 用户服务协议 -->
        <div class="login_des">
            <p>新用户登录即自动注册，表示已同意
                <span>《用户服务协议》</span>
            </p>
        </div>
        <!-- 登录按钮 -->
        <div class="login_btn">
            <button :disabled="isClick" @click="handleLogin">登录</button>
        </div>
    </div>
</template>

<script>
import inputGroup from '../components/inputGroup'
export default {
    name:"login",
    // 注册组件
    components: {
        inputGroup,
    },
    data(){
        return {
            phone: "",
            verifyCode:"",
            btnTitle:"获取验证码",
            errors:{},
            disabled:false,
        }
    },
    computed:{
        // 登录按钮是否禁止点击
        isClick(){
            // 只要有任意一个没有输入数据，就不能点击
            if(!this.phone || !this.verifyCode){
                return true
            }else{
                return false
            }
        }
    },
    methods: {
        // 登录操作：再次发送网络请求验证手机号和验证码是否匹配
        handleLogin(){
            // 取消错误提醒
            this.errors = {};
            // 发送请求
            this.$axios.post("/api/posts/sms_back",{
                phone:this.phone,
                code:this.verifyCode
            })
            .then(res =>{
                console.log(res.data)
                // 检验成功，设置登录状态并且跳转到/
                localStorage.setItem("ele_login",res.data.user._id);
                this.$router.push("/");
            })
            .catch(err =>{
                this.errors = {
                    code:err.response.data.msg
                }
            })
        },
        //点击登录—— 发送网络请求获取验证码
        getVerifyCode(){
            // 验证手机格式
            if(this.validatePhone()){
                // 触发验证码倒计时
                this.validateBtn();
                // 发送网络请求
                this.$axios
                .post("/api/posts/sms_send",{
                    tpl_id: "193334",
                    key: "88f497397da42ac4b0d49c7a0903c3c1",
                    phone: this.phone
                })
                .then(res =>{
                    console.log(res);
                })
                .catch(err =>{
                    console.log(err);
                })
            }
        },
        // 验证手机号：判断手机号是否填写，判断手机号码格式是否合法
        validatePhone(){
            if(!this.phone){
                console.log(this.phone);
                this.errors = {
                    phone: "手机号码不能为空"
                }
                return false;
            } else if( !/^1[345678]\d{9}$/.test(this.phone)){
                this.errors = {
                    phone: "手机号码格式错误"
                };
                return false
            }else{
                this.errors = {};
                return true;
            }
        },
        // 验证码倒计时：未到零不能再次点击
        validateBtn() {
            let time = 60;
            let timer = setInterval(() => {
                if (time == 0) {
                clearInterval(timer);
                this.btnTitle = "获取验证码";
                this.disabled = false;
                } else {
                // 倒计时
                this.btnTitle = time + "秒后重试";
                this.disabled = true;
                time--;
                }
            }, 1000);
        },


    }
}
</script>
<style scoped>
.login{
    width: 100%;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    background: #fff;
}
.logo{
    text-align: center;
}
.logo img{
    width: 150px;
}
.text_group,
.login-des,
.login_btn{
    margin-top: 20px;
}
.login_des{
    color: #aaa;
    line-height: 22px;
}
.login span{
    color: #4d90fe;
    cursor: pointer;
}
.login_btn button{
    width: 100%;
    height: 40px;
    background-color: #48ca38;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    border: none;
    outline: none;
    cursor: pointer;
}
/* 登录按钮禁用时样式 */
.login_btn button[disabled]{
    background-color: #8bda81;
}
</style>