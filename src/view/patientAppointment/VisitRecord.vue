<template>
    <div class="visit-record">
        <el-alert
            v-if="cardList.length === 0"
            title="提示"
            type="info"
            description="暂无就诊记录，请先添加就诊卡"
            show-icon
            :closable="false">
        </el-alert>
        <el-tabs v-else v-model="selectedCard"  @tab-click="handleClick">
            <el-tab-pane v-for="item in cardList" :key="item.id" :label="item.name" :name="item.id.toString()">
                <el-table
                    stripe
                    :data="recordList"
                    style="width: 100%">
                    <el-table-column v-for="(item) in columns"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :sortable="item.sortable"
                        :formatter="item.formatter"
                        :width="item.width">
                    </el-table-column>
                    <el-table-column label="病历" :width="200">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="showRecord(scope.row.appointmentId)">查看</el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            title="病历详情"
            :visible.sync="dialogVisible"
            width="30%">
            <el-alert
                v-if="!recordContent"
                title="提示"
                type="info"
                description="暂无病历内容"
                show-icon
                :closable="false">
            </el-alert>
            <el-input
                v-else
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 30}"
                placeholder="请输入内容"
                v-model="recordContent">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getUserCardInfo } from "@/api/login";
import { tips } from "@/common/js/optionTips";
import { getTreatRecord, getTreatRecordDetail } from '@/api/outCall.js'
export default {
    name: 'visitRecord',
    data() {
        return {
            selectedCard: '',
            cardList: [],
            recordList: [],
            columns: [
                {
                    prop: 'day',
                    label: '日期'
                },
                {
                    prop: 'hospitalName',
                    label: '医院'
                },
                {
                    prop: 'doctorName',
                    label: '医生'
                },
                {
                    prop: 'specialName',
                    label: '科室'
                },
                {
                    prop: 'outpatientName',
                    label: '门诊'
                },
                {
                    prop: 'name',
                    label: '患者'
                }
            ],
            dialogVisible: false,
            recordContent: ''
        }
    },
    created() {
        this.getCardInfo()
    },
    methods: {
        //根据账户ID获取就诊卡信息
        getCardInfo(){
          getUserCardInfo(sessionStorage.getItem('accountID')).then(res => {
            if(res.code === 200 && res.data.length > 0){
                this.cardList = res.data;
                this.selectedCard = this.cardList[0].id.toString();
                this.getRecordList();
            }else{
                tips('error', '获取就诊卡信息失败')
            }
          }).catch(() => {
            tips('error', '获取就诊卡信息失败')
          })
        },
        getRecordList(){
            getTreatRecord(this.selectedCard, 1, 10).then(res => {
                if (res.code === 200) {
                    this.recordList = res.data.list;
                }
            }).catch(() => {
                tips('error', '获取就诊记录失败')
            })
        },
        handleClick(){
            this.getRecordList();
        },
        showRecord(id){
            getTreatRecordDetail(id).then(res => {
                if(res.code === 200) {
                    this.dialogVisible = true;
                    this.recordContent = res.data.userCase ? res.data.userCase.content : '';
                }
            }).catch(() => {
                tips('error', '获取病历详情失败')
            })
        }
    },
}
</script>

<style lang="scss">
    .visit-record {

    }
</style>

<style lang="scss" scoped>
    .visit-record {
        
    }
</style>