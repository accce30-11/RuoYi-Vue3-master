<template>
    <div>
        <el-dialog
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            :title="popwindowTitle"
            :model-value="popwindowStatus"
            @update:popwindowStatus="emitVisibleChange"  
            >

            <el-form :inline="true" label-width="auto">

                <el-form-item label="车间编码" style="width: 50%;">
                    <el-input v-model="workShopForm.workshopCode" 
                              placeholder="请输入车间编码"></el-input>
                </el-form-item>

                <el-form-item>
                 <el-switch
                    :disabled="popwindowTitle == '查看' " 
                    v-model="switchValue"
                    active-text="自动生成"
                    @change="switchChange"></el-switch>
            </el-form-item>

             <el-form-item style="position: absolute; top: 45px;right: 20px;">
                <el-avatar shape="square" :size="200" :fit="fit" :src="url" />
            </el-form-item>

            <el-form-item label="车间名称" style="width: 60%;">
                <el-input v-model="workShopForm.workshopName"
                          placeholder="请输入车间名称"></el-input>
            </el-form-item>

            <el-form-item label="面积"  style="width: 50%;">
                 <el-input-number v-model="workShopForm.area" :min="0"></el-input-number>
            </el-form-item>

            <el-form-item label="负责人" style="width: 60%;" >
                <el-input
                  v-model="workShopForm.charge"
                  style="max-width: 600px"
                  placeholder="Please input"
                  class="input-with-select"
                >
                <template #append>
                    <el-button :icon="Search" @click="searchCharge"/>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item label="是否有效" style="width: 60%;">
            <el-radio-group v-model="workShopForm.enableFlag" :disabled="popwindowTitle =='查看'?true:false ">
              <el-radio value="Y" size="large">是</el-radio>
              <el-radio value="N" size="large">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" style="width: 100%;">
            <el-input
                type="textarea"
                v-model="workShopForm.remark"
                ></el-input>
        </el-form-item>
        </el-form>
            <template #footer>
            <div>
                <el-button @click="cancel">关闭</el-button>
                <el-button v-if="popwindowTitle=='添加车间'" type="primary" @click="confirm">
                确定
                </el-button>

                <el-button v-else-if="popwindowTitle == '修改车间' " type="primary" @click="editForm">修改</el-button>
                <!-- <el-button v-if="popwindowTitle == '查看' ">取消</el-button> -->
                </div>
        </template>


        <!-- 负责人弹窗 -->
         <personalSelection
            :treeData="treeData"
            :popwindowTitle1="popwindowTitle1"
            :popwindowStatus1="popwindowStatus1"
             v-model:popwindowStatus1="popwindowStatus1"
             @emitChargeData='getChargeData'
         ></personalSelection>

        </el-dialog>
    </div>
</template>
<script setup>
import personalSelection from '../workShopPersonSelect/personalSelection.vue'
import { Search } from '@element-plus/icons-vue'
import {submitWorkShopData,getTreeSelectData,getWorkshopCode,getWorkshopBarcodeUrl,submitEditWorkshopData} from '@/api/mainData/mainData.js'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';

const popwindowTitle1 = ref('');
const popwindowStatus1 = ref(false);
const treeData = ref({})

const switchValue = ref(false)

// 需要提交的数据
    const workShopForm = ref({
        workshopCode:'',//车间编码
        workshopName:'',//车间名称
        area:'',//面积
        charge:'',//负责人
        chargeId:'',//负责人id
        enableFlag:'Y',//是否启用
        remark:'',//备注
    })
// 携带车间编码发送另一个请求所需数据
const barcodeUrlData = ref({
    bussinessCode:'',
    barcodeFormart:'QR_CODE',
    barcodeType:'WORKSHOP'

})

// 接收
    const prop = defineProps({
        // 标题
        popwindowTitle: {
            type: String,
            required: true
        },
        // 窗口打开关闭状态
        popwindowStatus:{
            type: Boolean,
            default: false
        },
        // 数据回显示
        backShowData:{
            type: Object,
            default: () => ({})
        }
    })
    // 发送子组件的弹窗状态
    const emit = defineEmits(['update:popwindowStatus','emitVisibleChange','emitParentUpdata'])
    function emitVisibleChange(val) {
        emit('update:popwindowStatus', val)
    }

    // 关闭弹窗
    const cancel=()=>{
        clear() 
        emit('update:popwindowStatus',false)
    }
    // 确认添加
    const confirm=async()=>{
        // console.log(workShopForm.value,'workShopForm');
        try {
            let { code,msg } = await submitWorkShopData(workShopForm.value)
            if(code === 200){
                ElMessage.success('车间添加'+msg)
                // 通知父组件刷新
                emit('emitParentUpdata')
                emit('update:popwindowStatus',false)
            }else{
                ElMessage.error(msg)
            }
        } catch (error) {
            console.log(error,'error in confirm');   
            emit('update:popwindowStatus',false)
        }
    }

// 点击放大镜  展开新弹窗
const searchCharge=()=>{
    popwindowTitle1.value = '选择负责人'
    popwindowStatus1.value = true  
}

// 获取树形数据并传递给子组件 personSelection
const getTreeData = async () => {
    // console.log(await getTreeSelectData(),'treeData');
    try {
        let {code,data,msg} = await getTreeSelectData()
        if(code === 200){
           treeData.value = data
        } else {
            console.log(msg)
        }

    } catch (error) {
        console.log(error,'error in getTreeData');   
    }
}
// 拿到子组件  选择负责人的数据
const getChargeData =(data)=>{
    console.log('父组件收到负责人数据',data);
    // 数据回显
    workShopForm.value.charge = data.nickName
    workShopForm.value.chargeId = data.userId
    console.log(workShopForm.value,'workShopForm'  )
}

// 自动生成
const switchChange=async()=>{
    // 点击自动生成  调用两个接口  一个是获取车间编码，另一个是携带编码生成url
    if(switchValue.value == true){
          try {
              workShopForm.value.workshopCode =  await getWorkshopCode()
              barcodeUrlData.value.bussinessCode = workShopForm.value.workshopCode
              let {code,msg} = await getWorkshopBarcodeUrl(barcodeUrlData.value)
              if(code === 200){
                ElMessage.success('车间编码BarcodeUrl'+msg)
              }else{
                ElMessage.error('获取车间编码BarcodeUrl'+msg)
              }
              
          } catch (error) {
            console.log(error,'获取车间编码失败');
          }
        }else{
            // 不生成，清空
             workShopForm.value.workshopCode = '';
        }
}

// 确认修改   submitEditWorkshopData
const editForm=async()=>{
    try {
        let {code,msg} = await submitEditWorkshopData(workShopForm.value)
        if(code === 200){
            ElMessage.success('修改车间数据'+msg)
            // clearForm()
            emit('emitParentUpdata')
            emit('update:popwindowStatus', false)
        }else{
           ElMessage.error('修改车间数据'+msg)
        emit('update:popwindowStatus', false)
        }
       } catch (error) {
         console.log(error);
       }
}
// 清空数据
const clear=()=>{
    switchValue.value = false
    workShopForm.value = {
        workshopCode:'',//车间编码
        workshopName:'',//车间名称
        area:'',//面积
        charge:'',//负责人
        chargeId:'',//负责人id
        enableFlag:'Y',//是否启用
        remark:'',//备注
    }
}

// 监听popwindowStatus，当为true时，获取treeData
watch(() => prop.popwindowStatus, (newVal, oldVal) => {
    if(newVal){
        getTreeData()
    }
})
// 监听数据  数据变化  回显
    watch(()=>prop.backShowData,(newVal)=>{
        if(newVal){
            // 回显数据
            workShopForm.value = {...newVal}
        }
    })

</script>
<style scoped>


</style>