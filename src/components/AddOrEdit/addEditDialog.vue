<template>
    <div>
        <el-dialog 
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            :model-value="dialogVisible"
            @update:dialogVisible="emitVisibleChange"
            >
            <template #header>
                <div class="titleClass"><h3><b>新增物料/产品</b></h3></div>
            </template>
            <el-form style="padding:20px 30px 0 30px ;">
                <el-form-item label="物料编码" >
                    <el-input placeholder="请输入物料编码" 
                              style="width: 240px;"
                              v-model="formData.materialCode"
                              ></el-input>
                    <el-switch v-model="switchValue"  
                               active-text="自动生成"
                               @change="switchChange"></el-switch>
                </el-form-item>

                <el-form-item label="物料名称" >
                    <el-input placeholder="请输入物料名称" v-model="formData.materialName" style="width: 440px;"></el-input>
                </el-form-item>

                <el-form-item label="规格型号">
                    <el-mention
                        v-model="formData.specificationModel"
                        type="textarea"
                        :options="options"
                        style="width: 440px"
                        placeholder="请输入规格型号"
                        />
                </el-form-item>

                <el-form-item label="单位">
                    <el-select v-model="formData.unit" placeholder="请选择单位" style="width: 240px">
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
                        v-model="formData.category"
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
                            <el-radio v-model="formData.enable" disabled value="disabled">是</el-radio>
                            <el-radio v-model="formData.enable" disabled value="N">否</el-radio>
                        </div>
                    </el-form-item>

                    <el-form-item label="批次管理">
                        <div>
                        <el-switch
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
                            <el-radio-group v-model="formData.safeStockFlag">
                            <el-radio value="Y" size="large">是</el-radio>
                            <el-radio value="N" size="large">否</el-radio>
                            </el-radio-group>
                        </div>

                    </el-form-item>
                </div>
                <el-form-item label="备注">
                    <el-mention
                        v-model="formData.notes"
                        type="textarea"
                        :options="options"
                        style="width: 100%"
                        placeholder="请输入内容"
                        />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                  <el-button @click="cancel">关闭</el-button>
                  <el-button type="primary" @click="confirm">
                    确定
                  </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
    // 引入接口  getRandomCode  getBarcodeUrl(点击switch触发点另一个调用接口，二维码)
    import { ElMessage } from 'element-plus'
    import {getRandomCode,getBarcodeUrl,submitProjuctData} from '../../api/mainData/mainData.js'
    import { ref,watch} from 'vue'
    // 定义switch 自动生成物料编码的switch状态
    const switchValue = ref(false)
    
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

        materialCode:'',      // 物料编码
        materialName:'',      // 物料名称
        specificationModel:'',//规格型号
        unit:'',              //单位
        category:'',          // 物料/产品分类
        highValue:'',         //高价值
        enable:'N',            //是否启用
        batchFlag:'',         //批次管理
        safeStockFlag:'',   //安全库存
        notes:'',             //备注
    })

// 接收父组件 dialogVisible的状态
const props = defineProps({
    dialogVisible:Boolean,
    itemOrProjectData:Array,
    UnitTreeData:Array
})

// 发送子组件的弹窗状态
const emit = defineEmits(['update:dialogVisible','updateParentTable'])
function emitVisibleChange(val) {
    emit('update:dialogVisible', val)
}
// 取消按钮
const cancel=()=>{
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
        }
    } catch (error) {
        
    }
  
}
// switch点击事件
const switchChange=async()=>{
    console.log('您点击了switch');
    if(switchValue.value == true){
        // 调用获取物料编码的接口
        console.log('调用物料编码接口');
        formData.value.materialCode =  await getRandomCode()
        // 另一个触发接口  二维码
        switchRelatedData.value.bussinessCode = formData.value.materialCode
        console.log(await getBarcodeUrl(switchRelatedData.value),'QRCode');
        

    }else{
        // 不生成，清空
        formData.value.materialCode = '';
    }
}



</script>
<style setup>
    .titleClass{
        display: flex;
        justify-content: center;
        border-bottom: 1px solid ;
    }

</style>