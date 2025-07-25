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
    :props="treeProps"
    :height="208"
    default-expand-all
    @node-click="handleNodeClick"
    :expand-on-click-node=false
  />
  </div>
</template>
<script setup>
// import { Search } from '@element-plus/icons-vue'
import { computed } from 'vue';
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

    // 使用 props 中配置的 label 字段
    const labelField = treeProps.value.label
    const nodeLabel = newNode[labelField] ?? ''

    const isMatch = nodeLabel.includes(keyword)
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
const handleNodeClick = (data, node, component) => {
  console.log('点击的节点数据：', data)

  const idField = treeProps.value.id
  const currentId = data[idField]

  console.log('该项的id为(子):', currentId)

  treeId.value = currentId

  // 通知父组件 向父组件传递 treeId
  emit('getTreeData', treeId.value)
}



const treeProps = computed(() => {
  const sample = props.treeData?.[0] || {};
  const useCustomProps =
    'machineryTypeId' in sample && 'machineryTypeName' in sample;

  return useCustomProps
    ? { id: 'machineryTypeId', label: 'machineryTypeName', children: 'children' }
    : { id: 'id', label: 'label', children: 'children' };
});

  onMounted(()=>{
    
  })

</script>
<style scoped>

</style>