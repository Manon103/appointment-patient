<template>
  <div class="background">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left"
             label-width="0px" class="demo-ruleForm login-container login-background">
      <h3 class="title">挂号预约系统</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm2.username" auto-complete="off"
                  placeholder="手机号" suffix-icon="el-icon-user-solid"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm2.password" auto-complete="off"
                  placeholder="密码" suffix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <div class="item">
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-link type="primary" style="margin: 0px 0px 30px 0px;" @click="toRegister">没有账户?去注册</el-link>
      </div>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit2" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getCookie, setCookie} from "@/utils/cookies";
  import {getToken} from "@/utils/auth";
  import {tips} from "@/common/js/optionTips";
  import { getUserInfo } from '@/api/login'

  export default {
    name: "login",
    data(){
      return{
        loading: false,
        ruleForm2: {
          username: '',
          password: ''
        },
        rules2: {
          username: [{ required: true, message: '请输入手机号',trigger: 'blur'}],
          password: [{required: true,message: '请输入密码',trigger: 'blur'}]
        },
        checked: false,
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      handleSubmit2(ev) {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.loading = true;

            // 实现登录
              this.$store.dispatch('Login', this.ruleForm2).then(() => {
              if (this.checked) {
                setCookie("username",this.ruleForm2.username,15);
                setCookie("password",this.ruleForm2.password,15);
              }
              getUserInfo().then(res => {
                if (res.code === 200) {
                  sessionStorage.setItem('basicInfo', JSON.stringify(res.data.basicInfo));
                  sessionStorage.setItem('username', res.data.basicInfo.name);
                  sessionStorage.setItem('accountID', res.data.account.id)
                }
                this.$router.push({path: this.redirect || '/home'});
                this.loading = false
              }).catch((err) => {
                tips('error', '获取医生信息失败')
              })
            }).catch(() => {
              this.loading = false;
              tips('error', '用户名或密码错误！')
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      toRegister(){
        this.$router.push('/register');
      }
    },
    created() {
      this.ruleForm2.username = getCookie('username');
      this.ruleForm2.password = getCookie('password');
      if(this.ruleForm2.username === undefined||this.ruleForm2.username==null||this.ruleForm2.username===''){
        this.ruleForm2.username = '';
      }
      if(this.ruleForm2.password === undefined||this.ruleForm2.password==null){
        this.ruleForm2.password = '';
      }
    }
  }
</script>

<style lang="scss">
  .background {
    .el-button--primary {
      background-color: #64a6da;
      border-color: #64a6da;
    }
  }
</style>

<style scoped>
  .background{
    width: 100%;
    height: 100%;
    background: url("../.././assets/back1.jpg") no-repeat center center;
    background-size: cover;
    position: fixed;
    top: 0px;
    left: 0px;
  }
  .login-container{
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #feffff;
    /*border: 1px solid #eaeaea;*/
    box-shadow: 0 0 25px #A7BBD4;
  }

  label.el-checkbox.remember {
    margin: 0px 0px 30px 0px;
  }
  .title{
    color: #34495e;
    margin-bottom: 20px;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
