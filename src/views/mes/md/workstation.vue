<template>
    <div style="padding:20px">
        <myInput
            :inputConfigs="inputConfigs"
            @searchInputData="searchWorkstationData"
             @clearSearchData="clearSearchData"
            >
            <template #workshopId>
                <el-select v-model="searchWorkstation.workshopId" placeholder="Select" style="width: 240px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                </el-select>
            </template>

            <template #processId>
                <el-select v-model="searchWorkstation.processId" placeholder="Select" style="width: 240px">
                    <el-option
                      v-for="item in processOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                </el-select>
            </template>
        </myInput>

        <div class="color-button">
                <el-button type="primary" 
                           icon="Plus" 
                           plain
                           @click="addNew"
                           >新增</el-button>
                <el-button type="success" 
                           icon="EditPen" 
                           plain
                           :disabled="mytable?.deleteArr.length == 1 ?false:true"
                           @click="editData()"
                           >修改</el-button>
                <el-button type="danger" 
                           icon="Delete" 
                           plain 
                           @click="delAll()"
                           :disabled="mytable?.deleteArr.length == 0 ? true:false"
                           >删除</el-button>
                <el-button type="warning" icon="Download" plain>导出</el-button>
            </div>

        <myTable
            ref="mytable"
            :tableData="tableData"
            :tableSetting="tableSetting"
            :tableTotal = 'tableTotal'
            @updateSize = 'updateSize'
            @updateCurrentPage = 'updateCurrentPage'
        >
            <template #workstationCode="{scoped}">
                <el-button
                    type="primary"
                    link
                    @click="lookClientDetail(scoped.workstationId)"
                    >{{scoped.workstationCode}}</el-button>
            </template>
            <template #processName="{scoped}">
                {{ scoped.processName }}
            </template>
            <!-- 是否启用 -->
            <template #enableFlag="{scoped}">
                <el-tag :type="scoped.enableFlag == 'Y'? 'primary':'danger' ">
                    {{ scoped.enableFlag == "Y"?'是':'否' }}
                </el-tag>
            </template>
            <!-- 操作 -->
            <template #action="{scoped}">
                <div>
                    <el-button 
                        link
                        size="small"
                        type="primary"
                        icon="EditPen"
                        @click="editUnit(scoped.workstationId)">
                        修改</el-button>
                    <el-button 
                        link
                        size="small"
                        type="primary"
                        icon="Delete"
                        @click="deleteUnit(scoped)">
                        删除</el-button>
                    <el-button 
                        type="primary" 
                        link
                        size="small"
                        icon="Printer"
                        >标签打印</el-button>
                </div>
            </template>
        </myTable>

        <el-dialog
            width="400"
            v-model="delDialogVisible">
            <span>是否确认删除工作站为"{{ workstationId }}"的数据项？</span>
            <template #footer>
            <div>
                <el-button @click="delDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </div>
            </template>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <workstationEditAdd
            :popwindowTitle="popwindowTitle"
            :popwindowStatus="popwindowStatus"
            v-model:popwindowStatus="popwindowStatus"   
            @emitWorkStationData="emitWorkStationData"
            :backShowData="backShowData"
            :editWorkstationId="editWorkstationId"
            ></workstationEditAdd>
    </div>
</template>
<script setup>
import { getWorkshopData,getProcessData,getWorkstationTableData,deleteWorkStation,backShowEditWorkStationData } from '@/api/mainData/mainData.js'
import myInput from '@/components/MyInput/myInput.vue'
import myTable from '@/components/MyTable/myTable.vue'
import workstationEditAdd from '@/components/workstationEditAdd/workstationEditAdd.vue';
import {  ElMessage } from 'element-plus';
import { ref } from 'vue';


const mytable = ref(null)
//  定义弹窗状态  删除弹窗
const delDialogVisible = ref(false)
const inputConfigs = ref([
    {
        label:'工作站编码',
        prop:'workstationCode'
    },
    {
        label:'工作站名称',
        prop:'workstationName'
    },
    {
        label:'所在车间名称',
        prop:'workshopId',
        slotStatus:true
    },
    {
        label:'所属工序',
        prop:'processId',
        slotStatus:true
    }
])
const tableSetting = ref([
    {
        label:'工作站编号',
        prop:'workstationCode',
        slotStatus: true
    },
    {
        label:'工作站名称',
        prop:'workstationName'
    },
    {
        label:'工作站地点',
        prop:'workstationAddress'
    },
    {
        label:'所属工序',
        prop:'processName',
        slotStatus: true
    },
    {
        label:'是否启用',
        prop:'enableFlag',
        slotStatus: true
    },
    {
        label:'备注',
        prop:'remark'
    },
    {
        label:'操作',
        prop:'action',
        slotStatus: true
    }
])
const tableData = ref([])
// 工作站名称workstationName
// const workstationName = ref('')
// 要删除的id
const workstationId = ref('')
// 要修改数据的id  
const editWorkstationId = ref('')
// 分页器相关
const tableTotal = ref(0)
// 页码 条数
const params = ref({
    pageNum: 1,
    pageSize: 10
})
const popwindowTitle = ref('');
const popwindowStatus = ref(false);
const backShowData = ref({})


// 搜索框数据
const searchWorkstation = ref({
    workstationCode: '',
    workstationName: '',
    workshopId: '',
    processId: '',
})

// 定义所在车间数据
const options = ref([])
// 定义所属工序数据
const processOptions = ref([])


// 获取所在车间名称数据
const getWorkshopOptions = async() => {
    try {
        let {code,data,msg} = await getWorkshopData();
        if (code === 200) {
            ElMessage.success('所在车间名称数据'+msg)
            options.value = data.map(item => ({
                value: item.workshopId,
                label: item.workshopName
            }))
        }else{
            ElMessage.error('所在车间名称数据'+msg)
        }
    } catch (error) {
        console.log(error,'error in getWorkshopOptions()');
        
    }
}
// 获取所属工序的数据
const getProcessOptions = async()=>{
    // console.log(await getProcessData());
    try {
        let {code,data,msg} = await getProcessData();
        if(code == 200){
            ElMessage.success('所属工序数据'+msg)
            processOptions.value = data.map(item=>{
                return{
                    value:item.processId,
                    label:item.processName
                }
            })
        }
    } catch (error) {
        
    }
    
}
getWorkshopOptions()
getProcessOptions()


// 搜索数据  searchWorkstationData
const searchWorkstationData=async(data)=>{
    // console.log(data,'searchWorkstationData');

    searchWorkstation.value.workstationCode = data.workstationCode
    searchWorkstation.value.workstationName = data.workstationName
    console.log(searchWorkstation.value,'searchWorkstationData');
    // 调用搜索请求
   try {
        let {total,rows,code,msg} = await getWorkstationTableData(searchWorkstation.value)
        if(code == 200){
            // console.log(rows,'rows');
            ElMessage.success('搜索数据'+msg)
            tableTotal.value = total
            tableData.value = rows   
        }else{
            ElMessage.error('搜索数据'+msg)
        }
    } catch (error) {
        console.log(error,'error');   
    }
}
// 重置
const clearSearchData = ()=>{
    searchWorkstation.value = {
        workstationCode: '',
        workstationName: '',
        workshopId: '',
        processId: '',
    }
    getWorkstationTableList()
}

// 获取工作站 table数据  getWorkstationTableData
const getWorkstationTableList=async()=>{
    // console.log(await getWorkstationTableData(params.value));
    try {
        let {code,msg,rows,total} = await getWorkstationTableData(params.value);
        if(code == 200){
            ElMessage.success('工作站数据'+msg)
            tableData.value = rows
            tableTotal.value = total
        }else{
            ElMessage.error('工作站数据'+msg)
        }
    } catch (error) {
        console.log(error,'error in getWorkstationTableList()' );
        
    }
}
getWorkstationTableList()


// 查看 某条数据
const lookClientDetail=(id)=>{
    console.log(id,'lookworkStationDetail');
}

// 单条删除  弹窗显示
const deleteUnit = (data)=>{
    delDialogVisible.value = true;
    if( data.workstationId){
        // workstationName.value = data.workstationName;
        workstationId.value = data.workstationId;
        // console.log(workshopId.value,'workshopId.value');
    }else{
        workstationId.value = data
    }
}
// 确认删除  
const confirmDelete = async()=>{    
    try {
        let {code,msg} = await deleteWorkStation(workstationId.value)
        if(code == 200){
            ElMessage.success('数据项删除'+msg)
            delDialogVisible.value = false
            getWorkstationTableList()
        }else{
            ElMessage.error('数据项删除'+msg)
            delDialogVisible.value = false
        }
    } catch (error) {
        delDialogVisible.value = false
    }
}
// 操作：修改
const editUnit=async(id)=>{
    console.log(id,'editUnit');
    editWorkstationId.value = id
    // console.log(editWorkstationId.value,'editWorkstationId');
    
    popwindowTitle.value = '修改工作站'
    popwindowStatus.value = true
   
    try {
        let {code,msg,data} = await backShowEditWorkStationData(id)
        if(code == 200){
            ElMessage.success('获取工作站数据'+msg)
            backShowData.value = data
        }else{
            ElMessage.error('获取工作站数据'+msg)
        }
    } catch (error) {
        console.log(error,'error');
        
    }
}

// 颜色按钮 新增  修改  删除
const delAll=()=>{
    deleteUnit((mytable.value.deleteArr).toString()) 
}
const addNew=()=>{
    // console.log('新增'); 
    popwindowTitle.value = '添加工作站'
    popwindowStatus.value = true
}

const editData=()=>{
    // console.log(mytable.value.deleteArr,'mytable.value.deleteArr')
    // editUnit((mytable.value.deleteArr).toString())
}

// 分页器相关
// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    params.value.pageSize = size
    
   getWorkstationTableList()
}
// 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    params.value.pageNum = page

   getWorkstationTableList()
}
// 刷新数据
const emitWorkStationData=()=>{
    getWorkstationTableList()
}

</script>
<style scoped>

</style>