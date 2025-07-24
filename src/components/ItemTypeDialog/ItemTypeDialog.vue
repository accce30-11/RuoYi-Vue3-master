<template>
    <div>
        <el-dialog
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            :title="dialogTitle"
            :model-value="addDialogVisible"
            @update:addDialogVisible="emitVisibleChange">

            <el-form 
                ref="myItemTypeForm">
                <el-form-item label="父分类">
                     <el-select  disabled :placeholder="parentTitleId.title" style="width: 240px">
                    </el-select>
                </el-form-item>
                <div style="display: flex;">
                    <el-form-item label="分类名称">
                        <el-input v-model="submitData.itemTypeName" placeholder="请输入分类名称"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-left: 20px;" label='显示排序'>
                         <el-input-number
                              v-model="submitData.orderNum" 
                              :min="0"
                              controls-position="right"
                            />
                    </el-form-item>
                </div>
                <div style="display: flex;">
                    <el-form-item label="物料/产品">
                        <el-radio-group v-model="submitData.itemOrProduct">
                            <el-radio value="ITEM" >物料</el-radio>
                            <el-radio value="PRODUCT" >产品</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="启用状态" style="margin-left: 30px;">
                        <el-radio-group v-model="submitData.enableFlag">
                            <el-radio value="Y" >是</el-radio>
                            <el-radio value="N">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>

            <template #footer>
                <div>
                    <el-button v-if="dialogTitle == '添加分类'" type="primary" @click="addData">添加</el-button>
                    <el-button v-else @click="editData">修改</el-button>
                    <el-button @click='cancel'>取消</el-button>
                </div>
                
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref } from 'vue'

// 提交的数据
const submitData = ref({
    parentTypeId: 0,
    orderNum: 0,
    itemTypeName: '',
    itemOrProduct: '',
    enableFlag:'Y'
})

const myItemTypeForm = ref(null)

const prop = defineProps({
    dialogTitle:{
        type:String,
        default:()=>''
    },
    addDialogVisible:{
        type:Boolean,
        default:()=>'false'
    },
    // 父组件传递的title和id
    parentTitleId:{
        type:Object,
        default:()=>{}
    },
    backShowData:{
        type:Object,
        default:()=>{}
    }

})

const emit = defineEmits(['emitVisibleChange','update:addDialogVisible','emitAddData','emitEditData'])
function emitVisibleChange(val){
    emit('update:addDialogVisible',val)
}

// 添加数据
const addData = ()=>{
    submitData.value.parentTypeId = prop.parentTitleId.id;
    // console.log(submitData.value,'addData');
    emit('emitAddData',submitData.value)
    clearForm()   //这里手动清空了。上面的log打印输出会导致为空
    emit('update:addDialogVisible',false)
    
}

// 修改数据
const editData=()=>{
    console.log(prop.parentTitleId);
    
    // if(prop.parentTitleId.children.length > 0){
    //     submitData.value.parentTypeId = prop.parentTitleId.id;  
    // }else{
    //     submitData.value.parentTypeId = 0;  // 如果没有子类，就让父类id为0
    // }
    // submitData.value.parentTypeId = prop.parentTitleId.id;  
    // console.log( prop.parentTitleId.id,'prop.parentTitleId.id');
    
    // console.log(submitData.value,'找Id');
      
    emit('emitEditData',submitData.value)
    // clearForm()
    emit('update:addDialogVisible',false)
}

// 取消
const cancel=()=>{

    emit('update:addDialogVisible',false)
}

// 清空表单
const clearForm = ()=>{
    submitData.value.parentTypeId = 0;
    submitData.value.orderNum = 0;
    submitData.value.itemTypeName = '';
    submitData.value.itemOrProduct = '';
    submitData.value.enableFlag = 'Y';
}
// 监听 父组件传递的数据  数据回显
watch(()=>prop.backShowData,(newVal)=>{
    // submitData.value.parentTypeId = newVal.parentTypeId;
    // submitData.value.orderNum = newVal.orderNum;
    // submitData.value.itemTypeName = newVal.itemTypeName;
    // submitData.value.itemOrProduct = newVal.itemOrProduct;
    // submitData.value.enableFlag = newVal.enableFlag;
    submitData.value = newVal
},{immediate:true})

</script>
<style scoped>


</style>