<template>
    <div>
        <el-table 
                 :data="tableData" 
                 style="width: 100%;height: 600px;"
                 @selection-change="handleSelectionChange">
            <el-table-column type="selection" 
                             width="55" ></el-table-column>
                             <!-- :selectable="selectable" -->
            <el-table-column v-for="item in tableSetting" 
                             :key="item.label" 
                             :prop="item.prop" 
                             :label="item.label"
                             :width="item.width">
                <template #default="scope" v-if="item.slotStatus">
                    <slot :name="item.prop" :scoped="scope.row"></slot>
                </template>

                <!-- <template #default="scope" v-if="item.slotStatus">
                    <slot :name="tableOperate" :scoped="scope.row"></slot>
                </template> -->
            </el-table-column>      
        </el-table>
        <!-- 分页器 -->
         <div class="pagination-div">
            <el-pagination
                :page-sizes="[5, 10, 20, 50]"
                 background
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
            />
         </div>
    </div>
</template>
<script setup>

     let currentPage = ref(1)
     let pageSize = ref(10)
    //  定义要删除的数组
    let deleteArr = ref([]);
    // 接收表格数据
    const props = defineProps({
        tableData: {
            type: Array,
            default:()=> []
        },
        tableTotal:{
            type: Number,
            default:0
        },
        // 表头数据
        tableSetting:{
            type: Array,
            default:()=> []
        }
    })

    // 分页器相关
    const emit = defineEmits(['updateSize','updateCurrentPage'])
    const handleSizeChange = (val) => {
        console.log(`${val} items per page`)
         pageSize.value = val
        // 父组件更新数据
        emit('updateSize',val)
    }
    const handleCurrentChange = (val) => {
        console.log(`current page: ${val}`)
        currentPage.value = val
        emit('updateCurrentPage',val)
    }

    // 复选框  选中项 发生变化时，获取选中行
    const handleSelectionChange=(val)=>{
        // 这里需要判断，如果数据中标题：物料编码，则执行下面这句，
        // 如果为单位编码，则执行measureId
        if(props.tableSetting[0].prop === 'itemCode'){
            deleteArr.value = val.map(item=>item.itemId)
        }else if(props.tableSetting[0].prop === 'measureCode'){
            deleteArr.value = val.map(item=>item.measureId)
        }
        console.log(deleteArr.value,'要删除的数组');

        // deleteArr.value = val.map(item=>item.itemId)
        // console.log(deleteArr.value,'要删除的数组');

    }
    // 将要删除的id暴露给父组件
    defineExpose({
        deleteArr
    })

</script>
<style scoped>
    .pagination-div{
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
</style>