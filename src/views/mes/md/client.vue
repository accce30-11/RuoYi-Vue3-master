<template>
    <div style="padding: 20px;">
        <myInput
            :inputConfigs="inputConfigs"
            @searchInputData="searchClientData"
            @clearSearchData="clearSearchData"
        >
        <template #enableFlag> 
            <el-select v-model="searchData.enableFlag" 
                           placeholder="请选择是或否" 
                           style="width: 240px">
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
            :tableSetting="tableSetting"
            :tableData="tableData"
            :tableTotal = 'tableTotal'
            @updateSize = 'updateSize'
            @updateCurrentPage = 'updateCurrentPage'
            >
            <!-- 客户编码 -->
            <template #clientCode="{scoped}">
                <el-button
                    type="primary"
                    link
                    @click="lookClientDetail(scoped.clientId)"
                    >{{scoped.clientCode}}</el-button>
            </template>

            <!-- 客户类型 -->
            <template #clientType="{scoped}">
                {{ scoped.clientType == 'ENTERPRISE' ? '企业客户' : '个人' }}
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
                        @click="editUnit(scoped.clientId)">
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
            <span>是否确认删除客户编号为"{{ clientId }}"的数据项？</span>
            <template #footer>
            <div>
                <el-button @click="delDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </div>
            </template>
        </el-dialog>

        <!-- 新增弹窗 -->
         <clientAddEdit
            :popwindowTitle="popwindowTitle"
            :popwindowStatus="popwindowStatus"
            v-model:popwindowStatus="popwindowStatus"
            @emitClientData="updateClientData"
            :backShowData="backShowData"
            >
         </clientAddEdit>
    </div>
</template>
<script setup>
import myInput from '@/components/MyInput/myInput.vue'
import myTable from '@/components/MyTable/myTable.vue'
import clientAddEdit from '@/components/clientDialog/clientAddEdit.vue'
import { getClientTableData,deleteClientData,searchClient,getClientDataById} from '@/api/mainData/mainData.js'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const tableSetting = ref([
    {
        label:'客户编码',
        prop:'clientCode',
        slotStatus:true
    },
    {
        label:'客户名称',
        prop:'clientName'
    },
    {
        label:'客户简称',
        prop:'clientEn'
    },
    {
        label:'客户类型',
        prop:'clientType',
        slotStatus:true
    },
    {
        label:'客户电话',
        prop:'tel'
    },
    {
        label:'联系人',
        prop:'contact1'
    },
    {
        label:'联系人-电话',
        prop:'contact1Tel'
    },
    {
        label:'是否启用',
        prop:'enableFlag',
        slotStatus:true
    },
    {
        label:'操作',
        prop:'action',
        slotStatus:true
    }
])
const inputConfigs = ref([
    {
        label:'客户编码',
        prop:'clientCode',
    },
    {
        label:'客户名称',
        prop:'clientName',
    },
    {
        label:'客户简称',
        prop:'clientNick'
    },
    {
        label:'客户英文名称',
        prop:'clientEn'
    },
    {
        label:'是否启用',
        placeholder:'选择是或否',
        prop:'enableFlag',
        slotStatus:true,
    }
])

let mytable = ref(null)
// 定义select选项
const options = ref([
    { value: 'Y', label: '是' },
    { value: 'N', label: '否' },
])

// 要搜索的数据
const searchData = ref({
    clientCode: '',
    clientName: '',
    clientNick: '',
    clientEn: '',
    enableFlag: ''
})


// 客户管理数据
const tableData = ref([])
// 页码条数
const params = ref({
    pageNum:1,
    pageSize:10
})
// 分页器相关
const tableTotal = ref(0)
//  定义弹窗状态  删除弹窗
const delDialogVisible = ref(false)
// 客户编号
const clientId = ref('')

// 定义弹窗的标题  当用户点击新增按钮时将"新增"传入子组件
// 点击"修改"时，将修改传入子组件
const popwindowTitle = ref('');
const popwindowStatus = ref(false);

const backShowData = ref({})

// 获取客户数据
const getClientData = async() => {
    // console.log(await getClientTableData(page),'客户管理数据');
   try {
         let {code,msg,rows,total} = await getClientTableData(params.value)
         if(code === 200) {
            ElMessage.success('客户管理数据'+msg)
            tableTotal.value = total
            tableData.value = rows
         }else{
            ElMessage.error('客户管理数据'+msg)
         }
   } catch (error) {
        console.log(error,'error');
        
   }
}

getClientData()


// 点击客户编码 查看详情
const lookClientDetail=async(id)=>{
    popwindowTitle.value = '查看'
    popwindowStatus.value = true
    try {
        let {code,msg,data} = await getClientDataById(id)
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


// 删除 弹窗
const deleteUnit=(data)=>{
    console.log(data,'删除');
    delDialogVisible.value = true
    if(data.clientId){
        clientId.value = data.clientId
    }else{
        clientId.value = data
    }
    
}
// 确认删除
const confirmDelete=async()=>{
    try {
        let {code,msg} = await deleteClientData(clientId.value)
        if(code == 200){
            ElMessage.success('数据项删除'+msg)
            delDialogVisible.value = false
            getClientData()
        }else{
            ElMessage.error('数据项删除'+msg)
            delDialogVisible.value = false
        }
    } catch (error) {
        delDialogVisible.value = false
    }
}

// 搜索客户数据
const searchClientData=async(data)=>{
    searchData.value.clientCode = data.clientCode
    searchData.value.clientName = data.clientName
    searchData.value.clientNick = data.clientNick
    searchData.value.clientEn = data.clientEn
    // console.log(data,'父组件收到data');
    console.log(searchData.value,'searchData.value');
    // 调用请求
    try {
        // console.log(await searchClient(searchData.value),'搜索数据');
        let {total,rows,code,msg} = await searchClient(searchData.value)
        if(code == 200){
            // console.log(rows,'rows');
            ElMessage.success('搜索数据'+msg)
            tableTotal.value = total
            tableData.value = rows   
        }
    } catch (error) {
        console.log(error,'error');
        
    }
}
// 重置按钮
const clearSearchData=()=>{
    searchData.value.clientCode = ''
    searchData.value.clientName = ''
    searchData.value.clientNick = ''
    searchData.value.clientEn = ''
    searchData.value.enableFlag = ''
    getClientData()
}

// 新增弹窗
const addNew=()=>{
    // console.log('新增');
    popwindowTitle.value = '添加客户'
    popwindowStatus.value = true
}
// 修改弹窗 
const editUnit=async(id)=>{
    console.log('修改',id);
    popwindowTitle.value = '修改客户'
    popwindowStatus.value = true

    // console.log( await getClientDataById(id),'获取客户数据');
    try {
        let {code,msg,data} = await getClientDataById(id)
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

// 绿色修改按钮
const editData=()=>{
    console.log(mytable.value.deleteArr,'mytable.value.deleteArr')
    editUnit((mytable.value.deleteArr).toString())
}

// 红色删除按钮
const delAll=()=>{
    console.log((mytable.value.deleteArr).toString());
    deleteUnit((mytable.value.deleteArr).toString()) 
}

// 刷新页面数据
const updateClientData=()=>{
    getClientData()
}
        
// 分页器相关
// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    params.value.pageSize = size
    
    getClientData()
}
// 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    params.value.pageNum = page

    getClientData()
}

</script>
<style scoped>
.color-button{
    margin-bottom: 20px;
}

</style>