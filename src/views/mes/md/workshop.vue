<template>
    <div style="padding: 20px;">
        <myInput
            :inputConfigs="inputConfigs"
            @searchInputData="searchWorkShopData"
            @clearSearchData="clearSearchData"
            ></myInput>

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
            </div>

        <myTable
            ref="mytable"
            :tableData="tableData"
            :tableSetting="tableSetting"
            :tableTotal = 'tableTotal'
            @updateSize = 'updateSize'
            @updateCurrentPage = 'updateCurrentPage'
            >
            <template #workshopCode="{scoped}">
                <el-button
                    link
                    type="primary"
                    size="small"
                    @click="lookWorkShopData(scoped.workshopId)"
                    >{{ scoped.workshopCode }}</el-button>
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
                        @click="editUnit(scoped.workshopId)">
                        修改</el-button>
                    <el-button 
                        link
                        size="small"
                        type="primary"
                        icon="Delete"
                        @click="deleteUnit(scoped)">
                        删除</el-button>
                </div>
            </template>
        </myTable>   
        <!-- 删除弹窗 -->
        <el-dialog
            width="400"
            v-model="delDialogVisible">
            <span>是否确认删除车间编号为"{{ workshopId }}"的数据项？</span>
            <template #footer>
            <div>
                <el-button @click="delDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </div>
            </template>
        </el-dialog>

        <!-- 编辑弹窗(新增、修改) -->
         <wsAddEdit
            :popwindowTitle="popwindowTitle"
            :popwindowStatus="popwindowStatus"
            v-model:popwindowStatus="popwindowStatus" 
            @emitParentUpdata="emitParentUpdata"
             :backShowData="backShowData"
            >
         </wsAddEdit>
        

    </div>
</template>
<script setup>
import wsAddEdit from '@/components/workShopAddEdit/wsAddEdit.vue';
import myInput from '@/components/MyInput/myInput.vue'
import myTable from '@/components/MyTable/myTable.vue'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {getWorkShopTableData,deleteWorkShopData,searchWorkShop,getWorkshopDataById} from '@/api/mainData/mainData.js'

const tableSetting = ref([
    {
        label:'车间编码',
        prop:'workshopCode',
        slotStatus:true
    },
    {
        label:'车间名称',
        prop:'workshopName'
    },
    {
        label:'面积',
        prop:'area'
    },
    {
        label:'负责人',
        prop:'charge'
    },
    {
        label:'是否启用',
        prop:'enableFlag',
        slotStatus:true
    },
    {
        label:'备注',
        prop:'remark'
    },
    {
        label:'操作',
        prop:'action',
        slotStatus:true
    }
])
const inputConfigs = ref([
    {
        label:'车间编码',
        prop:'workshopCode'
    },
    {
        label:'车间名称',
        prop:'workshopName'
    }
])
const mytable = ref(null)
// 表格数据
const tableData = ref([])

// 页码 条数
const params = ref({
    pageNum: 1,
    pageSize: 10
})
// 分页器相关
const tableTotal = ref(0)
const popwindowTitle = ref('');
const popwindowStatus = ref(false);
const backShowData = ref({})

// 车间id
const workshopId = ref('')

//  定义弹窗状态  删除弹窗
const delDialogVisible = ref(false)

// 定义要搜索的数据
const searchdata = ref({})

// 获取车间所有数据
const getAllWorkShopData = async()=>{
    // console.log(await getWorkShopTableData(params),'获取车间所有数据');
    try {
        let { code,msg,rows,total } = await getWorkShopTableData(params.value);
        if(code == 200){
            ElMessage.success('车间数据'+msg)
            tableData.value = rows;
            tableTotal.value = total;
        }else{
            ElMessage.error('车间数据'+msg)
        }
    } catch (error) {
        console.log(error,'error in vendor'); 
    }

}
getAllWorkShopData()


// 修改 
const editUnit=async(id)=>{
    console.log('要修改数据的id',id);
    popwindowTitle.value = '修改车间'
    popwindowStatus.value = true

    try {
        let {code,msg,data} = await getWorkshopDataById(id)
        if(code == 200){
            ElMessage.success('获取车间数据'+msg)
            backShowData.value = data
        }else{
            ElMessage.error('获取车间数据'+msg)
        }
    } catch (error) {
        console.log(error,'error');
        
    }
}
// 删除 弹窗
const deleteUnit=(data)=>{
    delDialogVisible.value = true;
    if(data.workshopId){
        workshopId.value = data.workshopId;
    }else{
        workshopId.value = data
    }
}
// 确认删除
const confirmDelete=async()=>{
    try {
        let {code,msg} = await deleteWorkShopData(workshopId.value)
        if(code == 200){
            ElMessage.success('数据项删除'+msg)
            delDialogVisible.value = false
            getAllWorkShopData()
        }else{
            ElMessage.error('数据项删除'+msg)
            delDialogVisible.value = false
        }
    } catch (error) {
        delDialogVisible.value = false
    }
}

// 搜索 车间数据  
const  searchWorkShopData =async(data)=>{
    searchdata.value = data
    // console.log(searchdata.value,'searchdata.value');

    // 调用请求
    try {
        // console.log(await searchClient(searchData.value),'搜索数据');
        let {total,rows,code,msg} = await searchWorkShop(searchdata.value)
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
// 重置  这是重置
const clearSearchData = ()=>{
    searchdata.value = {}
    getAllWorkShopData()
   
}

// 颜色按钮  新增 修改 删除
const addNew=()=>{
    popwindowTitle.value = '添加车间'
    popwindowStatus.value = true
}
// 修改
const editData=()=>{
    console.log(mytable.value.deleteArr,'mytable.value.deleteArr')
    editUnit((mytable.value.deleteArr).toString())
}

// 查看车间
const lookWorkShopData=async(id)=>{
    // console.log(id,'要查看的id');
    popwindowTitle.value = '查看'
    popwindowStatus.value = true
    try {
        let {code,msg,data} = await getWorkshopDataById(id)
        if(code == 200){
            ElMessage.success('获取车间数据'+msg)
            backShowData.value = data
        }else{
            ElMessage.error('获取车间数据'+msg)
        }
    } catch (error) {
        console.log(error,'error');
        
    }
}


const delAll=()=>{
    deleteUnit((mytable.value.deleteArr).toString())
}


// 分页器相关
// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    params.value.pageSize = size
    
    getAllWorkShopData()
}
// // 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    params.value.pageNum = page

    getAllWorkShopData()
}
// 刷新数据
const emitParentUpdata=()=>{
   getAllWorkShopData()
}
</script>
<style scoped>

</style>