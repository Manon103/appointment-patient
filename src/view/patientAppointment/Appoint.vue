<template>
  <div class="appoint">
    <div class="list" v-if="!doAppoint">
      <div class="line">
        <span class="prop">医院选择：</span>
        <el-select v-model="selectedHospital" placeholder="请选择" @change="getDepartmentList">
          <el-option
            v-for="item in hosList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span class="prop">科室门诊选择：</span>
        <el-cascader
          @change="getDoctorList"
          :props="defaultParams"
          :options="departmentList"
          v-model="selectedOptions"
          :clearable="true">
        </el-cascader>
        <span class="prop">日期选择：</span>
        <el-date-picker
          @change="validateDate"
          v-model="selectedDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" @click="getDoctorList">查询</el-button>
      </div>
      <el-alert
        v-if="selectedOptions.length === 0"
        title="提示"
        type="info"
        description="请选择科室门诊后查看医生排班信息"
        show-icon
        :closable="false">
      </el-alert>
      <el-alert
        v-if="doctorList.length === 0 && selectedOptions.length !== 0"
        title="提示"
        type="info"
        description="暂无医生排班信息"
        show-icon
        :closable="false">
      </el-alert>
      <div class="doctor-list">
        <div class="list-item" v-for="item in doctorList" :key="item.outInfo.doctorId">
          <el-card>
            <div class="content">
              <img src="@/assets/doctor.png" class="image">
              <div class="info">
                <div class="name"><span>{{item.outInfo.doctorName}}</span><el-link type="primary" @click="showDoctorDetail(item)">预约</el-link></div>
                <div class="depart">{{item.outInfo.specialName}} / {{item.outInfo.outpatientName}}<span class="title">{{item.doctorInfo.jobTitle}}</span></div>
                <p class="description">简介： {{item.doctorInfo.specialty}}</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="detail" v-else>
      <el-link class="back" type="primary" @click="doAppoint = false"><i class="el-icon-back"></i>返回医生列表</el-link>
      <div class="content">
          <img src="@/assets/doctor.png" class="image">
          <div class="info">
            <div class="name"><span>{{selectedDoctor.outInfo.doctorName}}</span></div>
            <div class="depart">{{selectedDoctor.outInfo.specialName}} / {{selectedDoctor.outInfo.outpatientName}}<span class="title">{{selectedDoctor.doctorInfo.jobTitle}}</span></div>
            <p class="description">简介： {{selectedDoctor.doctorInfo.specialty}}</p>
          </div>
        </div>
        <el-divider content-position="left">预约选项</el-divider>
        <div class="options">
          <el-radio-group v-model="selectedTime" v-if="visitPlan.length > 1">
            <el-radio-button :label="1">上午</el-radio-button>
            <el-radio-button :label="2">下午</el-radio-button>
          </el-radio-group>
          <div class="option-box" v-if="selectedTime === 1">
            <el-card v-for="(item, i) in timeList[0].list" :key="item.start">
              <div class="card-content">
                <span>{{item.start}}-{{item.end}}</span>
                <div class="operate">
                  <span class="count">{{visitPlan[0].residues[i] > 0 ? `余号：${visitPlan[0].residues[i]}` : '已约满'}}</span>
                  <el-link type="primary" v-if="visitPlan[0].residues[i] > 0" @click="confirmAppoint(i)">预约</el-link>
                </div>
              </div>
            </el-card>
          </div>
          <div class="option-box" v-else>
            <el-card v-for="(item, i) in timeList[1].list" :key="item.start">
              <div class="card-content">
                <span>
                  {{item.start}}-{{item.end}}
                </span>
                <div class="operate">
                  <span class="count">{{(visitPlan.length > 1 ? visitPlan[1].residues[i] > 0 : visitPlan[0].residues[i] > 0 ) ? `余号：${visitPlan[0].residues[i]}` : '已约满'}}</span>
                  <el-link type="primary" v-if="visitPlan[0].residues[i] > 0" @click="confirmAppoint(i)">预约</el-link>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        </span>
      </div>
      <el-dialog
        title="确认号源信息"
        :visible.sync="displayConfirmDialog"
        class="confirm-dialog"
        width="40%">
        <el-divider content-position="left">就诊信息详情</el-divider>
        <div class="line">
          <span class="label">挂号诊疗费：</span>
          <span class="prop">10元</span>
        </div>
        <div class="line">
          <span class="label">科室：</span>
          <span class="prop">{{`${selectedDoctor.outInfo.specialName}  ${selectedDoctor.outInfo.outpatientName}${selectedDoctor.outInfo.clinicName}`}}</span>
        </div>
        <div class="line">
          <span class="label">医生：</span>
          <span class="prop">{{selectedDoctor.outInfo.doctorName}}</span>
        </div>
        <div class="line">
          <span class="label">就诊时间：</span>
          <span class="prop">{{`${selectedDate} ${selectedPeriod}`}}</span>
        </div>
        <el-divider content-position="left">选择就诊人</el-divider>
        <el-card class="card-item"  shadow="never">
          <el-radio-group v-model="selectedPatient">
            <el-radio v-for="item in cardList" :key="item.id" :label="item.id">
              <span>{{item.name}}</span>
              <span>就诊卡号： {{item.id}}</span>
            </el-radio>
          </el-radio-group>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="displayConfirmDialog = false">取 消</el-button>
          <el-button type="primary" @click="toAppoint()">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { getHospitalInfo } from '@/api/hospital';
import { tips } from "@/common/js/optionTips";
import { getDepartmentHospital } from '@/api/department';
import { getOutpatientByHospital } from '@/api/outpatient';
import { getOutCall } from '@/api/outCall';
import { getDoctorInfoById, getHospitalVisitPlan } from '@/api/doctor.js';
import { getUserCardInfo } from "@/api/login";
import { addAppoint } from '@/api/appoint';
export default {
  data(){
    return {
      hosList: [],
      selectedHospital: '',
      departmentList: [],
      selectedOptions: [],
      defaultParams: {
          label: 'name',
          value: 'id',
          children: 'children'
      },
      selectedDate: null,
      doctorList: [],
      selectedDoctor: {
        outInfo: {},
        doctorInfo: {}
      },
      timeList: [
        {
          time: 1,
          list: [
            {
              start: '08:30',
              end: '09:00'
            }, {
              start:' 09:00',
              end: '09:30'
            }, {
              start: '09:30',
              end: '10:00'
            }, {
              start: '10:00',
              end: '10:30'
            }, {
              start: '10:30',
              end: '11:00'
            }, {
              start: '11:00',
              end: '11:30'
            }
          ]
        }, 
        {
          time: 2,
          list: [
            {
              start: '14:00',
              end: '14:30'
            }, {
              start: '14:30',
              end: '15:00'
            }, {
              start: '15:00',
              end: '15:30'
            }, {
              start: '15:30',
              end: '16:00'
            }, {
              start: '16:00',
              end: '16:30'
            }, {
              start: '16:30',
              end: '17:00'
            }
          ]
        }
      ],
      visitPlan: [{time: '', residues: []}],
      selectedTime: 1,
      doAppoint: false,
      displayConfirmDialog: false,
      selectedPeriod: '',
      selectedPeriodIndex: 0,
      selectedPatient: '',
      cardList: []
    }
  },
  created(){
    // 格式化日期
    this.selectedDate = this.formatDate();
    this.getAllHospital();
  },
  methods: {
    getAllHospital(){
      getHospitalInfo(1, 50, '').then(res => {
        if(res.code === 200){
          this.hosList = res.data.list;
          this.selectedHospital = this.hosList[0].id;
          this.getDepartmentList();
        }else{
          tips('error', '获取医院列表失败')
        }
      }).catch(() => {
        tips('error', '获取医院列表失败')
      })
    },
    getDepartmentList(){
      // 格式化科室门诊数据
      getDepartmentHospital(this.selectedHospital, 1, 50).then(res => {
        if(res.code === 200) {
          res.data.list.forEach(item => {
            let children = [];
            getOutpatientByHospital(this.selectedHospital, item.id, 1, 50).then(res => {
              if(res.code === 200) {
                if(res.data.list.length !== 0){
                  children = res.data.list;
                  const _item = {
                    id: item.id,
                    name: item.name,
                    children: children
                  }
                  this.departmentList.push(_item)
                }
              }
            }).catch(() => {
              tips('error', '获取医生列表失败')
            })
          });
        }else{
          tips('error', '获取科室列表失败')
        }
      }).catch((err) => {
        console.log(err)
        
      })
    },
    // 获取门诊医生列表
    getDoctorList(){
      if(this.selectedOptions.length === 0){
        return;
      }
      this.doctorList = [];
      getOutCall(this.selectedDate, 1, 50, this.selectedHospital, this.selectedOptions[0], this.selectedOptions[1]).then(res =>{
        if(res.code === 200) {
          // 医生数组去重
          let data = res.data.list;
          let result = [];
          data.forEach(item => {
            let ids = [...new Set(result.map(_item => {
              return _item.doctorId
            }))]
            if(!ids.includes(item.doctorId)){
              result.push(item)
            }
          })
          result.forEach(item => {
            getDoctorInfoById(item.doctorId).then(_res => {
              if(_res.code === 200) {
                this.doctorList.push({
                  outInfo: item,
                  doctorInfo: _res.data
                })
              }
            }).catch(() => {
              tips('error', '获取出诊列表信息失败')
            })
          })
        }
      }).catch((err) => {
        tips('error', '获取出诊列表信息失败')
      })
    },
    showDoctorDetail(data){
      this.selectedDoctor = data;
      this.getDoctorVisitPlan();
    },
    // 获取医生的该天的出诊计划
    getDoctorVisitPlan: function() {
      getHospitalVisitPlan(this.selectedHospital, this.selectedDoctor.doctorInfo.id, this.selectedDate).then(res => {
        if(res.code === 200) {
          if(res.data.length > 1){
            const time1 = res.data.find(item => {
              return item.time === 1
            })
            const time2 = res.data.find(item => {
              return item.time === 2
            })
            this.visitPlan[0] = time1;
            this.visitPlan[1] = time2;
          }else{
            this.visitPlan = res.data;
          }
          this.doAppoint = true;
          this.selectedTime = this.visitPlan.length > 1 ? 1 : this.visitPlan[0].time;
        }
      }).catch(() => {
        tips('error', '获取医生排班信息失败')
      })
    },
    validateDate(){
      if(new Date(this.selectedDate) < new Date()){
        // tips('warning', '请选择有效日期')
        // this.selectedDate = this.formatDate();
      }
    },
    formatDate(){
      // 格式化日期
      let month = new Date().getMonth() + 1;
      month = month < 10 ? '0' + month : '';
      return new Date().getFullYear() + '-' + month + '-'+ (new Date().getDate() + 1);
    },
    confirmAppoint(index){
      this.selectedPatient = '';
      this.getCardInfo();
      this.selectedPeriodIndex = index;
      this.selectedPeriod = this.timeList[this.selectedTime-1]['list'][index].start + '-' + this.timeList[this.selectedTime-1]['list'][index].end;
    },
    //根据账户ID获取就诊卡信息
    getCardInfo(){
      getUserCardInfo(sessionStorage.getItem('accountID')).then(res => {
        if(res.code === 200){
          this.cardList = res.data;
          this.displayConfirmDialog = true;
        }
      }).catch(() => {
        tips('error', '获取就诊卡信息失败')
      })
    },
    // 预约
    toAppoint(){
      // 预约的医生的排班id
      let time;
      if(this.visitPlan.length > 1){
        time = this.visitPlan[this.selectedTime-1].id
      }else{
        time = this.visitPlan[0].id
      }
      // 预约的时间段
      let timePeriod;
      if(this.selectedTime === 1) {
        timePeriod = this.selectedPeriodIndex + 1
      } else {
        timePeriod = this.selectedPeriodIndex + 7
      }
      addAppoint({
        accountId: sessionStorage.getItem('accountID'),
        cardId: this.selectedPatient,
        planId: time,
        timePeriod: timePeriod
      }).then(res => {
        if(!res.data){
          tips('success', '预约成功')
          this.displayConfirmDialog = false;
          this.doAppoint = false;
        }else{
          tips('error', res.data)
        }
      }).catch((err) =>{
        tips('error', '预约失败')
      })
    }
  }
}
</script>

<style lang="scss">
.appoint {
  .el-cascader-panel {
    margin-top: 20px;
  }
  .el-alert {
    padding: 30px 16px;
  }
  .options {
    .el-card {
      margin: 5px 0;
      width: 48%;
    }
  }
  .confirm-dialog {
    .line {
      margin-bottom: 15px !important;
    }
    .el-divider__text {
      color: #6594ce;
    }
    .el-card__body {
      padding: 0;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-radio {
    display: flex;
    width: 100%;
    padding: 15px;
    &:not(:last-child){
      border-bottom: 1px solid #ebeef5;
    }
  }
  .el-radio-group {
    display: block;
  }
  .el-radio__label {
    width: 90%;
    display: flex;
    justify-content: space-between;
  }
}
</style>

<style lang="scss" scoped>
.appoint {
  text-align: left;
  .line {
    margin-bottom: 30px;
    .prop:not(:first-child){
      margin-left: 10px;
    }
    span.label {
      display: inline-block;
      width: 120px;
      margin-left: 40px;
    }
  }
  .doctor-list {
    display: flex;
    flex-wrap: wrap;
    .list-item {
      width: 32%;
      margin-bottom: 20px;
      margin-right: 1%;
      .description {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
  .back {
    margin-bottom: 20px;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    .info {
      width: calc(100% - 90px);
      & div:not(:last-child) {
        margin-bottom: 15px;
      }
    }
    .image {
      width: 90px;
      margin-right: 10px;
    }
    .name {
      color: #34495e;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .depart {
      font-size: 14px;
      color: #4270a8;
    }
    .title {
      color: #526476;
      margin-left: 10px;
    }
    .description {
      font-size: 12px;
      color: #526476;
    }
  }
  .option-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .operate {
        display: flex;
        align-items: center;
        .count {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>