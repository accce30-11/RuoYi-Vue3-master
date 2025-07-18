<template>
    <div>
        <el-form :inline="true">
            <el-form-item label="物料编码">
                <el-input
                    placeholder="请输入物料编码"
                    v-model="inputFrom.materialCode"
                ></el-input>
            </el-form-item>

            <el-form-item label="物料名称">
                <el-input 
                     placeholder="请输入物料名称"
                     v-model="inputFrom.materialName"
                 ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button :icon="Search" 
                           type="primary"
                           @click="handleSearch"
                           >搜索</el-button>
                <el-button :icon="Refresh"
                           @click="handleReset"
                           >重置</el-button>
            </el-form-item>
          
        </el-form>
    </div>
</template>
<script setup>
import { Refresh, Search } from '@element-plus/icons-vue'

// 定义向父组件发送数据  重置数据
const emit = defineEmits(['searchInputData','clearSearchData'])

// 给input绑定
let inputFrom = ref({
    materialCode: '',
    materialName: ''
})

// 搜索按钮  
const handleSearch=()=>{
    // 执行查询操作
    console.log(inputFrom.value,'文本框中的内容')
    // 通知父组件 父组件接收到
    emit('searchInputData',inputFrom.value)
    // 清空数据
    clearData()
}
// 重置按钮
const handleReset=()=>{
    clearData()
    // 通知父组件 重置   这里没有传递数据，让父组件清空搜索的数据然后再请求一下就行
    emit('clearSearchData')
}
// 清空数据
const clearData=()=>{
    inputFrom.value = {
        materialCode: '',
        materialName: ''
    }
}


</script>
<style setup>

</style>