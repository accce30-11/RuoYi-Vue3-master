<template>
    <div>
        <el-dialog 
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            :model-value="dialogVisible"
            @update:dialogVisible="emitVisibleChange"
            >
            <!-- 新增物料/产品 -->
            <template #header>
                <div class="titleClass"><h3><b>{{ props.mdItemTitle }}</b></h3></div>
            </template>
            <el-form style="padding:20px 30px 0 30px ;">
                <el-form-item label="物料编码" >
                    <el-input placeholder="请输入物料编码" 
                              style="width: 240px;"
                              v-model="formData.itemCode"
                              ></el-input>
                    <el-switch :disabled="props.mdItemTitle =='查看物料/产品'"
                               v-model="switchValue"  
                               active-text="自动生成"
                               @change="switchChange"></el-switch>
                </el-form-item>

                <el-form-item label="物料名称" >
                    <el-input placeholder="请输入物料名称" v-model="formData.itemName" style="width: 440px;"></el-input>
                </el-form-item>

                <el-form-item label="规格型号">
                    <el-mention
                        v-model="formData.specification"
                        type="textarea"
                        :options="options"
                        style="width: 440px"
                        placeholder="请输入规格型号"
                        />
                </el-form-item>

                <el-form-item label="单位">
                    <el-select 
                        :disabled="props.mdItemTitle =='查看物料/产品'"
                        v-model="formData.unitOfMeasure" placeholder="请选择单位" style="width: 240px">
                    <el-option
                        v-for="item in UnitTreeData"
                        :key="item.measureName"
                        :label="item.measureName"
                        :value="item.measureCode"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="物料/产品分类">
                    <el-tree-select
                        :disabled="props.mdItemTitle =='查看物料/产品'"
                        v-model="formData.itemTypeId"
                        :data="itemOrProjectData"
                        :props="{value: 'id', label: 'label', children: 'children' }"
                        :render-after-expand="false"
                        style="width: 240px"
                        placeholder="请选择物料/产品分类"
                    />
                    <!-- 高价值/易被盗物品 点击Y，不点击为N-->
                    <el-checkbox v-model="formData.highValue" 
                                 label="高价值/易被盗物品" 
                                 size="large"
                                 :true-label="'Y'"
                                 :false-label="'N'" />

                </el-form-item>
                <div style="display: flex;align-items: center;justify-content: space-between;">
                    <el-form-item label='是否启用'>
                        <div>
                            <el-radio v-model="formData.enableFlag" disabled value="disabled">是</el-radio>
                            <el-radio v-model="formData.enableFlag" disabled value="N">否</el-radio>
                        </div>
                    </el-form-item>

                    <el-form-item label="批次管理">
                        <div>
                        <el-switch
                            :disabled="props.mdItemTitle =='查看物料/产品'"
                            v-model="formData.batchFlag"
                            active-text="是"
                            inactive-text="否"
                            active-value="Y"
                            inactive-value="N"
                            />
                        </div>
                    </el-form-item>

                    <el-form-item label="安全库存">
                        <div>
                            <el-radio-group 
                                :disabled="props.mdItemTitle =='查看物料/产品'"
                                v-model="formData.safeStockFlag">
                            <el-radio value="Y" size="large">是</el-radio>
                            <el-radio value="N" size="large">否</el-radio>
                            </el-radio-group>
                        </div>

                    </el-form-item>
                </div>
                <el-form-item label="备注">
                    <el-mention
                        v-model="formData.remark"
                        type="textarea"
                        :options="options"
                        style="width: 100%"
                        placeholder="请输入内容"
                        />
                </el-form-item>
            </el-form>

            
              <el-tabs v-if="mdItemTitle == '查看物料/产品'" type="border-card" class="demo-tabs">
                <el-tab-pane>
                  <template #label>
                    <span class="custom-tabs-label">
                      <span>BOM组成</span>
                    </span>
                  </template>

                  <el-table :data="tabsTableData">
                    <el-table-column prop="bomItemCode" label="物料编码" />
                    <el-table-column prop="bomItemName" label="物料名称" />
                    <el-table-column prop="bomItemSpec" label="规格" />
                    <el-table-column prop="unitName" label="单位" />
                    <el-table-column prop="quantity" label="使用比例" />
                    <el-table-column prop="remark" label="备注" />
                </el-table>

                </el-tab-pane>
                <el-tab-pane label="批次属性">批次属性</el-tab-pane>
                <el-tab-pane label="替代品">替代品</el-tab-pane>
                <el-tab-pane label="SIP">SIP</el-tab-pane>
                <el-tab-pane label="Task">Task</el-tab-pane>
              </el-tabs>
           

            <template #footer>
                <div class="dialog-footer">
                  <el-button @click="cancel">关闭</el-button>
                  <el-button type="primary" @click="confirm" v-if="props.mdItemTitle =='新增物料/产品' ">
                    确定
                  </el-button>
                  <el-button type="primary" @click="editConfirm" v-if="props.mdItemTitle== '修改物料/产品' ">
                    修改
                  </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
    // 引入接口  getRandomCode  getBarcodeUrl(点击switch触发点另一个调用接口，二维码)
    import { ElMessage } from 'element-plus'
    import {getRandomCode,getBarcodeUrl,submitProjuctData,updateMditem} from '../../api/mainData/mainData.js'
    import { ref,watch} from 'vue'
    import { Calendar } from '@element-plus/icons-vue'


    // 定义switch 自动生成物料编码的switch状态
    const switchValue = ref(false)
    // tabs 是否显示状态
    const tabStatus = ref(true)
    
    // 定义 switch开关点击后  另一个接口需要上传的数据
    const switchRelatedData = ref({
        bussinessId:1,
        bussinessCode:0,
        barcodeFormart:'QR_CODE',
        barcodeType:'ITEM'
    })

    // 单位下拉列表数据
    const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

// 定义：表单数据
    const formData = ref({

        maxStock: 0,
        minStock: 0,
        barcodeUrl:null,
        itemCode:'',      // 物料编码
        itemName:'',      // 物料名称
        specification:'',//规格型号
        unitOfMeasure:'',              //单位
        itemTypeId:'',          // 物料/产品分类
        highValue:'',         //高价值
        enableFlag:'N',            //是否启用
        batchFlag:'',         //批次管理
        safeStockFlag:'',   //安全库存
        remark: "",
    })

    const tabsTableData = ref([])

// 接收父组件 dialogVisible的状态
const props = defineProps({
    dialogVisible:Boolean,
    itemOrProjectData:Array,
    UnitTreeData:Array,
    backshowData:Object,
    mdItemTitle:String,
    bomTableData:Object
})

// 发送子组件的弹窗状态
const emit = defineEmits(['update:dialogVisible','updateParentTable'])
function emitVisibleChange(val) {
    emit('update:dialogVisible', val)
}
// 取消按钮
const cancel=()=>{
    clearData()
    emit('update:dialogVisible', false)
}
// 确定按钮
const confirm=async()=>{    
    // emit('update:dialogVisible', false)
    console.log(formData.value,'formData表单数据');
    
    // console.log(await submitProjuctData(formData.value),'----------提交数据----------');
    try {
        let {code,msg,data } = await submitProjuctData(formData.value)
        if(code == 200){
            ElMessage.success('提交数据'+msg)
            // 保存一份 返回值   这个返回值可以直接拿到作为修改时使用
            let backEditData = ref({})
            backEditData.value = data
            console.log('打印一份提交成功的返回值',backEditData.value);
            
            // 通知父组件刷新  updateParentTable
            emit('updateParentTable')
            clearData()
            emit('update:dialogVisible', false)
        }else{
            ElMessage.error('提交数据'+msg)
            emit('update:dialogVisible', false)
        }
    } catch (error) {
        console.log(error,'提交数据出错');
        emit('update:dialogVisible', false)
        
    }
  
}
// switch点击事件
const switchChange=async()=>{
    console.log('您点击了switch');
    if(switchValue.value == true){
        // 调用获取物料编码的接口
        console.log('调用物料编码接口');
        formData.value.itemCode =  await getRandomCode()
        // 另一个触发接口  二维码
        switchRelatedData.value.bussinessCode = formData.value.itemCode
        console.log(await getBarcodeUrl(switchRelatedData.value),'QRCode');
        

    }else{
        // 不生成，清空
        formData.value.itemCode = '';
    }
}

// 确认修改
const editConfirm=async()=>{
    // emit('update:dialogVisible', false)
    console.log(formData.value,'formData修改前的数据');
    try {
        let {code,msg,data } = await updateMditem(formData.value)
        if(code == 200){
            console.log(data,'----------修改数据----------');
            
            ElMessage.success('修改数据'+msg)
            // 通知父组件刷新  updateParentTable
            emit('updateParentTable')
            clearData()
            emit('update:dialogVisible', false)
        }else{
            ElMessage.error('修改数据'+msg)
            emit('update:dialogVisible', false)
        }
    } catch (error) {
        console.log(error,'修改数据出错');
        emit('update:dialogVisible', false)
        
    }
 
}

const clearData = ()=>{
    formData.value = {
        maxStock: 0,
        minStock: 0,
        barcodeUrl:null,
        itemCode:'',
        itemName:'',
        specification:'',
        unitOfMeasure:'',
        itemTypeId:'',
        highValue:'',
        enableFlag:'N',
        batchFlag:'',
        safeStockFlag:'',
        remark: "",
    }
}
watch(() => props.backshowData, (newVal, oldVal) => {
    if(newVal!= oldVal){
        formData.value = newVal
    }
})
watch(()=>props.bomTableData,(newVal,oldVal)=>{
    if(newVal){
        tabsTableData.value = newVal
    }
})



</script>
<style setup>
    .titleClass{
        display: flex;
        justify-content: center;
        border-bottom: 1px solid ;
    }
    .demo-tabs > .el-tabs__content {
      padding: 32px;
      color: #6b778c;
      font-size: 32px;
      font-weight: 600;
    }
    .demo-tabs .custom-tabs-label .el-icon {
      vertical-align: middle;
    }
    .demo-tabs .custom-tabs-label span {
      vertical-align: middle;
      margin-left: 4px;
    }

</style>