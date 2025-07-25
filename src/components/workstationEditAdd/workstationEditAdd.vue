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
                                :disabled="popwindowTitle == '查看'" 
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
                                    :disabled="popwindowTitle =='查看'?true:false "
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

            <div>
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
                      卡片2
                    </el-card>
                  </el-carousel-item>
              
                  <el-carousel-item>
                    <el-card class="carousel-content">
                     卡片3
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
                    <!-- <el-button v-if="popwindowTitle == '查看' ">取消</el-button> -->
                </div>
            </template>
        </el-dialog>
        <!-- 设备选择弹窗 -->
        <MachineSelectionDialog
            :treeData="treeData"
            :tableData="tableData"
            :popwindowTitle1="popwindowTitle1"
            :popwindowStatus1="popwindowStatus1"
             v-model:popwindowStatus1="popwindowStatus1"
        ></MachineSelectionDialog>

    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import MachineSelectionDialog from '../MachineSelection/MachineSelectionDialog.vue'
import workStationEditTable from '../workstationEditTable/workStationEditTable.vue'
import { getWORKSTATION_CODE,submitWorkStationData,getWorkStationBarcodeUrl,getWorkshopData,getProcessData,submitEditWorkStationData,getWorkstationMachineTableData,deleteWorkstationMachine,getManchineTreeListData,getManchineTableData } from '@/api/mainData/mainData.js'
import { ElMessage, ElNotification } from 'element-plus'


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

// 接收
const prop = defineProps({
    // 标题
    popwindowTitle: {
        type: String,
        required: true
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
const getWorkstationMachineData = async(id)=>{
    try {
            let {code,msg,rows,total} =  await getWorkstationMachineTableData(workstationmachine.value)
            if(code == 200){
                ElMessage.success('获取数据'+msg);
                console.log(rows,'rows');
                tableData.value = rows;
                
            }else{
                ElMessage.error('获取数据'+msg);
            }
        } catch (error) {
            console.log(error,'设备资源');
            
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
        // 调用接口
        getWorkstationMachineData(workstationmachine.value)
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



</script>
<style scoped>


 .card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
 }


</style>