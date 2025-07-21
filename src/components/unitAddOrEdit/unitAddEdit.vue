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
        <el-form
            ref="fromRef"
            :model="ruleForm"
            :rules="rules"
            label-width="auto"
            >
            <el-form-item label="单位编码" prop="unitCode">
                <el-input v-model="ruleForm.unitCode"></el-input>
            </el-form-item>  
            
            <el-form-item label="单位名称" prop="unitName">
                <el-input v-model="ruleForm.unitName"></el-input>
            </el-form-item>

            <el-form-item label="是否是主单位" prop="isMainUnit" >
                <el-radio-group v-model="ruleForm.isMainUnit">
                    <el-radio value="Y">是</el-radio>
                    <el-radio value="N">否</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="主单位" prop="placeChooseUnit" v-show="ruleForm.isMainUnit == 'N'">
                <el-select v-model="ruleForm.placeChooseUnit" placeholder="请选择主单位">
                    <el-option v-for="item in mainUnit" :label="item.measureName" :value="item.measureId" />
                </el-select>
            </el-form-item>

            <el-form-item label="与主单位换算比例" prop="ratio" v-show="ruleForm.isMainUnit == 'N'">
                <el-input-number v-model="ruleForm.mainUnitRate" :step="1"/>
            </el-form-item>

            <el-form-item label="是否启用" prop="isEnable">
                <el-radio-group v-model="ruleForm.isEnable">
                    <el-radio value="Y">是</el-radio>
                    <el-radio value="N">否</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input  v-model="ruleForm.remark" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div>
                <el-button @click="cancel">关闭</el-button>
                <el-button v-if="popwindowTitle=='添加单位'" type="primary" @click="confirm">
                确定
                </el-button>

                <el-button v-else-if="popwindowTitle = '修改' " type="primary" @click="editForm">修改</el-button>
                </div>
        </template>
    </el-dialog>
</div>
</template>
<script setup>
import { ref } from 'vue'

    // 定义表单数据
      const ruleForm = ref({
          unitCode: '',// 单位编码
          unitName: '',// 单位名称
          isMainUnit: 1,// 是否是主单位
          measureId:null,
          placeChooseUnit: '',// 选择主单位   上传时对应primaryId
          mainUnitRate: 1,// 与主单位换算比例
          isEnable: 1,// 是否启用
          remark:''// 备注
        })
    
    // 定义表单规则
    const rules = reactive({
    unitCode: [
      { required: true, message: '请输入单位编码', trigger: 'blur' },
      { min: 3, max: 5, message: '长度应为3到5个字符', trigger: 'blur' },
    ],
    unitName: [
      { required: true, message: '请输入单位编码', trigger: 'blur' },
      { min: 3, max: 5, message: '长度应为3到5个字符', trigger: 'blur' },
    ],
    placeChooseUnit: [
      {
        required: true,
        message: '请选择主单位',
        trigger: 'change',
      },
    ],
    isMainUnit: [
      {
        required: true,
        message: '请选择是否为主单位',
        trigger: 'change',
      },
    ],
    remark: [
      { required: true, message: '请输入备注', trigger: 'blur' },
    ],
    mainUnitRate: [
      { required: true, message: '请输入换算比例', trigger: 'blur' }
    ]
  })

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
        mainUnit:{
            type:Array,
            default: () => []
        },
        getUnitIdData:{
            type: Object,
            default: () => {}
        }


    })

    // 发送子组件的弹窗状态
    const emit = defineEmits(['update:popwindowStatus','emitVisibleChange','emitFromData'])
    function emitVisibleChange(val) {
        emit('update:popwindowStatus', val)
    }

    // 取消按钮
    const cancel = () => {
        emit('update:popwindowStatus', false)
    }
    // 提交确定按钮
    const confirm = () => {
        // 打印表单数据
        console.log(ruleForm.value,'ruleForm.value')
        emit('update:popwindowStatus', false)
        emit('emitFromData',ruleForm.value)
        // 在子组件清空数据
        clear()
    }
    // 清空数据
    const clear=()=>{
        ruleForm.value = {
            unitCode: '',
            unitName: '',
            isMainUnit: 1,
            measureId:null,
            placeChooseUnit: '',
            mainUnitRate: 1,
            isEnable: 1,
            remark:''
        }
    }
    // 修改确定（修改）按钮
    const editForm =()=>{
        // 打印最新的表单
        console.log(ruleForm.value,'ruleForm.value')
        emit('update:popwindowStatus', false)
        emit('emitEditFromData',ruleForm.value)
        // // 在子组件清空数据
        clear()
    }

    // 监听getUnitIdData数据变化，如果变化复制给ruleForm
    watch(() => prop.getUnitIdData, (newVal, oldVal) => {
        if (newVal) {
            console.log(newVal,'newVal');
            ruleForm.value.unitCode = newVal.measureCode;
            ruleForm.value.unitName = newVal.measureName;
            ruleForm.value.isMainUnit = newVal.primaryFlag;
            ruleForm.value.measureId = newVal.measureId;
            ruleForm.value.placeChooseUnit = newVal.primaryId;
            ruleForm.value.mainUnitRate = newVal.changeRate;
            ruleForm.value.isEnable = newVal.enableFlag;
            ruleForm.value.remark = newVal.remark;
        }
    })

</script>
<style scoped>


</style>