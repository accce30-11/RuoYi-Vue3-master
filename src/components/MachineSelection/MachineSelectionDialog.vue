<template>
    <div>
    <el-dialog
      style="width: 70%; position: relative;" 
      :close-on-press-escape='false'
      :close-on-click-modal="false"
      :show-close="false"
      :title="popwindowTitle1"
      :model-value="popwindowStatus1"
      @update:popwindowStatus="emitVisibleChange"
    >
        <!-- 树形结构 -->
    <div style="display: flex;justify-content: space-evenly;">
        <treev2
          :treeData="treeData"
          @getTreeData="getTreeTableData">
        </treev2>

      <div style="display: flex;flex-direction: column;">
          <myInput
            :inputConfigs="inputConfigs"
            @searchInputData="searchClientData"
            @clearSearchData="clearSearchData"
          />
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
import {getUserSelectData,searchWorkShop,getManchineTableData} from '@/api/mainData/mainData.js'
import { inject, ref } from 'vue'
import { ElMessage,ElNotification  } from 'element-plus'
// 孙组件使用pinia接收id
import { useWorkstationStore } from '@/store/modules/workstationsId'
const workstationStore = useWorkstationStore()



const mytable = ref(null)
const tableData = ref([])
const params = ref({
    pageNum:1,
    pageSize:10,
    machineryTypeId:0,//tree的每一项id
    machineryCode:'',//设备编码
    machineryName:'',//设备名称
    workshopName:''//所属车间
})

    // 分页器相关
const tableTotal = ref(0)
const inputConfigs = ref([
    {
        label:'设备编码',
        prop:'machineryCode'
    },
    {
        label:'设备名称',
        prop:'machineryName'
    },
    {
       label:'所属车间',
       prop:'workshopName' 
    }
])
const tableSetting = ref([
    {
        label:'设备编码',
        prop:'machineryCode',
        radio:true
    },
    {
        label:'设备名称',
        prop:'machineryName'
    },
    {
        label:'品牌',
        prop:'machineryBrand',
    },
    {
        label:'规格型号',
        prop:'machinerySpec'
    },
    {
        label:'所属车间',
        prop:'workshopName'
    },
    {
        label:'设备状态',
        prop:'status'
    },
    {
        label:'创建时间',
        prop:'createTime'
    }
])

// 拿到负责人数据     nickName    userId
const submitManchineData = ref({
    
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
    const emit = defineEmits(['update:popwindowStatus1','emitVisibleChange','emitManchineData'])
    function emitVisibleChange(val) {
        emit('update:popwindowStatus1', val)
    }

// 获取treeId对应的数据
const getTreeTableData=(treeId)=>{
    console.log('打印treeId(父)',treeId);
    params.value.machineryTypeId = treeId
    params.value.machineryTypeId = treeId
    console.log(params.value,'测试一下');
    // 调用请求
    getUserData(params.value)
}
// input 搜索数据
const searchClientData=(value)=>{
    console.log('搜索数据：',value);
    params.value.machineryCode = value.machineryCode
    params.value.machineryName = value.machineryName
    params.value.workshopName = value.workshopName
    console.log(params.value,'测试一下');
    
    // 调用请求
    getUserData(params.value)
}
// 重置
const clearSearchData=()=>{
    params.value.machineryCode = ''
    params.value.machineryName = ''
    params.value.workshopName = ''
    console.log(params.value,'测试一下');
    
    // 调用请求
    getUserData()
}

const cancel=()=>{
    // 清空数据

    emit('update:popwindowStatus1',false)
}


// 设备选择 确定按钮
const confirm=()=>{
    // 获取选中数据  判断至少选中一条数据
    if(mytable.value.deleteArr.length <= 0){
        ElNotification({
            title: '提示',
            message: '至少选择一个数据！',
            type: 'warning',
        })
        return
    }
    // 赋值数据
    submitManchineData.value = mytable.value.deleteArr
    console.log(submitManchineData.value,'子submitManchineData'  );
    
//    这里使用pinia进行接收
    console.log(workstationStore.workstationId,'pinia');
    
    submitManchineData.value = {
        ...mytable.value.deleteArr[0],
        workstationId:workstationStore.workstationId
    }
    console.log('整理后的数据',submitManchineData.value);
    

    // chargeData.value.nickName = mytable.value.deleteArr[0].nickName
    // chargeData.value.userId = mytable.value.deleteArr[0].userId
    // console.log(chargeData.value,'测试一下');
    emit('update:popwindowStatus1',false)
    emit('emitManchineData',submitManchineData.value)
}

// 获取右侧选择数据
const getUserData = async() => {
    try {
        // console.log( await getUserSelectData(params.value));
        let {code,msg,rows,total} = await getManchineTableData(params.value)
        if (code === 200) {
            // console.log(rows,'rows');
            
            ElMessage.success('设备选择'+msg)
            tableData.value = rows
            tableTotal.value = total
            // console.log(tableData.value,'tableData');
            
        }else{
            ElMessage.error('设备选择'+msg)
        }
    } catch (error) {
        console.log(error,'error in getManchineData()');
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