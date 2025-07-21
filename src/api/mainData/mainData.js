import request from '@/utils/request'


// 主数据界面   获取左侧树形数据
export function getTreeList() {
  return request({
    url: '/mes/md/itemtype/treeselect',
    method: 'get'
  })
}

// 主数据 表格数据获取
// /mes/md/mditem/list
export function getTableList(params){
    return request({
        url:'/mes/md/mditem/list',
        method:'get',
        params:{
          pageNum:params.pageNum,
          pageSize:params.pageSize,
          itemTypeId:params.itemTypeId,
          itemCode:params.itemCode,
          itemName:params.itemName,
        }
    })
}

// switch 状态接口   /mes/md/mditem
export function switchStatus(data){
  return request({
    url:'/mes/md/mditem',
    method:'put',
    data
  })
}

// 删除接口  /mes/md/mditem/
export function deleteProject(id){
  return request({
    url:'/mes/md/mditem/'+id,
    method:'delete'
  })
}

// 新增窗口   自动生成物料编码   /system/autocode/get/ITEM_CODE
export function getRandomCode(){
  return request({
    url:'/system/autocode/get/ITEM_CODE',
    method:'get'
  })
}
// 当点击 switch按钮后，另一个请求  二维码   /mes/wm/barcode/getBarcodeUrl 参数拼接到url上
export function getBarcodeUrl(params){
  return request({
    url:'/mes/wm/barcode/getBarcodeUrl',
    method:'get',
    params
  })
}

// 物料/产品分类 获取树形数据   /mes/md/itemtype/treeselect
export function getProjectTreeData(){
    return request({
      url:'/mes/md/itemtype/treeselect',
      method:'get'
    })
}
// 物料/产品分类  获取单位的树形数据   /mes/md/unitmeasure/selectall
export function getUnitTreeData(){
  return request({
    url:'/mes/md/unitmeasure/selectall',
    method:'get'
  })
}




// 新增物料/产品   确定按钮  用于提交数据
export function submitProjuctData(data){
  return request({
    url:'/mes/md/mditem',
    method:'post',
    data:{
        barcodeUrl:null,
        batchFlag:data.batchFlag,
        enableFlag:data.enable,
        highValue:data.highValue,
        itemCode:data.materialCode,
        itemName:data.materialName,
        itemTypeId:data.category,
        maxStock:0,
        minStock:0,
        safeStockFlag:data.safeStockFlag,
        specification:data.specificationModel,
        unitOfMeasure:data.unit
    }
  })
}


// 计量单位
// 获取 计量单位表格数据   /mes/md/unitmeasure/list
export function getUnitTableData(params){
  return request({
    url:'/mes/md/unitmeasure/list',
    method:'get',
    params:{
      pageNum:params.pageNum,
      pageSize:params.pageSize,
    }
  })
}

// 删除单位  delete
export function deleteUnitData(id){
  return request({
    url:'/mes/md/unitmeasure/'+id,
    method:'delete'
  })
}

// 搜索数据  /mes/md/unitmeasure/list
export function searchUnitData(params){
  return request({
    url:'/mes/md/unitmeasure/list',
    method:'get',
    params:{
      measureCode:params.measureCode,
      measureName:params.measureName
    }
  })
}

// 计量单位新增  点击弹窗会有一个接口  这个接口是：  当用户点击"是否是主单位时"的否时，所用到的数据  
// /mes/md/unitmeasure/listprimary
export function getPrimaryUnitName(){
  return request({
    url:'/mes/md/unitmeasure/listprimary',
    method:'get'
  })
}

// 计量单位新增  确定按钮 
export function submitUnitData(data){
  return request({
    url:'/mes/md/unitmeasure',
    method:'post',
    data:{
      changeRata:data.mainUnitRate,
      enableFlag:data.isEnable,
      measureCode:data.unitCode,
      measureId:data.measureId,
      measureName:data.unitName,
      primaryFlag:data.isEnable,
      primaryId:data.placeChooseUnit,
      remark:data.remark,
    }
  })
}

// 计量单位  操作：修改接口   本接口用于获取对应的数据进行回显 /mes/md/unitmeasure/
export function getUnitDataById(id){
   return request({
    url:'/mes/md/unitmeasure/'+id,
    method:'get'
  })
 
}
// 修改  提交数据 /mes/md/unitmeasure
export function updataUnitData(data){
  return request({
    url:'/mes/md/unitmeasure',
    method:'put',
    data:{
      changeRata:data.mainUnitRate,
      enableFlag:data.isEnable,
      measureCode:data.unitCode,
      measureId:data.measureId,
      measureName:data.unitName,
      primaryFlag:data.isEnable,
      primaryId:data.placeChooseUnit,
      remark:data.remark,
    }
  })
}

