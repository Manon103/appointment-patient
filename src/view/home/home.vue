<!--首页一进来用于显示用户的个人信息和更改密码-->

<template>
  <div>
    <el-card class="out-box">
      <div class="title">用户信息</div>
      <el-button type="primary" class="update-password" @click="dialogFormVisible = true">修改密码</el-button>
<!--      任何账户都有的账户名字的信息-->
      <el-form :model="infoForm"  class="input-box" >
        <el-form-item label="手机号:" label-width="100px;" >
          <span class="text">{{ accountIdentify }}</span>
        </el-form-item>
        <el-form-item label="用户名:" label-width="100px;" >
          <span class="text">{{ username }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="out-box">
      <div class="title">就诊卡信息</div>
      <div class="empty-msg" v-if="cardList.length===0">暂无就诊卡信息</div>
      <el-button type="primary" class="update-password" @click="addCard" style="top: 10px">添加就诊卡</el-button>
      <el-card v-for="item in cardList" :key="item.id" class="card-item"  shadow="never">
        <img src="@/assets/tag.svg" alt="" class="tag">
        <div class="link" style="text-align: right"> 
          <el-link type="primary" @click="editCard(item)">修改</el-link>
          &nbsp;
          &nbsp;
          <el-link type="danger" @click="deleteCard(item)">刪除</el-link>
        </div>
        <div class="header-img"><img src="@/assets/header.png" alt="" style="width: 50px"></div>
        <div class="line">
          <span>就诊人：{{item.name}}</span>
          <span>{{item.identificationNumber}}</span>
        </div>
      </el-card>
    </el-card>
    <!--     点击修改密码的按钮跳出来的弹出框-->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="35%"
               @close="cancelModal" v-loading="isLoading">
      <el-form ref="passwordForm" :rules="rules" :model="passwordForm">
        <el-form-item label="旧密码：" label-width="120px" prop="password">
        <el-input v-model="passwordForm.password" style="width: 90%;" autofocus type="password"></el-input>
      </el-form-item>
        <el-form-item label="新密码：" label-width="120px" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" style="width: 90%;" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" label-width="120px" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" style="width: 90%;" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModal">取 消</el-button>
        <el-button type="primary" @click="updatePassword('passwordForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTile" :visible.sync="displayAddDialog" width="35%">
      <el-form :model="cardForm" :rules="cardRules" ref="cardForm" label-width="150px" class="demo-ruleForm" :hide-required-asterisk="true">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="cardForm.name" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="证件类型：">
          <el-radio disabled v-model="certificate" label="1">身份证</el-radio>
        </el-form-item>
        <el-form-item label="证件号码：" prop="identificationNumber">
          <el-input v-model="cardForm.identificationNumber" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="cardForm.phone" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="与本人关系：" prop="type">
          <el-select v-model="cardForm.type">
            <el-option v-for="item in relationList" :key="item.prop" :label="item.label" :value="item.prop"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期：" prop="birthDate">
          <el-date-picker
            v-model="cardForm.birthDate"
            type="date"
            placeholder="选择日期"
           >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-radio-group v-model="cardForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="text-align: right">
          <el-button @click="displayAddDialog=false">取 消</el-button>
          <el-button type="primary" @click="submitAddForm('cardForm')" v-if="isCreateCard">添 加</el-button>
          <el-button type="primary" @click="submitAddForm('cardForm')" v-else>修 改</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {getCookie} from "@/utils/cookies";
  import {tips} from "@/common/js/optionTips";
  import {updatePassword, getUserCardInfo, addCard, updateCardInfo, deleteCardInfo } from "@/api/login";
  import SHA256 from 'js-sha256';
  import {
    inputCheck,
    changeDateByIdentify,
    checkGender
	} from '@/common/js/inputCheck.js';

  export default {
        name: "home",
      data() {
          var validateIdentify = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入身份证号'));
            } else {
              const res = inputCheck('身份证号码', 'identify', value);
              if(res!=='ok'){
                callback(new Error(res));
              }
              callback();
            }
          };
          var validatePhone = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入手机号'));
            } else {
              const res = inputCheck('电话号码', 'phone', value);
              if(res!=='ok'){
                callback(new Error(res));
              }
              callback();
            }
          };
          return {
            // 只用于医生的infoForm
            infoForm: {},
            accountIdentify: '', // 用于判断是不是系统管理员
            // 弹出框
            dialogFormVisible: false,
            passwordForm: {
              password: '',
              newPassword: '',
              confirmPassword: ''
            },
            rules: {
              password: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
              newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
              confirmPassword: [{required: true, message: '请再次确认密码', trigger: 'blur'}]
            },
            isLoading: false,
            username: '',
            cardList: [],
            displayAddDialog: false,
            cardForm: {
              type: 0,
              name: '',
              identificationNumber: '',
              gender: 1,
              birthDate: '',
              phone: ''
            },
            relationList: [
              {
                label: '本人',
                prop: 0
              },
              {
                label: '父母',
                prop: 1
              },
              {
                label: '兄弟/姐妹',
                prop: 2
              },
              {
                label: '伴侣',
                prop: 3
              },
              {
                label: '子女',
                prop: 4
              },
              {
                label: '同事/朋友',
                prop: 5
              },
              {
                label: '其他',
                prop: 6
              },
            ],
            cardRules: {
                type: [
                  { required: true, message: '请选择与本人的关系', trigger: 'blur' }
                ],
                name: [
                  { required: true, message: '请输入患者姓名', trigger: 'blur' }
                ],
                identificationNumber: [
                  { validator: validateIdentify, trigger: 'blur' }
                ],
                birthDate: [
                  { required: true, message: '请选择出生日期', trigger: 'blur' }
                ],
                phone: [
                  { validator: validatePhone, trigger: 'blur' }
                ],
            },
            certificate: '1',
            isCreateCard: true,
            dialogTile: '添加就诊卡'
          }
      },
      methods: {
        // 点击关闭取消模态框
        cancelModal: function (e) {
          this.dialogFormVisible = false;
          this.passwordForm.password = '';
          this.passwordForm.newPassword = '';
          this.passwordForm.confirmPassword = '';
          this.$nextTick(() => {
            this.$refs['passwordForm'].clearValidate()
          })
        },
        // 点击确认修改
        updatePassword: function (formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.passwordForm.newPassword === this.passwordForm.confirmPassword) {
                this.isLoading = true;
                updatePassword({
                  accountId: sessionStorage.getItem('accountID'),
                  newPassword: SHA256(this.passwordForm.newPassword),
                  password: SHA256(this.passwordForm.password)
                }).then(res => {
                  if (res.code === 200) {
                    this.isLoading = false;
                    tips('success', '修改成功');
                    this.dialogFormVisible = false;
                  } else if (res.code === 404) {
                    this.isLoading = false;
                    tips('error', '原密码错误')
                  }
                }).catch(() => {
                  this.isLoading = false;
                  tips('error', '更新密码失败')
                })
              } else {
                this.$message.error('新密码两次输入不一致');
              }
            } else {
              return false;
            }
          });
        },
        //根据账户ID获取就诊卡信息
        getCardInfo(){
          getUserCardInfo(sessionStorage.getItem('accountID')).then(res => {
            this.cardList = res.data;
            if(this.cardList.length > 0){
              const card = this.cardList.find(item => {
                return item.type === 0
              });
              sessionStorage.setItem('cardId', card ? card.id : '');
            }
          }).catch(() => {
            tips('error', '获取就诊卡信息失败')
          })
        },
        addCard(){
          this.dialogTile = '添加就诊卡';
          this.isCreateCard = true;
          this.displayAddDialog = true;
          this.$refs['cardForm'] && this.$refs['cardForm'].resetFields(); // 每次打开弹窗时清空form表单
        },
        submitAddForm(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              if(this.isCreateCard){
                addCard(sessionStorage.getItem('accountID'), this.cardForm).then(res => {
                  if(res.code === 200){
                    tips('success', '添加成功')
                    this.displayAddDialog = false;
                    this.getCardInfo();
                  }else{
                    tips('error', '添加失败')
                  }
                }).catch(() => {
                  tips('error', '添加失败')
                })
              }else{
                updateCardInfo(this.cardForm.relationId, this.cardForm).then(res => {
                  if(res.code === 200){
                    tips('success', '修改成功')
                    this.displayAddDialog = false;
                    this.getCardInfo();
                  }else{
                    tips('error', '修改失败')
                  }
                }).catch(() => {
                  tips('error', '修改失败')
                })
              }
            }
          })
        },
        // 修改就诊卡信息
        editCard(data){
          this.dialogTile = '修改就诊卡';
          this.displayAddDialog = true;
          this.isCreateCard = false;
          this.$nextTick(() => {
            this.cardForm = {...data};    // 为form表单赋值
          })
        },
        deleteCard(data){
          this.$confirm('确认删除该就诊卡吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              deleteCardInfo(data.relationId).then(res => {
                if (res.code === 200) {
                  tips('success', '删除成功')
                  this.getCardInfo();
                }
              }).catch(() => {
                tips('error', '删除失败')
              })
            }).catch(() => {
            });
        }
      },
      created() {
          // 初始化时获取用户信息和就诊卡信息
          this.accountIdentify = getCookie('username');
          this.username = sessionStorage.getItem('username');
          this.getCardInfo();
      }
    }
</script>

<style lang="scss">
  .demo-ruleForm {
    text-align: left;
  }
  .el-dialog__header {
    border-bottom: 1px solid #e8e8e8;
  }
  .out-box {
    .el-card {
      font-family: PingFangSC-Regular, PingFang SC;
      color: #34495E;
      font-size: 14px;
      border: 1px solid #a0b0c3;
      .line {
        padding: 10px 20%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  
</style>

<style lang="scss" scoped>
  @import "../../common/scss/common.scss";
  .out-box{
    width: 80%;
    height: auto;
    margin-left: 10%;
    position: relative;
    margin-bottom: 20px;
    .input-box{
      width: 60%;
      margin: 0 auto;
      text-align: left;
      margin-left: 5%;
      .text{
        width: 40%;
        height: auto;
        margin-left: 20px;
        @include font-style(16px, $major-blue-color);
      }
    }
    .title {
      font-size: 16px;
      font-weight: 500;
    }
    .empty-msg {
      text-align: center;
      font-size: 14px;
      color: #8e8b8b;
      margin-top: 20px;
    }
  }
  .form-class{
    width: 100%;
    display: flex;
    flex-direction: row;
    .brief-box{
      @include width-margin(50%,auto);
      @include flex-direction(column);
      text-align: center;
      margin-left: 5%;
      .title{
        width: 100%;
        height: 40px;
        line-height: 40px;
        @include font-style(16px, #000000);
      }
      .brief{
        @include width-margin(90%, auto);
        margin-left: 5%;
      }
    }
  }
  .update-password{
    width: 20%;
    position: absolute;
    top: 40px;
    right: 20px;
  }

  .card-item {
    margin-top: 20px;
    position: relative;
    .tag {
      position: absolute;
      width: 30px;
      left: -1px;
      top: -1px;
    }
   }
</style>
