<template>
    <div>
        <el-form :inline="true">
            <el-form-item
                v-for="item in inputConfigs"
                :key="item.prop"
                :label="item.label">

                 <!-- 如果需要插槽渲染，则渲染插槽 -->
                <template v-if="item.slotStatus">
                    <slot :name="item.prop" ></slot>
                </template>
                  <el-input    
                    v-else    
                  
                    :placeholder="item.placeholder"
                    v-model="inputForm[item.prop]"
                />
                

            </el-form-item>

            
              <!-- <template #default='scope' v-if="item.slotStatus">
                    <slot :name="item.prop" :scoped="scope.row"></slot>
                </template> -->

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

const inputForm = ref({})

// 定义向父组件发送数据  重置数据
const emit = defineEmits(['searchInputData','clearSearchData'])

// 子组件接受数据
// 接收配置项
const props = defineProps({
  inputConfigs: {
    type: Array,
    default: () => []
  }
})




// // 给input绑定
// let inputFrom = ref({
//     materialCode: '',
//     materialName: ''
// })

// 搜索按钮  
const handleSearch=()=>{
    // // 执行查询操作
    console.log(inputForm.value,'文本框中的内容')
    // 通知父组件 父组件接收到
    emit('searchInputData',inputForm.value)
    // 清空数据
    clearData()
}
// 重置按钮
const handleReset=()=>{
    props.inputConfigs.forEach(config => {
    inputForm[config.prop] = ''
    })
    // 通知父组件 重置   这里没有传递数据，让父组件清空搜索的数据然后再请求一下就行
    emit('clearSearchData')
}
// 清空数据
// const clearData=()=>{
//     inputFrom.value = {
//         materialCode: '',
//         materialName: ''
//     }
// }
const clearData=()=>{
  const form = {}
  props.inputConfigs.forEach(config => {
    form[config.prop] = ''
  })
  inputForm.value = form
}

// 使用watch监听props.inputConfigs初始化字段
watch(
  () => props.inputConfigs,
  (newConfigs) => {
    const form = {}
    newConfigs.forEach(config => {
      // 只提交非插槽的字段,插槽的字段数值在父组件中得到
      if(!config.slotStatus){
         form[config.prop] = ''
      }
    })
    inputForm.value = form
  },
  { immediate: true } // 页面加载时立即执行
)



</script>
<style setup>

</style>