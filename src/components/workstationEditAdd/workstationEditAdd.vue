<template>
    <div>
        <el-dialog 
            :close-on-press-escape='false' 
            :close-on-click-modal="false" 
            :show-close="false"
            :title="popwindowTitle" 
            :model-value="popwindowStatus" 
            @update:popwindowStatus="emitVisibleChange">

            <el-form  label-width="auto">
                <div style="display: flex;justify-content: space-between;height: 250px;width: 960px;">
                    <div>
                        <!-- 工作站编码和自动生成、开关在同一行 -->
                        <div style="display: flex; align-items: center;">
                            <el-form-item label="工作站编码" :label-width="formLabelWidth">
                                <el-input v-model="workstationForm.workstationCode" style="width: 370px;" />
                            </el-form-item>

                            <!-- 自动生成文本和开关 -->
                            
                            <el-switch
                                :disabled="popwindowTitle == '查看工作站信息'" 
                                active-text="自动生成" 
                                v-model="switchValue"
                                @change="switchChange"
                                style="margin-bottom: 20px;margin-left: 5px; --el-switch-on-color: #409EFF; --el-switch-off-color: #ccc"
                                 />
                        </div>

                        <el-form-item label="工作站名称" :label-width="formLabelWidth">
                            <el-input v-model="workstationForm.workstationName"  style="width: 500px" />
                        </el-form-item>

                        <el-form-item label="工作站地点" :label-width="formLabelWidth">
                            <el-input v-model="workstationForm.workstationAddress" style="width: 500px;" />
                        </el-form-item>


                        <el-form-item label="所在车间" :label-width="formLabelWidth" style="width: 50%; ">
                            <el-select v-model="workstationForm.workshopId" placeholder="请选择" style="width: 240px">
                                <el-option
                                      v-for="item in workshopOptions"
                                      :key="item.value"
                                      :label="item.workshopName"
                                      :value="item.workshopId"
                                    />
                            </el-select>
                        </el-form-item>

                        <div style="display: flex;justify-content: space-between;">
                            <el-form-item label="所属工序" :label-width="formLabelWidth" style="width: 50%; ">
                                <el-select v-model="workstationForm.processId" placeholder="请选择" style="width: 240px">
                                   <el-option
                                      v-for="item in processOptions"
                                      :key="item.value"
                                      :label="item.processName"
                                      :value="item.processId"
                                    />
                                </el-select>
                            </el-form-item>


                            <el-form-item label="是否启用" :label-width="formLabelWidth"
                                style="display: flex; align-items: center;">
                                <el-radio-group  
                                    label="工作站地址"
                                    style="display: flex; align-items: center;"
                                    :disabled="popwindowTitle =='查看工作站信息'?true:false "
                                    v-model="workstationForm.enableFlag">
                                    <el-radio value="Y" size="large">是</el-radio>
                                    <el-radio value="N" size="large">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </div>

                    <div style="width: 200px;height: 200px;border: 1px dashed ;margin-right: 60px"></div>

                </div>

                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-mention type="textarea" v-model="workstationForm.remark" />
                </el-form-item>

            <div  v-if="popwindowTitle == '修改工作站' ">
               <el-divider>
                  <span>工作站资源</span>
                </el-divider>
                <el-carousel type="card" height="200px" >
                  <el-carousel-item>
                    <el-card class="carousel-content">
                      <template #header>
                        <div class="card-header">
                          <span>设备资源</span>
                          <el-button
                            plain
                            type="primary"
                            link
                            @click="addManchine"
                            >新增</el-button>
                        </div>
                    </template>
                       <workStationEditTable
                        :tableData="tableData"
                        :tableSetting="tableSetting"
                       >
                       <template #operation="{scoped}">
                            <el-button 
                                link
                                size="small"
                                type="primary"
                                icon="Delete"
                                @click="deleteUnit(scoped.recordId)">
                                删除</el-button>
                       </template>
                    </workStationEditTable>
                    </el-card>
                  </el-carousel-item>
              
                  <el-carousel-item>
                    <el-card class="carousel-content">
                        <template #header>
                        <div class="card-header">
                          <span>人力资源</span>
                          <el-button
                            plain
                            type="primary"
                            link
                            @click="addPerson"
                            >新增</el-button>
                        </div>
                    </template>
                        <workStationEditTable
                            v-bind="{
                                tableData:personTableData,
                                tableSetting: personTableSetting,
                            }">
                            <template #operation="{scoped}">
                                <el-button 
                                    link
                                    size="small"
                                    type="primary"
                                    icon="EditPen"
                                    @click="editPerson(scoped.recordId)">
                                    修改</el-button>
                                <el-button 
                                    link
                                    size="small"
                                    type="primary"
                                    icon="Delete"
                                    @click="deletePerson(scoped.recordId)">
                                    删除</el-button>
                            </template>
                        </workStationEditTable>
                    </el-card>
                  </el-carousel-item>
              
                  <el-carousel-item>
                    <el-card class="carousel-content">
                        <template #header>
                        <div class="card-header">
                          <span>人力资源</span>
                          <el-button
                            plain
                            type="primary"
                            link
                            @click="addPerson"
                            >新增</el-button>
                        </div>
                    </template>
                        <workStationEditTable
                            v-bind="{
                                tableData:personTableData,
                                tableSetting: personTableSetting,
                            }">
                            <template #operation="{scoped}">
                                <el-button 
                                    link
                                    size="small"
                                    type="primary"
                                    icon="EditPen"
                                    @click="editPerson(scoped.recordId)">
                                    修改</el-button>
                                <el-button 
                                    link
                                    size="small"
                                    type="primary"
                                    icon="Delete"
                                    @click="deletePerson(scoped.recordId)">
                                    删除</el-button>
                            </template>
                        </workStationEditTable>
                    </el-card>
                  </el-carousel-item>
                </el-carousel>
            </div>
            </el-form>
            <template #footer>
                <div>
                    <el-button @click="cancel">关闭</el-button>
                    <el-button v-if="popwindowTitle == '添加工作站'" type="primary" @click="confirm">
                        确定
                    </el-button>

                    <el-button v-else-if="popwindowTitle == '修改工作站'" type="primary" @click="editForm">修改</el-button>
                    <el-button v-if="popwindowTitle == '查看' ">取消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 设备选择弹窗 -->
        <MachineSelectionDialog
            @emitManchineData="emitManchineData"
            :treeData="treeData"
            :tableData="tableData"
            :popwindowTitle1="popwindowTitle1"
            :popwindowStatus1="popwindowStatus1"
             v-model:popwindowStatus1="popwindowStatus1"
        ></MachineSelectionDialog>

        <!-- 添加人力资源弹窗 -->
        <el-dialog 
            v-model="personwindowStatus"
            style="width: 30%;"
            >
                <template #header>
                    <span>添加人力资源</span>
                </template>
                <el-form>
                    <el-form-item label="岗位">
                        <el-select v-model="submitAddPersonData.postId"  placeholder="请选择岗位" style="width: 240px">
                          <el-option
                            v-for="item in personSelectList"
                            :key="item.value"
                            :label="item.postName"
                            :value="item.postId"
                          />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量">
                         <el-input-number v-model="submitAddPersonData.quantity" :min="1"  />
                    </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="personwindowStatus = false">取消</el-button>
                    <el-button type="primary" @click="personConfirm" v-if="addEditTitle == '添加人力资源'">
                      确定
                    </el-button>
                    <el-button type="primary" @click="confirmEdit" v-else-if="addEditTitle =='修改人力资源' ">修改</el-button>
                  </div>
                </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import MachineSelectionDialog from '../MachineSelection/MachineSelectionDialog.vue'
import workStationEditTable from '../workstationEditTable/workStationEditTable.vue'
import { getWORKSTATION_CODE,submitWorkStationData,getWorkStationBarcodeUrl,
        getWorkshopData,getProcessData,submitEditWorkStationData,getWorkstationMachineTableData,
        deleteWorkstationMachine,getManchineTreeListData,getManchineTableData,
        submitWorkstationMachineData,getworkstationworkerTabelData,deleteworkstationworker,
        getworkerPositionTableData,submitWorkstationworkerData,getworkstationworkerById,submitEditWorkstationworkerData} from '@/api/mainData/mainData.js'
import { ElMessage, ElNotification } from 'element-plus'
import { useWorkstationStore } from '@/store/modules/workstationsId'
const workstationStore = useWorkstationStore()


const popwindowTitle1 = ref('');
const popwindowStatus1 = ref(false);
const treeData = ref({})


// 查询设备资源 所需参数
const workstationmachine = ref({
    pageNum:1,
    pageSize:10,
    workstationId:0
})


const tableData = ref([])
const tableSetting = ref([
    {
        label:'设备编号',
        prop:'machineryCode'
    },
    {
        label:'设备名称',
        prop:'machineryName'
    },
    {
        label:'数量',
        prop:'quantity'
    },
    {
        label:'操作',
        prop:'operation',
        slotStatus:true
    }
])

// 设备资源需要提交的数据
const submitMachineData = ref({
})

const workstationForm = ref({
    workstationCode:'',//工作站编号
    workstationName:'',//工作站名称
    workstationAddress:'',//工作站地点
    workshopId:'',//所属在车间
    processId:'',//所属工序
    enableFlag:'Y',//是否启用
    remark:'',//备注
})

const barcodeUrlData = ref({
    bussinessCode:'',
    barcodeFormart:'QR_CODE',
    barcodeType:'WORKSTATION'

})
const workshopOptions = ref([]) 

// 所属工序
const processOptions = ref([]) 

// switch
const switchValue = ref(false)

// 人力资源 相关------------------------------------------------------------
const personTableData = ref([])
const personTableSetting = ref([
    {
        label:'岗位名称',
        prop:'postName'
    },
    {
        label:'数量',
        prop:'quantity'
    },
    {
        label:'操作',
        prop:'operation',
        slotStatus:true
    }
])
// 添加人力资源弹窗状态
const personwindowStatus = ref(false);
// 下拉列表
const personSelectList = ref([])
// 人力资源弹窗 提交的数据   记得携带workstationId  这个已经存到pinia里面了
const submitAddPersonData = ref({
    postId:'',//岗位id
    quantity:0//数量
})

//  新增修改弹窗标题
const addEditTitle = ref('')

// 接收
const prop = defineProps({
    // 标题
    popwindowTitle: {
        type: String,
        default: ''
    },
    // 窗口打开关闭状态
    popwindowStatus: {
        type: Boolean,
        default: false
    },
    // 数据回显示
    backShowData: {
        type: Object,
        default: () => ({})
    },
    // 要修改数据的id，本界面根据该id调用请求，搜索用户的数据
    editWorkstationId:{
        type:Number,
        default: () => 0
    }
})
// 发送子组件的弹窗状态
const emit = defineEmits(['update:popwindowStatus', 'emitVisibleChange', 'emitWorkStationData'])
function emitVisibleChange(val) {
    emit('update:popwindowStatus', val)
}


// 弹窗确定按钮
const confirm = async () => {
    console.log(workstationForm.value,'workstationForm');
    // console.log(await submitWorkStationData(workstationForm.value), '提交结果');
    try {
        let {code,msg,data} = await submitWorkStationData(workstationForm.value)
        if(code == 200){
            ElMessage.success('工作站提交数据'+msg)
             emit('emitWorkStationData')
        }else{
            ElMessage.error('工作站提交数据'+msg)
        }
    } catch (error) {
        console.log(error,'提交数据失败');
        
        
    }
    emit('update:popwindowStatus', false)
   

}
const cancel = () => {
    // 清除数据
    workstationForm.value = {
        workstationCode:'',//工作站编号
        workstationName:'',//工作站名称
        workstationAddress:'',//工作站地点
        workshopId:'',//所属在车间
        processId:'',//所属工序
        enableFlag:'Y',//是否启用
        remark:'',//备注
    }
    emit('update:popwindowStatus', false)
}
// 修改  
const editForm=async()=>{
    try {
        let {code,msg} = await submitEditWorkStationData(workstationForm.value)
        if(code === 200){
            ElMessage.success('修改数据'+msg)
            // clearForm()
            emit('emitWorkStationData')
            emit('update:popwindowStatus', false)
        }else{
           ElMessage.error('修改数据'+msg)
        emit('update:popwindowStatus', false)
        }
       } catch (error) {
         console.log(error);
       }
}
// switch 自动生成
const switchChange=async()=>{
    if(switchValue.value == true){
          try {
              workstationForm.value.workstationCode =  await getWORKSTATION_CODE()
              barcodeUrlData.value.bussinessCode = workstationForm.value.workstationCode;
              console.log(barcodeUrlData.value,'barcodeUrlData');
              // 获取二维码
              if(workstationForm.value.workstationCode){
                let {code,msg} = await getWorkStationBarcodeUrl(barcodeUrlData.value)
                if(code == 200){ 
                    ElMessage.success('BarcodeUrl'+msg);
                }
              }else{
                    ElMessage.error('获取工作站编码失败');
              }
              
          } catch (error) {
            console.log(error,'获取供应商编码失败');
          }
        }else{
            // 不生成，清空
            workstationForm.value.workstationCode = '';
        }
}

// 获取设备资源  封装
const getWorkstationMachineData = async()=>{
    try {
            let {code,msg,rows,total} =  await getWorkstationMachineTableData(workstationmachine.value)
            if(code == 200){
                ElMessage.success('获取设备资源数据'+msg);
                console.log(rows,'rows');
                tableData.value = rows;
                
            }else{
                ElMessage.error('获取设备资源数据'+msg);
            }
        } catch (error) {
            console.log(error,'设备设备资源资源');
            
        }
        
    }
// 获取人力资源数据  封装
const getWorkStationTableData = async()=>{
    try {
            let {code,msg,rows,total} =  await getworkstationworkerTabelData(workstationmachine.value)
            if(code == 200){
                ElMessage.success('获取人力资源数据'+msg);
                console.log(rows,'rows');
                personTableData.value = rows;
                
            }else{
                ElMessage.error('获取人力资源数据'+msg);
            }
        } catch (error) {
            console.log(error,'人力资源');   
        }
}
// 获取人力资源  岗位列表数据 下拉列表
const getWorkPositionData =async()=>{
    // console.log(await getworkerPositionTableData(),'人力资源岗位数据');
    try {
        let {code,msg,data} = await getworkerPositionTableData()
        if(code == 200){
            ElMessage.success('人力资源岗位数据'+msg)
            personSelectList.value = data
        }else{
            ElMessage.error('人力资源岗位数据'+msg)
        }
    } catch (error) {
        console.log(error,'人力资源');
        
    }
    
}
// 获取  设备资源中设备选择的树形数据  需要整理数据
const getMachineTreeData = async()=>{
    // console.log( await getManchineTreeListData(),'getMachineTreeData');
    try {
        let {code,msg,data} = await getManchineTreeListData()
        if(code == 200){
            ElMessage.success('获取数据'+msg);
            console.log(data,'data');
            
            treeData.value = listToTree(data)
            console.log(treeData.value,'treeData');
        }else{
            ElMessage.error('获取数据'+msg);
        }
    } catch (error) {
        console.log(error,'获取数据失败');
        
    }
}



// 设备资源  删除
const deleteUnit = async(id)=>{
    try {
        let {code,msg} = await deleteWorkstationMachine(id)
        if(code === 200){
            ElNotification({
                title: '删除成功',
                message: msg,
                type:'success',
            })
            // 刷新数据
            getWorkstationMachineData()
        }else{
            ElNotification({
                title: '删除失败',
                message: msg,
                type: 'error',
            })
        }
    } catch (error) {
        console.log(error,'删除数据失败');   
    }
}
// 设备资源新增
const addManchine =()=>{
    popwindowTitle1.value = '设备选择'
    popwindowStatus1.value = true  
}
// 人力资源删除
const deletePerson=async(id)=>{
    console.log('该项的id',id);
    try {
        let {code,msg} = await deleteworkstationworker(id)
        if(code === 200){
            ElNotification({
                title: '删除成功',
                message: msg,
                type:'success',
            })
            // 刷新数据
            getWorkStationTableData()
        }else{
            ElNotification({
                title: '删除失败',
                message: msg,
                type: 'error',
            })
        }
    } catch (error) {
        console.log(error,'删除数据失败');   
    }
}
// 人力资源新增 修改
const addPerson=()=>{
    addEditTitle.value = '添加人力资源'
    personwindowStatus.value = true
}
// 人力资源弹窗  确定按钮
const personConfirm=async()=>{
    try {
        submitAddPersonData.value = {
            ...submitAddPersonData.value,
            workstationId:workstationStore.workstationId
        }
        let {code,msg} = await submitWorkstationworkerData(submitAddPersonData.value)
        if(code == 200){
            ElMessage.success('人力资源提交数据'+msg)
            
            // 刷新数据
            getWorkStationTableData()
            personwindowStatus.value = false
        }else{
            ElMessage.error('人力资源提交数据'+msg)
            personwindowStatus.value = false
        }
    } catch (error) {
        console.log(error,'error','提交数据失败');
        
    }
    // 清空数据
    submitAddPersonData.value = {
        postId:'',//岗位id
        quantity:0//数量
    }
    
    // console.log('人力资源添加弹窗 表单数据',submitAddPersonData.value);
    
}
// 修改
const editPerson=async(id)=>{
    console.log('修改',id);
    personwindowStatus.value = true
    addEditTitle.value = '修改人力资源'
    // 查询id对应的数据  数据回显
    // console.log(await getworkstationworkerById(id),id,'查询id对应的数据');
    try {
        let {code,msg,data} = await getworkstationworkerById(id)
        if(code == 200){
            ElMessage.success('获取数据'+msg);
            submitAddPersonData.value = data
        }else{
            ElMessage.error('获取数据'+msg);
        }
    } catch (error) {
        console.log(error,'获取数据失败');   
    }
}
// 确认修改
const confirmEdit = async()=>{
    console.log('确认修改');
   
    // 调用确认修改接口
    // console.log(await submitEditWorkstationworkerData(submitAddPersonData.value),'确认修改');
    try {
        let {code,msg} = await submitEditWorkstationworkerData(submitAddPersonData.value)
        if(code == 200){
            ElMessage.success('修改数据'+msg)
            // 刷新数据
            getWorkStationTableData()
            personwindowStatus.value = false
        }else{
            ElMessage.error('修改数据'+msg)
            personwindowStatus.value = false
        }
    } catch (error) {
        console.log(error,'修改数据失败');
            
    }
    // 清空数据
    submitAddPersonData.value = {
        postId:'',//岗位id
        quantity:0//数量
    }
}



watch(()=>prop.popwindowStatus, async(newVal, oldVal) => {
    if(newVal){
        try {
            let {code,msg,data} = await getWorkshopData()
            if(code == 200){
                ElMessage.success('获取车间数据'+msg);
                workshopOptions.value = data;
                // console.log(workshopOptions.value);
            }else{
                ElMessage.error('获取车间数据'+msg);
            }
        } catch (error) {
            console.log(error,'获取车间数据失败');
            
        }
    }
})
watch(()=>prop.popwindowStatus, async(newVal, oldVal) => {
    if(newVal){
        try {
            let {code,msg,data} = await getProcessData()
            if(code == 200){
                ElMessage.success('获取工序数据'+msg);
                processOptions.value = data;
                console.log(processOptions.value);
            }else{
                ElMessage.error('获取工序数据'+msg);
            }
        } catch (error) {
            console.log(error,'获取工序数据失败');
            
        }
        
    }
})
watch(()=>prop.popwindowStatus, async(newVal, oldVal) => {
    if(newVal){
        // 获取tree数据
        getMachineTreeData()
        // 获取人力资源 岗位列表数据
        getWorkPositionData()
    }
})
// 监听数据  数据变化  回显
watch(()=>prop.backShowData,(newVal)=>{
        if(newVal){
            // 回显数据
            workstationForm.value = {...newVal}
        }
})

// 监听用户点击的某一项的id，变化  调用接口
watch(()=>prop.editWorkstationId,async(newVal)=>{
    if(newVal){
        // console.log('子组件ID收到  变化',newVal);
        workstationmachine.value.workstationId = newVal;
        // console.log(workstationmachine.value,'workstationmachine');
        // 调用接口  获取设备资源
        getWorkstationMachineData(workstationmachine.value)
        // 获取人力资源
        getWorkStationTableData(workstationmachine.value)
    }
})

// 将获取的数据（扁平数据）处理为树形数据
function listToTree(data, idKey = 'machineryTypeId', parentKey = 'parentTypeId', childrenKey = 'children') {
  const map = {};
  const tree = [];

  // 先遍历一遍，生成一个 id -> item 的 map
  data.forEach(item => {
    map[item[idKey]] = { ...item, [childrenKey]: [] };
  });

  // 再次遍历构造树形结构
  data.forEach(item => {
    const parentId = item[parentKey];
    const treeItem = map[item[idKey]];
    if (parentId === 0 || parentId == null || !map[parentId]) {
      // 没有父级，作为根节点
      tree.push(treeItem);
    } else {
      // 加入父节点的 children 中
      map[parentId][childrenKey].push(treeItem);
    }
  });

  return tree;
}

// 更新设备资源table数据
const emitManchineData =async(data)=>{
    // 调用提交 设备选择数据 接口
    console.log(data,'父emitManchineData');
    submitMachineData.value = data

    // console.log(await submitWorkstationMachineData(submitMachineData.value),'manchine提交结果');
    try {
        let {code,msg} = await submitWorkstationMachineData(submitMachineData.value)
        if(code === 200){
            ElMessage.success('提交数据'+msg);
        }else{
            ElMessage.error('提交数据'+msg);
        }
    } catch (error) {
        console.log(error,'提交数据失败');
        
    }
    getWorkstationMachineData()
}

</script>
<style scoped>


 .card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
 }


</style>