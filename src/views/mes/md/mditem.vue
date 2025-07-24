<template>
    <div class="mditem">
        <!-- 左侧树形 -->
        <div>
            <treev2 
                :treeData="treeData"
                @getTreeData="getTreeTableData">
            </treev2>
        </div>

        <div>
            <div class="input-div">
                <!-- 上方搜索框 -->
                <myInput
                    @searchInputData='getSearchData'
                    @clearSearchData="resetSearchData"
                    :inputConfigs="inputConfigs"
                ></myInput>
            </div>
            <div class="color-button">
                <el-button type="primary" 
                           icon="Plus" 
                           plain
                           @click="addNew"
                           >新增</el-button>
                <el-button type="success" 
                           icon="EditPen" 
                           plain
                           :disabled="mytable?.deleteArr.length == 1 ?false:true"
                           >修改</el-button>
                <el-button type="danger" 
                           icon="Delete" 
                           plain 
                           @click="delAll"
                           :disabled="mytable?.deleteArr.length == 0 ? true:false"
                           >删除</el-button>
                            <!--  -->
                <el-button type="info" icon="Upload" plain>导入</el-button>
                <el-button type="warning" icon="Download" plain>导出</el-button>
            </div>
            <div class="my-table">
                <!-- 右侧表格 -->
                <myTable  ref="mytable" 
                          :tableData="tableData"
                          :tableSetting="tableSetting"
                          :tableTotal="tableTotal"
                          @updateSize="updateSize" 
                          @updateCurrentPage="updateCurrentPage">
                          <!-- 物料编码 -->
                        <template #itemCode="{ scoped }">
                            <el-button
                              type="primary"
                              link>
                            {{ scoped.itemCode}}
                            </el-button>
                        </template>

                        <!-- 物料/产品 -->
                        <template #itemOrProduct='{scoped}'>
                            {{ scoped.itemOrProduct === "ITEM" ? '物料':"产品"}}
                        </template>

                        <!-- 是否启用 -->
                        <template #enableFlag="{scoped}">
                            <el-switch
                                :model-value=" scoped.enableFlag === 'Y'"
                                @change="val=> changeEnableFlag(scoped,val)"
                                style="--el-switch-on-color: #1890ff; --el-switch-off-color: #dcdfe6 "
                                active-text="是"
                                inactive-text="否"
                            />
                        </template>
                        <!-- 设置安全库存 -->
                        <template #safeStockFlag="{scoped}">
                            <el-tag :type="scoped.safeStockFlag === 'Y' ? 'primary' :'danger' ">{{ scoped.safeStockFlag ==='Y'?'是':'否' }}</el-tag>
                        </template>
                        <!-- 操作 -->
                         <template #tableOperate="{scoped}">
                            <div style="display: flex;justify-content: center;"
                                 v-if="scoped.enableFlag === 'N'">
                                <el-button 
                                         link
                                         size="small"
                                         type="primary"
                                         icon="EditPen" 
                                        >修改</el-button>
                                <el-button
                                         link
                                         size="small"
                                         type="primary"
                                         icon="Delete" 
                                         @click="deleteItem(scoped.itemId)"
                                        >删除</el-button>
                            </div>
                            <div style="display: flex; 
                                     justify-content:center;
                                     margin-top: 10px;"
                                     >
                                <el-button type="primary" 
                                       link
                                       size="small"
                                       icon="Printer"
                                       >标签打印</el-button>
                            </div>
                         </template>
                </myTable>
            </div>
        </div>
        <!-- 弹窗 -->
         <el-dialog v-model="switchDialogStatus"
                    title="系统提示">
            <span v-if="switchOrDelete == 'switch'">
                确定要"启用"
                {{oneSwitchData.itemName}}
                {{ oneSwitchData.itemOrProduct === "ITEM" ? '物料':"产品"}}
                吗？

            </span>
            <span v-else-if='switchOrDelete =="delete"'>
                确认要删除数据项吗？
            </span>
            <template #footer>
                <div class="dialog-footer">
                <el-button @click="switchDialogStatus = false">取消</el-button>

                <el-button v-if="switchOrDelete == 'switch'" type="primary" @click="switchConfirmButton()">
                确定
                </el-button>

                <el-button v-else-if='switchOrDelete =="delete"' type="primary" @click="deleteConfirmButton()">
                确定
                </el-button>

                </div>
            </template>
         </el-dialog>

         <!-- 新增修改弹窗 -->
          <addEditDialog v-model:dialogVisible="dialogVisible"
                         :itemOrProjectData="itemOrProjectData"
                         :UnitTreeData="UnitTreeData">
            
          </addEditDialog>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
// 引入子组件  tree myTable  myInput  addEdit
import myInput from '@/components/MyInput/myInput.vue'
import treev2 from '@/components/tree/treev2.vue'
import myTable from '@/components/myTable/myTable.vue'
import addEditDialog from '@/components/AddOrEdit/addEditDialog.vue'
// 引入接口
import { getTreeList, getTableList,switchStatus,deleteProject,getProjectTreeData,getUnitTreeData} from '@/api/mainData/mainData.js'
import { ElMessage } from 'element-plus'

// 测试： 父组件传入 -----------------
const inputConfigs = [
  { label: '物料编码', placeholder: '请输入物料编码', prop: 'materialCode', slotStatus:false},
  { label: '物料名称', placeholder: '请输入物料名称', prop: 'materialName',slotStatus:false}, 
]



// 定义数据  左侧树形结构数据
let treeData = ref([])
// 定义右侧表格数据
let tableData = ref([])
// 定义右侧table表头 里面包括label，prop，判断插槽是否开启，width
const tableSetting = ref([
    {
        label:'物料编码',
        prop:'itemCode',
        width:140,
        slotStatus: true,
    },
    {
        label:'物料名称',
        prop:'itemName',
        width:140, 
    },
    {
        label:'规格型号',
        prop:'specification',
        width:140, 
    },
    {
        label:'单位',
        prop:'unitName',
        width:140, 
    },
    {
        label:'物料/产品',
        prop:'itemOrProduct',
        width:140, 
        slotStatus: true,
    },
    {
        label:'所属分类',
        prop:'itemTypeName',
        width:140, 
    },
    {
        label:'是否启用',
        prop:'enableFlag',
        width:140, 
        slotStatus: true,
    },
    {
        label:'设置安全库存',
        prop:'safeStockFlag',
        width:140, 
        slotStatus: true,
    },
    {
        label:'创建时间',
        prop:'createTime',
        width:140, 
    },
    {
        label:'操作',
        prop:'tableOperate',
        width:140, 
        slotStatus: true,
    }
])

const mytable = ref(null)


// 右侧表格总条数、总页数  
let tableTotal = ref(0)
// 定义params 用于获取右侧列表数据
let params = ref({
    pageNum: 1,
    pageSize: 10,
    itemTypeId: 0,   //左侧分类的id
    // 搜索框搜索的数据
    itemCode: 0,
    itemName:''
})
// 定义switch控制dialog的默认值
let switchDialogStatus = ref(false)
// 定义批量删除id
let ids = ref([])

// 存储：点击switch某一项目所获取的数据  存储一份方便弹窗显示该数据
let oneSwitchData = ref({})
// 存储：点击 右侧删除文字，存储一份该项的id  
let deleteItemId = ref(0)


// 定义一个状态  用于判断该弹窗是用户点击switch的弹窗     还是用户点击删除的弹窗
// switch的弹窗为switch    用户点击删除的弹窗为delete
let switchOrDelete = ref('')

// 定义 新增弹窗默认为false
const dialogVisible = ref(false)

// 弹窗中 物料/产品分类数据
const itemOrProjectData = ref([])

const UnitTreeData = ref([])


// 获取左侧属性结构数据
const getTreeData = async () => {
    try {
        let { code, data } = await getTreeList()
        if (code == 200) {
            treeData.value = data
            ElMessage.success('左侧树形数据获取成功')
            console.log(treeData.value, 'treeData');
        }
    } catch (error) {
        console.log(error, 'error');
    }
}
// 获取table右侧数据
const getTableData = async () => {
    try {
        // console.log(await getTableList(params),'getTableList');
        let { total, code, rows } = await getTableList(params.value)
        if (code == 200) {
            ElMessage.success('表格数据获取成功')
            console.log(rows, 'rows');
            tableData.value = rows
            tableTotal.value = total
            console.log(tableData.value, 'tableData','total:',tableTotal.value);
        }
    } catch (error) {
        console.log(error, 'error');
    }
}

// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    params.value.pageSize = size
    // console.log(params.value,'测试一下');
    // 更新数据
    getTableData()
}
// 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    params.value.pageNum = page
    // 更新数据
    // console.log('打印params',params.value);
    getTableData()
}

// switch开关
const changeEnableFlag=async(scoped,val)=>{
    // 根据val的布尔值true/false  给enableFlag赋值为Y或者N
    scoped.enableFlag = val ?'Y':'N'
    console.log('打印该项id',scoped.itemId);  
    console.log('该项的switch的状态为：',val);
    console.log('该项数据:',scoped);
    // 将数据赋值给oneSwitchData.value
    oneSwitchData.value = scoped
    console.log(oneSwitchData.value,'oneSwitchData');
    
    switchOrDelete.value = 'switch'

    // 打开窗口
    switchDialogStatus.value = true
    console.log(switchOrDelete.value,'switchOrDelete');
    
    
}

// 搜索框 搜索数据
const getSearchData=async(searchData)=>{
    console.log(searchData,'父组件收到：子组件传递过来的数据');
    // 赋值  然后调用搜索接口  搜索searchData对应的数据
    params.value.itemCode = searchData.materialCode
    params.value.itemName = searchData.materialName
    console.log(params.value,'测试一下');
    // 调用接口
    try {
        let {code,msg,rows,total} = await getTableList(params.value)
        if(code == 200&&rows.length>0){
            ElMessage.success(msg)
            // 重新渲染界面
            tableData.value = rows
            tableTotal.value = total
        }
        else{
            ElMessage.error('没有查询到数据')
            tableData.value = rows
            tableTotal.value = total
        }
    } catch (error) {
        console.log(error,'error');  
    }
}
// 重置按钮
const resetSearchData=()=>{
    console.log(params,'params');
    
    // 重置搜索框的数据
    params.value.itemCode = 0
    params.value.itemName = ''
    // 重置table数据
    // getSearchData(params.value)
    getTableData()
    
}

// 获取treeId对应的数据
const getTreeTableData=(treeId)=>{
    console.log('打印treeId(父)',treeId);
    params.value.itemTypeId = treeId
    // console.log(params.value,'测试一下');
    // 调用请求
    getTableData(params.value)
}

// switch的弹窗的确定按钮函数
const switchConfirmButton=async()=>{
    console.log('您点击了switchButton');
    switchDialogStatus.value = false
    try {
         let {code,msg} = await switchStatus(oneSwitchData.value)
         if(code == 200){
            ElMessage.success(msg)
            getTableData()
         }
    } catch (error) {
        console.log(error,'error');
        getTableData()
    }
}
// 删除点击事件  右侧删除文字的弹窗
const deleteItem=(id)=>{
    console.log('要删除的id',id);   
    // 将获取到的id赋值给本地的id，用于删除
    deleteItemId.value = id 
    // 将switchOrDelete的状态设置为false  为false时，显示删除弹窗
    switchOrDelete.value = 'delete'
    // 打开弹窗
    switchDialogStatus.value = true
    console.log(switchOrDelete.value,'switchOrDelete');
    // getTableData()
}

// 右侧删除中的弹窗的确定按钮
const deleteConfirmButton=async()=>{
    // console.log('您点击了右侧删除按钮');
    switchDialogStatus.value = false
    // 调用删除请求
    // console.log(await deleteProject(deleteItemId.value),'deleteProject');
    try {
        let {code,msg} = await deleteProject(deleteItemId.value)
        if(code == 200){
            ElMessage.success(msg)
            getTableData()
        }
    } catch (error) {
        console.log(error,'error');    
    }
}
const delAll = async()=>{
    // 将ids.value转为字符串
    ids.value = mytable.value.deleteArr
    ids.value = ids.value.toString()
    console.log(ids.value,'ids');
    console.log(typeof ids.value,'ids的类型');
    await deleteProject(ids.value)

    getTableData()
}
const addNew = async()=>{
    // 新增物料弹窗打开
    dialogVisible.value = true
    // console.log(dialogVisible.value,'dialogVisible');
    try {
        // 调用 获取物料/产品分类树形数据
        let {code,data,msg}  = await getProjectTreeData()
        if(code == 200){
            console.log(data,'data');
            // 获取物料/产品分类树形数据并赋值给treeData
            itemOrProjectData.value = data
            ElMessage.success(msg)
        }

        
    } catch (error) {
        console.log(error,'error');
        
    }
    

}
const getUnitData=async()=>{
    // 获取单位的树形数据
        let {code,msg,data} =  await getUnitTreeData()
        if(code == 200){
            console.log('123123123');
            
            // console.log(dataTree,'dataTree');
            // 获取单位的树形数据并赋值给UnitTreeData
            UnitTreeData.value = data
            ElMessage.success('单位数据'+ msg)
        }
}




onMounted(() => {
    // 获取左侧树形数据
    getTreeData()
    // 获取table右侧数据
    getTableData()
    // 获取单位树形数据
    getUnitData()

})
</script>
<style scoped>
.mditem {
    display: flex;
    padding: 20px 10px 0px 10px;
    height: 100vh;
}

.input-div {
    margin-left: 20px;
}
.color-button {
    height: 50px;
    display: flex;
    align-items: center;
}
</style>