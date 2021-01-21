<template>
  <div class="appoint-record">
    <el-table
        stripe
        :data="recordList"
        style="width: 100%">
        <template v-for="(item) in columns">
            <el-table-column
                v-if="item.prop !== 'status'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :sortable="item.sortable"
                :formatter="item.formatter"
                :width="item.width">
            </el-table-column>
            <el-table-column label="状态" v-else :key="item.prop">
                <template slot-scope="scope">
                    <span :style="{'color': scope.row.status === 3 ? '#67c23a' : scope.row.status === 2 ? '#e6a23c' : '#409eff'}">{{scope.row.status | formatStatus}}</span>
                </template>
            </el-table-column>
        </template>
        
        <el-table-column label="操作" :width="200">
            <template slot-scope="scope">
                <el-link type="primary" @click="cancel(scope.row)" :disabled="scope.row.status !== 0">取消预约</el-link>
            </template>
        </el-table-column>
    </el-table>
    <div class="footer">
        <div class="pagination">
            <el-pagination
                background
                :page-size="searchParams.pageSize"
                @current-change="handleCurrentChange"
                :current-page="searchParams.currentPage"
                layout="total, prev, pager, next, jumper"
                :total="parseInt(total)">
            </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import { getAllAppointRecord, cancelAppoint} from '@/api/appoint.js';
import { tips } from "@/common/js/optionTips";
import { formatDate } from '@/utils/filter';
export default {
    data(){
        return {
            recordList: [],
            columns: [
                {
                    prop: 'hospitalName',
                    label: '医院名称'
                },
                {
                    prop: 'specialName',
                    label: '科室名称'
                },
                {
                    prop: 'name',
                    label: '就诊人'
                },
                {
                    prop: 'outpatientName',
                    label: '门诊'
                },
                {
                    prop: 'doctorName',
                    label: '医生姓名'
                },
                {
                    prop: 'clinicName',
                    label: '门诊地址'
                },
                {
                    prop: 'day',
                    label: '门诊日期',
                    formatter: val => {
                        return formatDate(val.day)
                    }
                },
                {
                    prop: 'time',
                    label: '门诊时间',
                    formatter: val => {
                        return val.time === 1 ? '08:30~12:00' : '14:00~18:00'
                    }
                },
                {
                    prop: 'queueNum',
                    label: '排队号'
                },
                {
                    prop: 'status',
                    label: '状态',
                    formatter: val => {
                        switch(val.status){
                            case 0: 
                                return '未开始';
                                break;
                            case 1:
                                return '未按时就诊';
                                break;
                            case 2:
                                return '已取消';
                                break;
                            case 3:
                                return '已完成';
                                break;
                        }
                    }
                },
            ],
            searchParams: {
                pageSize: 10,
                currentPage: 1
            },
            total: 0
        }
    },
    filters: {
        formatStatus(val){
            switch(val){
                case 0: 
                    return '未开始';
                    break;
                case 1:
                    return '未按时就诊';
                    break;
                case 2:
                    return '已取消';
                    break;
                case 3:
                    return '已完成';
                    break;
            }
        }
    },
    created(){      
        this.getAllRecord();
    },
    methods: {
        getAllRecord(){
            const cardId = sessionStorage.getItem('cardId');
            const accountId = sessionStorage.getItem('accountID');
            if(cardId === ''){
                tips('error', '请先添加本人就诊卡');
                setTimeout(() => {
                    this.$router.push('/home')
                }, 2000)
                return;
            }
            getAllAppointRecord(cardId, accountId, this.searchParams.currentPage, this.searchParams.pageSize).then(res => {
                if(res.code === 200){
                    this.recordList = res.data.list;
                    this.total = res.data.total;
                }else{
                    tips('error', '获取预约记录失败');
                }
            }).catch(err => {
                tips('error', '获取预约记录失败');
            })
        },
        cancel(data){
            this.$confirm('确认取消本次预约吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancelAppoint(data.appointmentId).then(res => {
                    if(res.code === 200){
                        tips('success', '取消成功');
                        this.getAllRecord();
                    }else{
                        tips('error', '取消失败');
                    }
                })
            }).catch(() => {
                tips('error', '取消失败');
            });
        },
        handleCurrentChange(page){
            this.searchParams.currentPage = page;
            this.getAllRecord();
        },
    }
}
</script>

<style lang="scss">
.appoint-record {
    
}
</style>

<style lang="scss" scoped>
.appoint-record {
    .pagination {
        text-align: right;
        margin-top: 20px;
    }
}
</style>