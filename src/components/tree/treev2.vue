<template>
  <div style="display: flex;flex-direction: column;">
  <el-input
     style="width: 240px" 
     placeholder="请输入分类名称"
     clearable
     :prefix-icon="Search"
     v-model="searchInput"
     @input="searchTreeData"
  ></el-input>
    <el-tree
    style="max-width: 250px;margin-top: 15px;"
    :data="localTreeData"
    :props="{id: 'id', label: 'label', children: 'children'}"
    :height="208"
    default-expand-all
    @node-click="handleNodeClick"
    :expand-on-click-node=false
  />
  </div>
</template>
<script setup>
// import { Search } from '@element-plus/icons-vue'
import { onMounted,watch} from 'vue';

// 搜索框
let searchInput = ref('');
// 创建本地副本渲染数据
let localTreeData = ref([]);
// 保存原始数据副本
let originTreeData = ref([]);
// 保存用户点击tree某一项的id
let treeId = ref(0)

  // 接收父组件传递的数据 树形数据
  let props= defineProps({
    treeData:{
      type: Array,
      default: () => []
    }
  })
  
const emit = defineEmits(['getTreeData'])

// 监听数据变化
watch(
  ()=>props.treeData,
  (newVal)=>{
    localTreeData.value = [...newVal];
    originTreeData.value =deepClone(newVal);// 保存原始数据副本
  },
  {immediate: true}
)

// 自定义方法     递归过滤树结构    自定义深拷贝函数
// 递归过滤树结构
const filterTree = (tree, keyword) => {
  const filtered = []

  for (const node of tree) {
    const newNode = { ...node }

    if (newNode.children) {
      newNode.children = filterTree(newNode.children, keyword)
    }
    const isMatch = newNode.label.includes(keyword)
    const hasChildren = newNode.children && newNode.children.length > 0

    if (isMatch || hasChildren) {
      filtered.push(newNode)
    }
  }
  return filtered
}
// 自定义深拷贝
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}


// tree上方搜索框
  const searchTreeData=()=>{
    console.log('搜索框触发了');
     setTimeout(() => {
    const keyword = searchInput.value.trim()

    if (keyword === '') {
      // 还原原始数据
      localTreeData.value = [...originTreeData.value]
    } else {
      // 递归过滤
      localTreeData.value = filterTree(originTreeData.value, keyword)
    }
  }, 100)

    
  }
// tree每一项点击事件
const handleNodeClick=(data,node,component)=>{
  console.log('点击的节点数据：', data)
  console.log('该项的id为(子):',data.id);
  treeId.value = data.id
  // console.log('节点本身：', node)
  // console.log('整个组件：', component)
  // 通知父组件 向父组件传递treeId
  emit('getTreeData',treeId.value)

}


  onMounted(()=>{
    
  })

</script>
<style scoped>

</style>