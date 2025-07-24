<template>
    <div class="itemTpye">
        <myInput
            :inputConfigs=inputConfigs
            @searchInputData="searchItemTypeData"
            @clearSearchData="resetData"
            >
            <template #enableFlag>
                <el-select v-model="searchData.enableFlag" 
                           placeholder="请选择是或否" 
                           style="width: 240px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                </el-select>
            </template>

        </myInput>

        <itemtypeTable
            :treeData="treeData"
            :tableSetting="tableSetting"
        >
        <template #itemOrProduct='{scoped}'>    
            {{ scoped.itemOrProduct === "ITEM" ? '物料':"产品"}}
        </template>
        
        <template #enableFlag="{scoped}">
            <el-tag :type="scoped.enableFlag == 'Y' ? 'primary' :'danger'  ">
                {{ scoped.enableFlag == 'Y' ? '是' :'否'  }}
            </el-tag>
        </template>

        <template #operation="{scoped}">
            <div>
            <el-button 
                 link
                 size="small"
                 type="primary"
                 icon="EditPen" 
                 @click='editItem(scoped)'
                >修改</el-button>
            <el-button
                 link
                 size="small"
                 type="primary"
                 icon="Plus" 
                 @click="addItem(scoped)"
                >新增</el-button>

            <el-button
                v-if="!scoped.children || scoped.children.length === 0"
                link
                size="small"
                type="primary"
                icon="Delete" 
                @click="deleteItem(scoped)"
            >删除</el-button>
            </div>
        </template>
        </itemtypeTable>

        <!-- 删除弹窗 -->
        <el-dialog
            width="400"
            v-model="delDialogVisible">
            <span>是否删除名称为:"{{ delName }}"的分类？</span>
            <template #footer>
            <div>
                <el-button @click="delDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </div>
            </template>
        </el-dialog>

        <!-- 新增弹窗 -->
         <ItemTypeDialog
            v-model:addDialogVisible="addDialogVisible"
            :dialogTitle="dialogTitle"
            :parentTitleId="parentTitleId"
            @emitAddData="addItemTyleData"
            :backShowData="backShowData"
            @emitEditData="updateItemTyleData"
            >
         </ItemTypeDialog>
    </div>
</template>
<script setup>
// 引入接口
import { getItemTypeTableData,searchItemType,deleteItemTypeData,submitItemTypeData,getItemTypeDataById,submitEditItemTypeData} from '@/api/mainData/mainData.js'
import { ElMessage } from 'element-plus'
import itemtypeTable from '@/components/itemtypeTable/itemtypeTable.vue'

import myInput from '@/components/MyInput/myInput.vue'
import ItemTypeDialog from '@/components/ItemTypeDialog/ItemTypeDialog.vue'

// 定义table数据
const itemTypeData = ref([])

// 定时table结构
const tableSetting = ref([
    {
        label:'分类',
        prop: 'itemTypeName',
    },
    {
        label:'排序',
        prop:'orderNum'
    },
    {
        label:'物料/产品',
        prop:'itemOrProduct',
        slotStatus:true
    },
    {
        label:'是否启用',
        prop:'enableFlag',
        slotStatus:true
    },
    {
        label:'创建时间',
        prop:'createTime'
    },
    {
        label:'操作',
        prop:'operation',
        slotStatus:true
    }
])

// 定义input结构
const inputConfigs = ref([
    {
        label:'分类名称',
        prop:'itemTypeName',
        placeholder:'请输入分类名称',
    },
    {
        label:'是否启用',
        placeholder:'选择是或否',
        prop:'enableFlag',
        slotStatus:true,
    }
])

// 定义select选项
const options = ref([
    { value: 'Y', label: '是' },
    { value: 'N', label: '否' },
])

// 要搜索的数据
const searchData = ref({
    itemTypeName:'',
    enableFlag:''
})

 // 定义treeData
 let treeData = ref([])
 
//  定义弹窗状态  删除弹窗
const delDialogVisible = ref(false)

// 获取要删除的名称
const delName = ref('')
// 要删除的数据的id
const delId = ref('')

// 弹窗标题  （新增/修改）
const dialogTitle = ref('')

// 定义弹窗  新增弹窗状态
const addDialogVisible = ref(false)

// 定义 获取父分类 的标题、id  然后传递给子组件
const parentTitleId = ref({
    title: '',
    id: ''
})

// 数据回显  传递给子组件
const backShowData = ref({})


// 获取table数据
const getItemTypeData = async () => {
    try {
        // console.log(await getItemTypeTableData(),'获取table数据');
        let { code, data, msg } = await getItemTypeTableData()
        if (code === 200) {
            ElMessage.success('物料产品分类' + msg)
            itemTypeData.value = data
            // console.log(itemTypeData.value,'获取table数据');
            treeData.value = buildTree(itemTypeData.value)
            // console.log(treeData.value,'treeData父');
            
            
        } else {
            ElMessage.error('物料产品分类' + msg)
        }

    } catch (error) {
        console.log(error, 'error in getItemTypeData()');

    }
}

getItemTypeData()


// 将获取的数据（扁平数据）处理为树形数据
function buildTree(data) {
    const map = {};
    const result = [];
    data.forEach(item => {
        map[item.itemTypeId] = { ...item, children: [] };
    });
    data.forEach(item => {
        const parent = map[item.parentTypeId];
        if (parent) {
            parent.children.push(map[item.itemTypeId]);
        } else {
            result.push(map[item.itemTypeId]);
        }
    });
    return result;
}

// 修改
const editItem=async(data)=>{
    // console.log('要修改数据的id',id);
    // editId.value = id
    // 打开弹窗
    addDialogVisible.value = true
    dialogTitle.value = '修改分类'

    parentTitleId.value.id =  data.itemTypeId
    parentTitleId.value.title =  data.itemTypeName

    try {
        // 根据id搜索对应的数据
    let {code,msg,data} = await getItemTypeDataById(parentTitleId.value.id)
    if(code == 200){
        backShowData.value = data
        ElMessage.success(parentTitleId.value.title+'对应的数据搜索'+msg)
        // console.log(backShowData.value);
        
    }else{
        ElMessage.error(msg)
    }
    } catch (error) {
        console.log(error,'error in deleteItem()');
        
    }
    
    
    
}
// 删除  打开弹窗
const deleteItem=(data)=>{
    // console.log('要删除的data',data);
    delId.value = data.itemTypeId    
    delName.value = data.itemTypeName  
    delDialogVisible.value = true
}
// 确定删除
const confirmDelete=async()=>{
    // console.log(await deleteItemTypeData(delId.value));
    try {
        let {code,data,msg} = await deleteItemTypeData(delId.value)
        if(code == 200){
            ElMessage.success('物料产品分类删除' + msg)
            delDialogVisible.value = false
            getItemTypeData() // 重新获取数据
        }else{
            ElMessage.error('物料产品分类删除' + msg)
            delDialogVisible.value = false
        }
    } catch (error) {
        console.log(error,'error in confirmDelete()');
        delDialogVisible.value = false
    }
    
}

// 新增
const addItem = async(data)=>{
    dialogTitle.value = '添加分类'
    addDialogVisible.value = true

    // console.log(data,'该项的data' );
    parentTitleId.value.id =  data.itemTypeId
    parentTitleId.value.title =  data.itemTypeName
    // console.log(parentTitleId.value,'该项的id,title');
}

// 搜索数据
const searchItemTypeData=async(data)=>{
    console.log('父组件收到子组件传递的input数据',data);
    searchData.value.itemTypeName = data.itemTypeName;
    console.log('要搜索的数据',searchData.value);
    // 调用请求
    try {
        // console.log(await searchItemType(searchData.value),'搜索数据');
        let {code,data,msg} = await searchItemType(searchData.value)
        if(code == 200){
            ElMessage.success('物料产品分类搜索' + msg)
            treeData.value = buildTree(data)
            // 清空下拉列表 因为下拉列表是在父组件写的，子组件无法清除
            searchData.value.enableFlag = ''
        }
    } catch (error) {
        console.log(error,'error in searchItemTypeData()');
        
    }
}

// 提交  新增数据
const addItemTyleData=async(data)=>{
    console.log('子组件传递过来的数据',data);
    console.log(await submitItemTypeData(data),'提交的数据的结果');
    getItemTypeData()
}

// 提交  修改的数据
const updateItemTyleData=async(data)=>{
    console.log(data);
    
    console.log(await submitEditItemTypeData(data),'提交的数据的结果');
    getItemTypeData()
}
// 重置数据
const resetData=()=>{
     getItemTypeData()
}

</script>
<style scoped>
.itemTpye{
    padding: 20px;
}

</style>