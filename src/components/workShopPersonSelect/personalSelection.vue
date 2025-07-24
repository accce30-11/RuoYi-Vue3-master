<template>
    <div>
    <el-dialog
      style="width: 90%; position: relative;" 
      :close-on-press-escape='false'
      :close-on-click-modal="false"
      :show-close="false"
      :title="popwindowTitle1"
      :model-value="popwindowStatus1"
      @update:popwindowStatus="emitVisibleChange"
    >

      <div style="position: relative;">
        <div style="position: absolute; top: 5px; right: 400px; z-index: 10;">
          <myInput
            :inputConfigs="inputConfigs"
            @searchInputData="searchClientData"
            @clearSearchData="clearSearchData"
          />
        </div>
        
        

        <!-- 树形结构 -->
        <treev2
          :treeData="treeData"
          @getTreeData="getTreeTableData">
        </treev2>

        <myTable
            ref="mytable"
            :tableData="tableData"
            :tableSetting="tableSetting"
            :tableTotal = 'tableTotal'
            @updateSize = 'updateSize'
            @updateCurrentPage = 'updateCurrentPage'
        >
        <!-- 如果dept存在，就dept.deptName,否则为'' -->
        <template #dept="{scoped}">
            {{ scoped.dept?.deptName||''}}
        </template>
        </myTable>
      </div>

      <template #footer>
        <div>
          <el-button @click="cancel">关闭</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import treev2 from '@/components/tree/treev2.vue'
import myTable from '@/components/MyTable/myTable.vue'
import myInput from '@/components/MyInput/myInput.vue'
import {getUserSelectData,searchWorkShop} from '@/api/mainData/mainData.js'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const mytable = ref(null)
const tableData = ref([])
const params = ref({
    pageNum:1,
    pageSize:10,
    userName:'',
    phonenumber:'',
    deptId:0
})
// const searchData = ref({
//     userName:'',
//     phonenumber:'',
//     deptId:0
// })
    // 分页器相关
const tableTotal = ref(0)
const inputConfigs = ref([
    {
        label:'用户名称',
        prop:'userName'
    },
    {
        label:'手机号码',
        prop:'phonenumber'
    }
])
const tableSetting = ref([
    {
        label:'用户名称',
        prop:'userName',
        radio:true
    },
    {
        label:'用户昵称',
        prop:'nickName'
    },
    {
        label:'部门',
        prop:'dept',
        slotStatus:true
    },
    {
        label:'手机号码',
        prop:'phonenumber'
    },
    {
        label:'创建时间',
        prop:'createTime'
    }
])

// 拿到负责人数据     nickName    userId
const chargeData = ref({
    nickName:'',
    userId:''
})

// 接收
    const prop = defineProps({
        // 标题
        popwindowTitle1: {
            type: String,
            required: true
        },
        // 窗口打开关闭状态
        popwindowStatus1:{
            type: Boolean,
            default: false
        },
        treeData:{
            type: Object,
            default: () => {}
        }
    })
    // 发送子组件的弹窗状态
    const emit = defineEmits(['update:popwindowStatus1','emitVisibleChange','emitChargeData'])
    function emitVisibleChange(val) {
        emit('update:popwindowStatus1', val)
    }

// 获取treeId对应的数据
const getTreeTableData=(treeId)=>{
    console.log('打印treeId(父)',treeId);
    params.value.deptId = treeId
    params.value.deptId = treeId
    console.log(params.value,'测试一下');
    // 调用请求
    getUserData(params.value)
}
// input 搜索数据
const searchClientData=(value)=>{
    console.log('搜索数据：',value);
    params.value.userName = value.userName
    params.value.phonenumber = value.phonenumber
    console.log(params.value,'测试一下');
    
    // 调用请求
    getUserData(params.value)
}
// 重置
const clearSearchData=()=>{
    params.value.userName = ''
    params.value.phonenumber = ''
    console.log(params.value,'测试一下');
    
    // 调用请求
    getUserData()
}

const cancel=()=>{
    emit('update:popwindowStatus1',false)
}

const confirm=()=>{
    // 获取负责人数据
    chargeData.value.nickName = mytable.value.deleteArr[0].nickName
    chargeData.value.userId = mytable.value.deleteArr[0].userId
    // console.log(chargeData.value,'测试一下');
    emit('update:popwindowStatus1',false)
    emit('emitChargeData',chargeData.value)
}

// 获取右侧人员选择数据
const getUserData = async() => {
    try {
        // console.log( await getUserSelectData(params.value));
        let {code,msg,rows,total} = await getUserSelectData(params.value)
        if (code === 200) {
            console.log(rows,'rows');
            
            ElMessage.success('人员选择'+msg)
            tableData.value = rows
            tableTotal.value = total
            // console.log(tableData.value,'tableData');
            
        }else{
            ElMessage.error('人员选择'+msg)
        }
    } catch (error) {
        console.log(error,'error in getUserData()');
    }
}

// 获取人员选择数据  监听popwindowStatus1的状态  如果为true时，就获取数据
watch(() => prop.popwindowStatus1, async (newVal, oldVal) => {
    if (newVal) {
        // 获取人员选择数据
        getUserData()
    }
})


// 分页器相关
// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    params.value.pageSize = size
    
    console.log(params.value);
    
    getUserData()
}
// 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    params.value.pageNum = page

    getUserData()
}

</script>
<style scoped>

</style>