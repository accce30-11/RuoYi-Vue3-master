<template>
    <div class="container">
        <myInput
            :inputConfigs="inputConfigs"
            @searchInputData="searchClientData"
            @clearSearchData="clearSearchData"
            >
        <template #enableFlag>
            <el-select v-model="searchVendor.enableFlag" placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in options"
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
                            <!--  -->
                <el-button type="info" icon="Upload" plain>导入</el-button>
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
            <template #vendorCode="{scoped}">
                <el-button
                    type="primary"
                    link
                    @click="lookClientDetail(scoped.vendorId)"
                    >{{scoped.vendorCode}}</el-button>
            </template>

            <!-- 是否启用 -->
            <template #enableFlag="{scoped}">
                <el-tag :type="scoped.enableFlag == 'Y'? 'primary':'danger' ">
                    {{ scoped.enableFlag == "Y"?'是':'否' }}
                </el-tag>
            </template>

            <!-- 操作 -->
            <template #operation="{scoped}">
                <div>
                    <el-button 
                        link
                        size="small"
                        type="primary"
                        icon="EditPen"
                        @click="editUnit(scoped.vendorId)">
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
            <span>是否确认删除供应商编号为"{{ vendorId }}"的数据项？</span>
            <template #footer>
            <div>
                <el-button @click="delDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </div>
            </template>
        </el-dialog>

        <!-- 新增 修改 查看弹窗 -->
         <vendorAddEdit
            :popwindowTitle="popwindowTitle"
            :popwindowStatus="popwindowStatus"
            v-model:popwindowStatus="popwindowStatus"   
            @emitVendorData="emitVendorData"
            :backShowData="backShowData"
         >
         </vendorAddEdit>
    </div>
</template>
<script setup>
import vendorAddEdit from '@/components/vendorAddEditDialog/vendorAddEdit.vue'
import myInput from '@/components/MyInput/myInput.vue'
import myTable from '@/components/MyTable/myTable.vue'
import { getVendorTableData,deleteVendorData,getVendorDataById} from '@/api/mainData/mainData.js'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

let mytable = ref(null)
const tableData = ref([])
const inputConfigs = ref([
    {
        label:'供应商编码',
        prop:'vendorCode'
    },
    {
        label:'供应商名称',
        prop:'vendorName'
    },
    {
        label:'供应商简称',
        prop:'vendorNick'
    },
    {
        label:'英文名称',
        prop:'vendorEn'
    },
    {
        label:'是否启用',
        prop:'enableFlag',
        slotStatus:true
    }
])
const tableSetting = ref([
    {
        label:'供应商编码',
        prop:'vendorCode',
        slotStatus: true
    },
    {
        label:'供应商名称',
        prop:'vendorName'
    },
    {
        label:'供应商简称',
        prop:'vendorNick'
    },
    {
        label:'供应商等级',
        prop:'vendorLevel'   //A优秀  B正常
    },
    {
        label:'供应商评分',
        prop:'vendorScore'
    },
    {
        label:'供应商电话',
        prop:'tel'
    },
    {
        label:'是否启用',
        prop:'enableFlag',
        slotStatus: true
    },
    {
        label:'备注',
        prop:'remark',
        slotStatus: true
    },
    {
        label:'操作',
        prop:'operation',
        slotStatus: true
    }
])
const searchVendor = ref({
    vendorCode: '',
    vendorName: '',
    vendorNick: '',
    vendorEn: '',
    enableFlag: ''
})

// 定义select选项
const options = ref([
    { value: 'Y', label: '是' },
    { value: 'N', label: '否' },
])

// 供应商id
const vendorId = ref('')

// 分页器相关
const tableTotal = ref(0)

const popwindowTitle = ref('');
const popwindowStatus = ref(false);
const backShowData = ref({})

// 页码 条数
const params = ref({
    pageNum: 1,
    pageSize: 10
})
//  定义弹窗状态  删除弹窗
const delDialogVisible = ref(false)

// 获取供应商数据 
const getVendorData=async()=>{
    // console.log(await getVendorTableData(params.value));
    try {
        let { code,msg,rows,total } = await getVendorTableData(params.value);
        if(code == 200){
            ElMessage.success('供应商数据'+msg)
            tableData.value = rows;
            tableTotal.value = total;
        }else{
            ElMessage.error('供应商数据'+msg)
        }
    } catch (error) {
        console.log(error,'error in vendor'); 
    }
    
}
getVendorData();


// 搜索供应商数据
const searchClientData = async(data)=>{
    searchVendor.value.vendorCode = data.vendorCode
    searchVendor.value.vendorName = data.vendorName
    searchVendor.value.vendorNick = data.vendorNick
    searchVendor.value.vendorEn = data.vendorEn
    console.log('父组件收到数据',data);
    console.log(searchVendor.value,'供应商搜索');
    // 调用请求
    try {
        // console.log(await searchClient(searchData.value),'搜索数据');
        let {total,rows,code,msg} = await getVendorTableData(searchVendor.value)
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
// 重置按钮
const clearSearchData=()=>{
    searchVendor.value.clientCode = ''
    searchVendor.value.clientName = ''
    searchVendor.value.clientNick = ''
    searchVendor.value.clientEn = ''
    searchVendor.value.enableFlag = ''
    getVendorData();
}

// 分页器相关
// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    params.value.pageSize = size
    
    getVendorData();
}
// 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    params.value.pageNum = page

    getVendorData();
}

// 查看供应商详情
const lookClientDetail=async(id)=>{
    popwindowTitle.value = '查看'
    popwindowStatus.value = true
    try {
        let {code,msg,data} = await getVendorDataById(id)
        if(code == 200){
            ElMessage.success('获取供应商数据'+msg)
            backShowData.value = data
        }else{
            ElMessage.error('获取供应商数据'+msg)
        }
    } catch (error) {
        console.log(error,'error');
        
    }
}

// 修改
const editUnit=async(id)=>{
    console.log('要修改数据的id',id);
    popwindowTitle.value = '修改供应商'
    popwindowStatus.value = true

    // console.log(await getVendorDataById(id),'getVendorDataById');
    try {
        let {code,msg,data} = await getVendorDataById(id)
        if(code == 200){
            ElMessage.success('获取客户数据'+msg)
            backShowData.value = data
        }else{
            ElMessage.error('获取客户数据'+msg)
        }
    } catch (error) {
        console.log(error,'error');
        
    }
    
    
}
// 删除  弹窗
const deleteUnit=(data)=>{
    // console.log('删除',data);
    delDialogVisible.value = true;
    if(data.vendorId){
        vendorId.value = data.vendorId;
    }else{
        vendorId.value = data
    }
}
// 确认删除
// 确认删除
const confirmDelete=async()=>{
    try {
        let {code,msg} = await deleteVendorData(vendorId.value)
        if(code == 200){
            ElMessage.success('数据项删除'+msg)
            delDialogVisible.value = false
            getVendorData();
        }else{
            ElMessage.error('数据项删除'+msg)
            delDialogVisible.value = false
        }
    } catch (error) {
        delDialogVisible.value = false
    }
}
// 刷新数据
const emitVendorData=()=>{
    getVendorData();
}

// 颜色按钮
// 新增  修改  删除
const addNew=()=>{
    console.log('新增');
    
    popwindowTitle.value = '添加供应商'
    popwindowStatus.value = true
}
// 修改
const editData=()=>{
    console.log(mytable.value.deleteArr,'mytable.value.deleteArr')
    editUnit((mytable.value.deleteArr).toString())
}
// 删除
// 红色删除按钮
const delAll=()=>{
    console.log((mytable.value.deleteArr).toString());
    deleteUnit((mytable.value.deleteArr).toString()) 
}

</script>
<style scoped>
.container{
    padding: 20px;
}
</style>