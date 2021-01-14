<template>
    <div class="register background">
        <el-form
            :model="ruleForm2"
            :rules="rules2"
            ref="ruleForm2"
            label-position="left"
            label-width="0px"
            class="demo-ruleForm login-container login-background"
        >
            <h3 class="title">用户注册</h3>
            <el-form-item prop="name">
                <el-input
                    type="text"
                    v-model="ruleForm2.name"
                    auto-complete="off"
                    placeholder="用户名"
                    suffix-icon="el-icon-user-solid"
                ></el-input>
            </el-form-item>
            <el-form-item prop="phone">
                <el-input
                    type="phone"
                    v-model="ruleForm2.phone"
                    auto-complete="off"
                    placeholder="手机号"
                    suffix-icon="el-icon-phone"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    type="password"
                    v-model="ruleForm2.password"
                    auto-complete="off"
                    placeholder="密码"
                    suffix-icon="el-icon-lock"
                ></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input
                    type="password"
                    v-model="ruleForm2.checkPass"
                    auto-complete="off"
                    placeholder="再次输入密码"
                    suffix-icon="el-icon-lock"
                ></el-input>
            </el-form-item>
            <div class="item">
                <el-link
                    type="primary"
                    style="margin: 0px 0px 30px 0px"
                    @click="toLogin"
                    >已有账户?去登录</el-link
                >
            </div>
            <el-form-item style="width: 100%">
                <el-button
                    type="primary"
                    style="width: 100%"
                    @click="handleSubmit2"
                    :loading="loading"
                    >注册</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    isvalidatemobile,
    validateEmail,
    validatePassword,
    isvalidUsername,
} from "@/utils/validate";
import md5 from 'js-md5';
import {register} from '@/api/register';
import {tips} from "@/common/js/optionTips";
export default {
    name: "login",
    data() {
        const _validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm2.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        const validateTel = (rule, value, callback) => {
            const list = isvalidatemobile(value);
            if (list[0]) {
                callback(new Error(list[1]));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            ruleForm2: {
                name: "",
                password: "",
                phone: "",
                checkPass: "",
            },
            rules2: {
                name: [
                    { required: true, message: "请输入账号", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                ],
                checkPass: [{ validator: _validatePass, trigger: "blur" }],
                phone: [{ validator: validateTel, trigger: "blur" }],
            },
            checked: false,
            redirect: undefined,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    methods: {
        handleSubmit2(ev) {
            this.$refs.ruleForm2.validate((valid) => {
                if (valid) {
                    const data = {...this.ruleForm2};
                    data.password = md5(data.password);
                    data.avatarUrl = 'http://image.yujian95.cn/FmxdyLFebwrEhId3tyb7AXo5Xryc';
                    register(data).then(res => {
                        if(res.code === 200){
                            tips('success', '注册成功，即将转去登录')
                            setTimeout(() => {
                                this.$router.push("/");
                            },1500)
                        }
                    }).catch(() => {
                        tips('error', '注册失败，请联系管理员')
                    })
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        toLogin() {
            this.$router.push("/");
        },
    },
    created() {},
};
</script>

<style scoped>
.background {
    width: 100%;
    height: 100%;
    background: url("../.././assets/background.jpg") no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top: 0px;
    left: 0px;
}
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #bed2f5;
    /*border: 1px solid #eaeaea;*/
    box-shadow: 0 0 25px #a7bbd4;
}

label.el-checkbox.remember {
    margin: 0px 0px 30px 0px;
}
.title {
    color: #ffffff;
}
.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
