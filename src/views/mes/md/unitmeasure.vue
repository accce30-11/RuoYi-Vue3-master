<template>
    <div class="container">
        <myInput
            :inputConfigs="inputConfigs"
            @searchInputData="getSearchUnitData"
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
                           @click='editUnitById'
                            :disabled="mytable?.deleteArr.length == 1 ?false:true"
                           >修改</el-button>
                <el-button type="danger" 
                           icon="Delete" 
                           plain 
                           @click="delAll"
                           :disabled="mytable?.deleteArr.length == 0 ? true:false"
                           >删除</el-button>
                            <!--  -->
                <el-button type="warning" icon="Download" plain>导出</el-button>
            </div>

        <myTable
            ref="mytable" 
            :tableSetting="tableSetting"
            :tableData="tableData"
            :tableTotal="tableTotal"
            @updateSize="updateSize"   
            @updateCurrentPage="updateCurrentPage"        
        >
        <!-- 是否显示主单位 -->
         <template #primaryFlag='{scoped}'>
             <el-tag :type="scoped.primaryFlag === 'Y' ? 'primary' :'danger' ">{{ scoped.primaryFlag ==='Y'?'是':'否' }}</el-tag>
         </template>

         <!-- 是否启用 -->
          <template #enableFlag="{scoped}">
                <el-tag :type="scoped.enableFlag === 'Y' ? 'primary' :'danger' ">{{ scoped.enableFlag ==='Y'?'是':'否' }}</el-tag>
          </template>

        <!-- 操作 -->
         <template #unitAction="{scoped}">
                <div>
                    <el-button 
                        link
                        size="small"
                        type="primary"
                        icon="EditPen"
                        @click="editUnit(scoped.measureId)">
                        修改</el-button>
                    <el-button 
                        link
                        size="small"
                        type="primary"
                        icon="Delete"
                        @click="deleteUnit(scoped.measureId)">
                        删除</el-button>
                </div>
         </template>
        </myTable>

        <!-- 删除弹窗 -->
        <el-dialog
            v-model="deleteDialogVisible">
            <span>确定要删除此条数据吗？</span>
            <template #footer>
                <div>
                    <el-button @click='deleteDialogVisible = false'>取消</el-button>
                    <el-button @click='confirmdDeleteUnit'>确定</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 新增弹窗 -->
         <unitAddEdit
            :popwindowTitle="popwindowTitle"
            :popwindowStatus="popwindowStatus"
            v-model:popwindowStatus="popwindowStatus"
            :mainUnit="mainUnit"
            @emitFromData="receiveFromData"
            :getUnitIdData='getUnitIdData'
            @emitEditFromData="editUnitData"
            >
         </unitAddEdit>
    </div>
</template>
<script setup>
// 引入子组件
import myInput from '@/components/MyInput/myInput.vue'
import myTable from '@/components/MyTable/myTable.vue'
import unitAddEdit from '@/components/unitAddOrEdit/unitAddEdit.vue';
// 引入接口  获取计量单位表格数据
import {getUnitTableData} from '@/api/mainData/mainData.js'
 
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { deleteUnitData,searchUnitData,getPrimaryUnitName,submitUnitData,getUnitDataById,updataUnitData} from '../../../api/mainData/mainData';

const mytable = ref(null)

// 定义input label 提示词等内容
const inputConfigs = ref([
    {label: '单位编码', prop:'measureCode',placeholder: '请输入单位编码'},
    {label: '单位名称', prop:'measureName', placeholder: '请输入单位名称'},
])

// 定义params 用于获取unit单位列表数据
let params = ref({
    pageNum: 1,
    pageSize: 10,
    
})

// 定义表头数据
const tableSetting = ref([
    {
        label:'单位编码',
        prop:'measureCode',
    },
    {
        label:'单位名称',
        prop:'measureName',
    },
    {
        label:'是否显示主单位',
        prop:'primaryFlag',
        slotStatus:true
    },
    {
        label:'与主单位换算比例',
        prop:'changeRate',
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
        prop:'unitAction',
        slotStatus:true
    }
])

// 定义单位的表格数据
const tableData = ref([]);
// 定义表格的条数数据
let tableTotal = ref(0)

// 定义删除弹窗的默认状态  关闭
let deleteDialogVisible = ref(false);

// 定义要删除的id
const deleteId = ref('');

// 定义要搜索的数据
const souSuoUnitData = ref({
    measureCode: '',
    measureName: '',
    itemTypeId:''
})
// 定义弹窗的标题  当用户点击新增按钮时将"新增"传入子组件
// 点击"修改"时，将修改传入子组件
const popwindowTitle = ref('');
const popwindowStatus = ref(false);

// 定义主单位数据  
let mainUnit = ref([])

// 定义 修改某条数据时，获取ID对应的数据
const getUnitIdData = ref({})

// ------------------------------------------------------------------
// 获取单位表格的数据
const getUnitData = async() => {
    try {
        // console.log(await getUnitTableData(),'获取单位表格的数据');
        let {code,msg,rows,total} = await getUnitTableData(params.value);
        if(code == 200){
            tableData.value = rows;
            tableTotal.value = total;
            ElMessage.success('获取单位表格'+msg);
            // console.log(tableData.value,'tableData' );
            
        }
    } catch (error) {
        console.error(error,'error');   
    }   
}

getUnitData();

// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    params.value.pageSize = size
    // console.log(params.value,'测试一下');
    // 更新数据
    getUnitData()
}
// 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    params.value.pageNum = page
    // 更新数据
    // console.log('打印params',params.value);
    getUnitData()
}
// 删除按钮打开弹窗
const deleteUnit = (id) => {
    console.log('要删除的ID',id);
    deleteId.value = id;
    deleteDialogVisible.value = true;
}

// 删除某条单位
const confirmdDeleteUnit = async()=>{
    // console.log('打印要删除的id',id);
   try {
        let {code,msg} = await deleteUnitData(deleteId.value)
        if(code == 200){
            ElMessage.success('删除单位'+msg);
            // 删除成功后重新获取数据
            getUnitData()
            deleteDialogVisible.value = false;
        }
   } catch (error) {
        console.log(error,'error');    
   }   
}

// 修改某条单位
const editUnit = async(id)=>{
    console.log('要修改的ID	',id);
    // console.log( await getUnitDataById(id),'获取要修改的数据');
    popwindowTitle.value = '修改';
    popwindowStatus.value = true;
    // 获取主单位数据
    getMainUnitData()
    try {
        let {code,data,msg} = await getUnitDataById(id)
        if(code == 200){
            ElMessage.success('要修改id对应的数据'+msg);
            getUnitIdData.value = data;
            console.log(getUnitIdData.value,'getUnitIdData');
            
        }
    } catch (error) {
        console.log(error,'error');   
        
    }
    
    
}

// 搜索数据
const getSearchUnitData=async(data)=>{
    console.log('子组件传递过来的搜索数据',data);
    souSuoUnitData.value = data;
    console.log('打印souSuoUnitData',souSuoUnitData.value);
    
    // console.log(await searchUnitData(souSuoUnitData.value),'搜索数据');
    try {
        let {code,msg,rows} = await searchUnitData(souSuoUnitData.value)
        if(code == 200){
            ElMessage.success('搜索单位'+msg);
            console.log(rows,'搜索到的数据'  );
            
            tableData.value = rows;
            console.log(tableData.value,'tableData');
            
        }
    } catch (error) {
        console.log(error,'error');   
        
    }
}
// 重置按钮
const clearSearchData=()=>{
    souSuoUnitData.value = {
        measureCode: '',
        measureName: '',
        itemTypeId:''
    }
    getUnitData()
}


// 新增按钮
const addNew = async() => {
    console.log('新增');
    popwindowTitle.value = '添加单位';
    popwindowStatus.value = true;
    getMainUnitData()
}
// 收到子组件传递过来的的要添加的数据
const receiveFromData=async(data)=>{
    console.log('接收到子组件传递过来的的数据',data);
    // 请求
    try {
        // console.log(await submitUnitData(data),'提交数据');
        let {code,msg} = await submitUnitData(data)
        if(code == 200){
            ElMessage.success('提交单位'+msg);
            // 关闭弹窗并重新获取数据
            popwindowStatus.value = false;
            getUnitData()
        }else{
            ElMessage.error(msg)
        }
        
    } catch (error) {
        
    }
}
// 封装：获取主单位数据
const getMainUnitData = async()=>{
    try {
        if( popwindowStatus.value = true){
            let {code,msg,data} = await getPrimaryUnitName()
            if(code == 200){
                ElMessage.success('获取主单位数据'+ msg)
                mainUnit.value = data
                
            }
            else{
                ElMessage.error(msg)
            }
        }
    } catch (error) {
        console.log(error,'error');   
        
    }
}

// 修改数据
const editUnitData=async(data)=>{
    console.log('父组件收到子组件传递的数据',data);
    console.log(await updataUnitData(data),'修改数据');
    // 更新界面
    getUnitData()
}

// 删除多个
const delAll=async()=>{
    console.log(mytable.value.deleteArr,'所选择的');
    // console.log(await deleteUnitData((mytable.value.deleteArr).toString()));
    try {
        let {code,msg} = await deleteUnitData((mytable.value.deleteArr).toString())
        if(code == 200){
            ElMessage.success('删除单位'+msg);
            getUnitData()
        }
    } catch (error) {
        console.log(error,'error');  
    }
    getUnitData()
}
// 带颜色按钮 修改
const editUnitById=async()=>{
    console.log(mytable.value.deleteArr,'要修改的数据的id');
    popwindowStatus.value = true;
    popwindowTitle.value = '修改';
    getMainUnitData()
    try {
        let {code,data,msg} = await getUnitDataById(mytable.value.deleteArr)
        if(code == 200){
            ElMessage.success('要修改id对应的数据'+msg);
            getUnitIdData.value = data;
            console.log(getUnitIdData.value,'getUnitIdData');
        }
    } catch (error) {
        console.log(error,'error');
    }
}

</script>
<style scoped>
    .container{
        padding: 20px;
    }
    .color-button {
    height: 50px;
    display: flex;
    align-items: center;
}
</style>