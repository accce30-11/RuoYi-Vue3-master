<template>
<div>
    <el-button
        :icon="Sort"
        @click="changeTableExpandStatus"
        >
        展开/折叠</el-button>

    <el-table
            ref="tableRef"
            :data="treeData"
            style="width: 100%;"
            row-key="itemTypeId"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
        <el-table-column 
                v-for="item in tableSetting"
                :key="item.label"
                :prop="item.prop" 
                :label="item.label" >  
            <template #default="scope" v-if="item.slotStatus">
                <slot :name="item.prop" :scoped="scope.row"></slot>
            </template>
        </el-table-column> 
    </el-table>
</div>
</template>
<script setup>
import { Sort } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { nextTick } from 'vue';

    const prop = defineProps({
        treeData:{
            type: Array,
            default: () => []
        },
        tableSetting:{
            type: Array,
            default: () => ([])
        }
    })

    let tableRef = ref(null)
    let tableExpandStatus = ref(true)

    // 按钮切换 changeTableExpandStatus 
    const changeTableExpandStatus=()=>{
        // 取反
        tableExpandStatus.value =!tableExpandStatus.value
        // nextTick 保证 DOM 已更新 等待dom更新完成后在操作表哥
        nextTick(()=>{
            expandOrCollapseTable(prop.treeData, tableExpandStatus.value)
        })
        
    }
    const expandOrCollapseTable=(data,expand)=>{
        data.forEach((row)=>{
            // 控制当前行的展开或收起  toggleRowExpansion是elementPlus提供的api
            // 用于控制每一行的展开状态
            tableRef.value.toggleRowExpansion(row, expand)
            // 如果该行还有子节点，递归处理
            if(row.children && row.children.length>0){
                expandOrCollapseTable(row.children, expand)
            }
        })
    }



</script>
<style scoped>



</style>