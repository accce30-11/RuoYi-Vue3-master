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
        <el-form :inline="true" label-width="auto">
            <el-form-item label="供应商编码" style="width:55%;">
                <el-input  placeholder="请输入供应商编码" v-model="vendorForm.vendorCode"></el-input>
            </el-form-item>            
            <el-form-item>
                 <el-switch
                :disabled="popwindowTitle == '查看' " 
                v-model="switchValue"
                active-text="自动生成"
                @change="switchChange"></el-switch>
            </el-form-item>

            <el-form-item style="position: absolute; top: 45px;">
                <el-avatar shape="square" :size="200" :fit="fit" :src="url" />
            </el-form-item>

            <el-form-item label="供应商名称" style="width: 55%;"> 
                <el-input placeholder="请输入供应商名称" v-model="vendorForm.vendorName"></el-input>
            </el-form-item>
            <el-form-item label="供应商简称" style="width: 55%;">
                <el-input placeholder="请输入供应商简称" v-model="vendorForm.vendorNick"></el-input>
            </el-form-item>
            <el-form-item label="供应商英文名称" style="width: 55%;">
                <el-input placeholder="请输入供应商英文名称" v-model="vendorForm.vendorEn"></el-input>
            </el-form-item>
            <el-form-item label="供应商简介" style="width: 100%;">
                <el-input type="textarea" placeholder="请输入内容" v-model="vendorForm.vendorDes"></el-input>
            </el-form-item>
            <el-form-item label="供应商地址" style="width: 100%;">
                <el-input placeholder="请输入内容" type="textarea" v-model="vendorForm.address"></el-input>
            </el-form-item>
            <el-form-item label="供应商等级">
               <el-select v-model="vendorForm.vendorLevel" placeholder="供应商等级" style="width: 240px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
                </el-select>
            </el-form-item>
            <el-form-item label="供应商评分">
                <el-input-number v-model="vendorForm.vendorScore" :min="0"></el-input-number>
            </el-form-item>

            <el-form-item label="供应商官网地址" style="width: 29%">
                    <el-input v-model="vendorForm.website" placeholder="请输入供应商官网地址"></el-input>
                </el-form-item>
                <el-form-item label="供应商邮箱地址" style="width: 30%">
                    <el-input v-model="vendorForm.email"  placeholder="请输入供应商邮箱地址"></el-input>
                </el-form-item>
                <el-form-item label="供应商电话" style="width: 30%">
                    <el-input v-model="vendorForm.tel" placeholder="请输入供应商电话"></el-input>
                </el-form-item>
                
                <el-form-item label="联系人1" style="width: 29%;">
                    <el-input v-model="vendorForm.contact1" placeholder="请输入联系人1"></el-input>
                </el-form-item>
                <el-form-item label="联系人1-电话" style="width: 29%;">
                    <el-input v-model="vendorForm.contact1Tel" placeholder="请输入联系人1电话"></el-input>
                </el-form-item>
                <el-form-item label="联系人1-邮箱"style="width: 30%">
                    <el-input v-model="vendorForm.contact1Email" placeholder="请输入联系人2邮箱"></el-input>
                </el-form-item>
                <el-form-item label="联系人2"  style="width: 29%;">
                    <el-input v-model="vendorForm.contact2" placeholder="请输入联系人1"></el-input>
                </el-form-item>
                <el-form-item label="联系人2-电话" style="width: 29%;">
                    <el-input v-model="vendorForm.contact2Tel" placeholder="请输入联系人2电话"></el-input>
                </el-form-item>
                <el-form-item label="联系人2-邮箱" style="width: 30%">
                    <el-input v-model="vendorForm.contact2Email" placeholder="请输入联系人2邮箱"></el-input>
                </el-form-item>
                <el-form-item label="社会信用代码">
                    <el-input v-model="vendorForm.creditCode" placeholder="请输入统一社会信用代码"></el-input>
                </el-form-item>
                <el-form-item label="是否有效">
                    <el-radio-group v-model="vendorForm.enableFlag" :disabled="popwindowTitle =='查看'?true:false ">
                      <el-radio value="Y" size="large">是</el-radio>
                      <el-radio value="N" size="large">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="供应商LOGO" style="width: 30%">
                    <el-input v-model="vendorForm.vendorLogo" placeholder="请输入供应商LOGO"></el-input>
                </el-form-item>
                <el-form-item label="备注" style="width: 100%;">
                    <el-input v-model="vendorForm.remark" type="textarea" placeholder="请输入备注"></el-input>
                </el-form-item>
        </el-form>
        <template #footer>
            <div>
                <el-button @click="cancel">关闭</el-button>
                <el-button v-if="popwindowTitle=='添加供应商'" type="primary" @click="confirm">
                确定
                </el-button>

                <el-button v-else-if="popwindowTitle == '修改供应商' " type="primary" @click="editForm">修改</el-button>
                <!-- <el-button v-if="popwindowTitle == '查看' ">取消</el-button> -->
                </div>
        </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { getVendorCode,submitVendorData,submitEditVendorData} from '@/api/mainData/mainData.js'
import { ElMessage } from 'element-plus'

    const vendorForm = ref({
         vendorCode:'',//供应商编码
         vendorName:'',//供应商名称
         vendorNick:'',//供应商简称
         vendorEn:'',//供应商英文名称
         vendorDes:'',//供应商简介
         address:'',//供应商地址
         vendorLevel:'',//供应商等级
         vendorScore:'0',//供应商评分
         website:'',//供应商官网
         email:'',//供应商邮箱
         tel:'',//供应商联系电话
         contact1:'',//联系人1
         contact1Tel:'',
         contact1Email:'',
         contact2:'',//联系人2
         contact2Tel:'',
         contact2Email:'',
         creditCode:'',//信用代码
         enableFlag:'Y',//是否启用
         vendorLogo:'',//供应商logo
         remark:'',//备注

    })
    const options = [
  {
    value: 'A',
    label: '优质供应商',
  },
  {
    value: 'B',
    label: '正常',
  },
  {
    value: 'C',
    label: '重点关注',
  },
  {
    value: 'D',
    label: '劣质供应商',
  },
  {
    value: 'E',
    label: '黑名单',
  },
]
    // switch
    const switchValue = ref(false)
    // 接收
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
    const emit = defineEmits(['update:popwindowStatus','emitVisibleChange','emitVendorData'])
    function emitVisibleChange(val) {
        emit('update:popwindowStatus', val)
    }

    // 弹窗确定按钮
    const confirm=async()=>{
        console.log(vendorForm.value,'vendorForm');
        // console.log(await submitVendorData(vendorForm.value),'提交数据');
        try {
            let {code,msg,data} = await submitVendorData(vendorForm.value)
            if(code == 200){
                ElMessage.success('提交数据'+msg)
                console.log(data,'返回的id'); 
                emit('update:popwindowStatus',false)
                // 刷新数据
                emit('emitVendorData')

            }else{
                ElMessage.error('提交数据'+msg)
                emit('update:popwindowStatus',false)
            }
        } catch (error) {
            console.log(error,'error');
            
        }
    }
    const cancel=()=>{
        emit('update:popwindowStatus',false)
    }

    // switch自动生成
    const switchChange=async()=>{
        console.log('您点击了switch');
        if(switchValue.value == true){
          try {
              vendorForm.value.vendorCode =  await getVendorCode()
          } catch (error) {
            console.log(error,'获取供应商编码失败');
          }
        }else{
            // 不生成，清空
             vendorForm.value.vendorCode = '';
        }
    }

    // 修改 提交数据
    const editForm=async()=>{
        try {
        let {code,msg} = await submitEditVendorData(vendorForm.value)
        if(code === 200){
            ElMessage.success('修改数据'+msg)
            // clearForm()
            emit('emitVendorData')
            emit('update:popwindowStatus', false)
        }else{
           ElMessage.error('修改数据'+msg)
        emit('update:popwindowStatus', false)
        }
       } catch (error) {
         console.log(error);
       }
    }

    // 手动清除
    const clearForm=()=>{
        vendorForm.value = {
             vendorCode:'',
             vendorName:'',
             vendorNick:'',
             vendorEn:'',
             vendorDes:'',
             address:'',
             vendorLevel:'',
             vendorScore:'0',
             website:'',
             email:'',
             tel:'',
             contact1:'',
             contact1Tel:'',
             contact1Email:'',
             contact2:'',
             contact2Tel:'',
             contact2Email:'',
             creditCode:'',
             enableFlag:'Y',
             vendorLogo:'',
             remark:'',
        }
    }

    // 监听数据  数据变化  回显
    watch(()=>prop.backShowData,(newVal)=>{
        if(newVal){
            // 回显数据
            vendorForm.value = {...newVal}
        }
    })
</script>
<style scoped>

</style>