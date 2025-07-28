<template>
    <div>
        <el-dialog
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            :title="popwindowTitle"
            :model-value="popwindowStatus"
            @update:popwindowStatus="emitVisibleChange"
        >
        <el-form :inline="true" ref="formRef" :model="clientData" label-width="auto">
            <div>
                <el-form-item label="客户编码">
                    <el-input placeholder="请输入客户编码" v-model="clientData.clientCode"></el-input>
                </el-form-item>
                <el-form-item>
                     <el-switch
                               :disabled="popwindowTitle == '查看' " 
                               v-model="switchValue"
                               active-text="自动生成"
                               @change="switchChange"></el-switch>
                </el-form-item>

                <el-form-item label="客户名称">
                    <el-input placeholder="请输入客户名称" v-model="clientData.clientName"></el-input>
                </el-form-item>

                <el-form-item label="客户简称">
                    <el-input placeholder="请输入客户简称" v-model="clientData.clientNick"></el-input>
                </el-form-item>

                <el-form-item label="客户英文名称">
                    <el-input v-model="clientData.clientEn" placeholder="请输入客户英文名称"></el-input>
                </el-form-item>

                <el-form-item label="客户类型" style="width: 240px;">
                    <el-select v-model="clientData.clientType" placeholder="请选择客户类型">
                        <el-option label="企业客户" value="ENTERPRISE"></el-option>
                        <el-option label="个人" value="PERSON"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="客户简介" style="width: 100%;">
                    <el-input type="textarea" placeholder="请输入内容" v-model="clientData.clientDes"></el-input>
                </el-form-item>

                <el-form-item label="客户地址" style="width: 100%">
                    <el-input type="textarea" v-model="clientData.address" placeholder="请输入客户地址"></el-input>
                </el-form-item>

                <el-form-item label="客户官网地址" style="width: 50%">
                    <el-input v-model="clientData.website" placeholder="请输入客户官网地址"></el-input>
                </el-form-item>
                <el-form-item label="客户邮箱地址" style="width: 40%">
                    <el-input v-model="clientData.email" placeholder="请输入客户邮箱地址"></el-input>
                </el-form-item>
                <el-form-item label="客户电话" style="width: 50%">
                    <el-input v-model="clientData.tel" placeholder="请输入客户电话"></el-input>
                </el-form-item>
                <el-form-item label="客户LOGO" style="width: 40%">
                    <el-input v-model="clientData.clientLogo" placeholder="请输入客户LOGO"></el-input>
                </el-form-item>
                <el-form-item label="联系人1">
                    <el-input v-model="clientData.contact1" placeholder="请输入联系人1"></el-input>
                </el-form-item>
                <el-form-item label="联系人1-电话">
                    <el-input v-model="clientData.contact1Tel" placeholder="请输入联系人1电话"></el-input>
                </el-form-item>
                <el-form-item label="联系人1-邮箱">
                    <el-input v-model="clientData.contact1Email" placeholder="请输入联系人2邮箱"></el-input>
                </el-form-item>
                <el-form-item label="联系人2">
                    <el-input v-model="clientData.contact2" placeholder="请输入联系人1"></el-input>
                </el-form-item>
                <el-form-item label="联系人2-电话">
                    <el-input v-model="clientData.contact2Tel" placeholder="请输入联系人2电话"></el-input>
                </el-form-item>
                <el-form-item label="联系人2-邮箱">
                    <el-input v-model="clientData.contact2Email" placeholder="请输入联系人2邮箱"></el-input>
                </el-form-item>
                <el-form-item label="社会信用代码">
                    <el-input v-model="clientData.creditCode" placeholder="请输入统一社会信用代码"></el-input>
                </el-form-item>
                <el-form-item label="是否有效">
                    <el-radio-group v-model="clientData.enableFlag" :disabled="popwindowTitle =='查看'?true:false ">
                      <el-radio value="Y" size="large">是</el-radio>
                      <el-radio value="N" size="large">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" style="width: 100%;">
                    <el-input v-model="clientData.remark" type="textarea" placeholder="请输入备注"></el-input>
                </el-form-item>

                <!-- tabs -->
                 <el-card v-if="popwindowTitle == '查看'">
                    <el-tabs type="border-card" class="demo-tabs" @tab-click="getData">
                      <el-tab-pane label='产品清单' name="product">
                        <el-table >
                            <el-table-column prop="date" label="物料编码" />
                            <el-table-column prop="name" label="物料名称"  />
                            <el-table-column prop="address" label="规格型号" />
                            <el-table-column prop="date" label="单位"  />
                            <el-table-column prop="name" label="入库数量"  />
                            <el-table-column prop="address" label="批次号" />
                        </el-table>
                      </el-tab-pane>
                      <el-tab-pane label="销售记录" name="sales">
                        <el-table >
                            <el-table-column prop="date" label="出库单编号" />
                            <el-table-column prop="name" label="出库单名称"  />
                            <el-table-column prop="address" label="销售订单编号" />
                            <el-table-column prop="date" label="客户编码"  />
                            <el-table-column prop="name" label="客户名称"  />
                            <el-table-column prop="address" label="出库日期" />
                            <el-table-column prop="address" label="单据状态" />
                        </el-table>
                      </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>
        </el-form>


        <template #footer>
            <div>
                <el-button @click="cancel">关闭</el-button>
                <el-button v-if="popwindowTitle=='添加客户'" type="primary" @click="confirm">
                确定
                </el-button>

                <el-button v-else-if="popwindowTitle == '修改客户' " type="primary" @click="editForm">修改</el-button>
                <!-- <el-button v-if="popwindowTitle == '查看' ">取消</el-button> -->
                </div>
        </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { getClientCode,submitClientData,submitEditClientData,getProductRecordTableData,getSalesRecords } from '@/api/mainData/mainData.js'
import { ElMessage } from 'element-plus'

// 产品清单数据
const productData = ref({})
// 销售记录
const salesData = ref({})

const switchValue = ref(false)
let formRef = ref(null)

    // 定义要提交的数据
    const clientData = ref({
        address: '',  //客户地址
        clientCode:'',  //客户编码
        clientDes:'',  //客户简介
        clientEn:'',  //客户英文名称
        clientId:'',  //客户ID
        clientLogo:'',  //客户logo
        clientName:'',  //客户名称
        clientNick:'',  //客户简称
        clientType:'',  //客户类型  需要判断
        contact1:'',  //联系人1
        contact1Email:'',  //联系人1邮箱
        contact1Tel:'',  //联系人1电话
        contact2:'',  //联系人2
        contact2Email:'',  //联系人2邮箱
        contact2Tel:'',  //联系人2电话
        createBy:'',  
        createTime:'', 
        creditCode:'',  //信用代码
        email:'',  //客户邮箱
        enableFlag:'',  //启用状态
        remark:'',  //备注
        tel:'',  //客户电话
        updateBy:'',
        updateTime:'',
        website:'',  //客户官网网站
    })

    const prop = defineProps({
        // 标题
        popwindowTitle: {
            type: String,
            required: true
        },
        // 窗口打开关闭状态
        popwindowStatus:{
            type: Boolean,
            default: false
        },
        // 数据回显示
        backShowData:{
            type: Object,
            default: () => ({})
        }
    })


    // 发送子组件的弹窗状态
    const emit = defineEmits(['update:popwindowStatus','emitVisibleChange','emitClientData'])
    function emitVisibleChange(val) {
        emit('update:popwindowStatus', val)
    }

    // 取消按钮
    const cancel = () => {
        emit('update:popwindowStatus', false)
    }
    // 提交确定按钮
    const confirm =async()=>{
        console.log(clientData.value,'clientData.value');
        try {
            // console.log(await submitClientData(clientData.value));
            let {code,msg,data } = await submitClientData(clientData.value)
            if(code === 200){
                ElMessage.success('提交数据'+msg)
                console.log(data,'这个是返回的id');
            }
            else{
                ElMessage.error('提交数据'+msg)
            }
            emit('update:popwindowStatus', false)
            // 刷新数据
            emit('emitClientData')
            clearForm()
            
        } catch (error) {
            console.log(error,'提交数据失败');
            emit('update:popwindowStatus', false)
            clearForm()
        }
       
      
    }
    // 修改确定（修改）按钮
    const editForm =async()=>{
       try {
        let {code,msg} = await submitEditClientData(clientData.value)
        if(code === 200){
            ElMessage.success('修改数据'+msg)
            clearForm()
            emit('emitClientData')
            emit('update:popwindowStatus', false)
        }else{
           ElMessage.error('修改数据'+msg)
        emit('update:popwindowStatus', false)
        }
       } catch (error) {
         console.log(error);
       }
        
    }
    // 清空表单  暂定位手动清空
    const clearForm =()=>{
         switchValue.value = false // 清空 switch 状态
        // formRef.value.resetFields()
        clientData.value = {
        address: '',  //客户地址
        clientCode:'',  //客户编码
        clientDes:'',  //客户简介
        clientEn:'',  //客户英文名称
        clientId:'',  //客户ID
        clientLogo:'',  //客户logo
        clientName:'',  //客户名称
        clientNick:'',  //客户简称
        clientType:'',  //客户类型  需要判断kkkkkkkkkkkkkkkkkkkkkkkkkkkkk 
        contact1:'',  //联系人1
        contact1Email:'',  //联系人1邮箱
        contact1Tel:'',  //联系人1电话
        contact2:'',  //联系人2
        contact2Email:'',  //联系人2邮箱
        contact2Tel:'',  //联系人2电话
        createBy:'',  
        createTime:'', 
        creditCode:'',  //信用代码
        email:'',  //客户邮箱
        enableFlag:'',  //启用状态
        remark:'',  //备注
        tel:'',  //客户电话
        updateBy:'',
        updateTime:'',
        website:'',  //客户官网网站
    }
    }

    const switchChange=async()=>{
        console.log('您点击了switch');
        if(switchValue.value == true){
          try {
              clientData.value.clientCode =  await getClientCode()
          } catch (error) {
            console.log(error,'获取客户编码失败');
          }
        }else{
            // 不生成，清空
            clientData.value.clientCode = '';
        }
    }

    // 监听数据  数据变化  回显
    watch(()=>prop.backShowData,(newVal)=>{
        if(newVal){
            // 回显数据
            clientData.value = {...newVal}
        }
    })

    // 产品清单  
    const getData=async(tab,)=>{
        // 如果为产品清单，则调用await getProductRecordTableData(clientData.value.clientId)
        console.log(tab.paneName,'tab.paneName');
        if(tab.paneName === 'product'){
            // console.log(clientData.value,'id');
             console.log(await getProductRecordTableData(clientData.value.clientId),'产品清单');
        }else if(tab.paneName ==='sales'){
            console.log(await getSalesRecords(clientData.value.clientId),'销售记录');
        }
       
    }
    

</script>
<style scoped>

</style>