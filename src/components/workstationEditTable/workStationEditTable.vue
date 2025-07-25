<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
                <el-table-column v-for="item in tableSetting" 
                             :key="item.label" 
                             :prop="item.prop" 
                             :label="item.label"
                             :width="item.width">
                <template #default="scope" v-if="item.slotStatus">
                    <slot :name="item.prop" :scoped="scope.row"></slot>
                </template>
            </el-table-column>   
        </el-table>
    </div>
</template>
<script setup>
const props = defineProps({
        tableData: {
            type: Array,
            default:()=> []
        },
        // 表头数据
        tableSetting:{
            type: Array,
            default:()=> []
        }
    })


</script>
<style scoped>


</style>