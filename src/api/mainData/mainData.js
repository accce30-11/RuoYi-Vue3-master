import request from '@/utils/request'


// 主数据界面   获取左侧树形数据
export function getTreeList() {
  return request({
    url: '/mes/md/itemtype/treeselect',
    method: 'get'
  })
}
// 查看数据详情  /mes/md/mditem/
export function getMditemDetails(id){
  return request({
    url:'/mes/md/mditem/'+id,
    method:'get'
  })
}
// BOM组成数据查询
export function getBOMData(params){
  return request({
    url:'/mes/md/bom/list',
    method:'get',
    params
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

// 修改数据后提交  /mes/md/mditem
export function updateMditem(data){
  return request({
    url:'/mes/md/mditem',
    method:'put',
    data
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
    data
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

// 物料产品分类--------------------------------------------------

// 物料产品分类    /mes/md/itemtype/list------------------------------------------------
export function getItemTypeTableData(params){
  return request({
    url:'/mes/md/itemtype/list',
    method:'get',
    params
  })
}

// 物料产品分类 搜索数据   /mes/md/itemtype/list
export function searchItemType(params){
  return request({
    url:'/mes/md/itemtype/list',
    method:'get',
    params:{
     itemTypeName:params.itemTypeName,
     enableFlag:params.enableFlag
    }
  })
}

// 物料产品分类 删除    /mes/md/itemtype/
export function deleteItemTypeData(id){
  return request({
    url:'/mes/md/itemtype/'+id,
    method:'delete'
  })
}

// // 物料产品  点击新增会直接调用一个请求  list
// export function getItemTypeList(){
//   return request({
//     url:'/mes/md/itemtype/list',
//     method:'get'
//   })
// }


export function submitItemTypeData(data){
  return request({
    url:'/mes/md/itemtype',
    method:'post',
    data
  })
}

// 数据回显  根据id搜索对应的数据 /mes/md/itemtype/
export function getItemTypeDataById(id){
  return request({
    url:'/mes/md/itemtype/'+id,
    method:'get'
  })
}

// 修改弹窗  提交数据  /mes/md/itemtype

export function submitEditItemTypeData(data){
  return request({
    url:'/mes/md/itemtype',
    method:'put',
    data
  })
}



// 客户管理------------------------------------------
// 获取客户数据 /mes/md/client/list
export function getClientTableData(params){
  return request({
    url:'/mes/md/client/list',
    method:'get',
    params
  })
}
// 提交数据  /mes/md/client
export function submitClientData(data){
  return request({
    url:'/mes/md/client',
    method:'post',
    data
  })
}


// 搜索数据 /mes/md/client/list
export function searchClient(params){
  return request({
    url:'/mes/md/client/list',
    method:'get',
    params
  })
}


// 删除数据 /mes/md/client/
export function deleteClientData(id){
  return request({
    url:'/mes/md/client/'+id,
    method:'delete'
  })
}

// 新增弹窗  自动生成客户编码  system/autocode/get/CLIENT_CODE
export function getClientCode(){
  return request({
    url:'/system/autocode/get/CLIENT_CODE',
    method:'get'
  })
}

// 数据回显  /mes/md/client/  根据id 获取数据
export function getClientDataById(id){
  return request({
    url:'/mes/md/client/'+id,
    method:'get'
  })
}
// 修改数据提交 /mes/md/client
export function submitEditClientData(data){
  return request({
    url:'/mes/md/client',
    method:'put',
    data
  })
}

// 产品清单    获取id对应的数据
export function getProductRecordTableData(id){
  return request({
    url:'/mes/wm/productsales/getItem/'+id,
    method:'get'
  })
}

// 销售记录  获取id对应的数据
export function getSalesRecords(id){
  return request({
    url:'/mes/wm/productsales/getSaleRecord/'+id,
    method:'get'
  })
}


// 供应商管理-------------------------------------------------
// 获取数据  /mes/md/vendor/list
export function getVendorTableData(params){
  return request({
    url:'/mes/md/vendor/list',
    method:'get',
    params
  })
}
// 自动生成 供应商编码
export function getVendorCode(){
  return request({
    url:'/system/autocode/get/VENDOR_CODE',
    method:'get'
  })
}
// 提交数据 /mes/md/vendor
export function submitVendorData(data){
  return request({
    url:'/mes/md/vendor',
    method:'post',
    data
  })
}


// 删除  /mes/md/vendor/
export function deleteVendorData(id){
  return request({
    url:'/mes/md/vendor/'+id,
    method:'delete'
  })
}

// 修改：  通过id获取对应数据  /mes/md/vendor/
export function getVendorDataById(id){
  return request({
    url:'/mes/md/vendor/'+id,
    method:'get'
  })
}
// 修改：提交数据   /mes/md/vendor
export function submitEditVendorData(data){
  return request({
    url:'/mes/md/vendor',
    method:'put',
    data
  })
}

// 车间设置------------------------------------
// 获取数据  /mes/md/workshop/list
export function getWorkShopTableData(params){
  return request({
    url:'/mes/md/workshop/list',
    method:'get',
    params
  })
}
// 搜索数据  /mes/md/workshop/list
export function searchWorkShop(params){
  return request({
    url:'/mes/md/workshop/list',
    method:'get',
    params
  })
}

// 删除 /mes/md/workshop/
export function deleteWorkShopData(id){
  return request({
    url:'/mes/md/workshop/'+id,
    method:'delete'
  })
}

// 新增数据  /mes/md/workshop
export function submitWorkShopData(data){
  return request({
    url:'/mes/md/workshop',
    method:'post',
    data
  })
}

// 获取 点击放大镜后界面的树形数据  /system/dept/treeselect
export function getTreeSelectData(){
  return request({
    url:'/system/dept/treeselect',
    method:'get'
  })
}

// 获取人员选择数据  /system/user/list
export function getUserSelectData(params){
  return request({
    url:'/system/user/list',
    method:'get',
    params
  })
}
// 自动生成  /system/autocode/get/WORKSHOP_CODE
export function getWorkshopCode(){
  return request({
    url:'/system/autocode/get/WORKSHOP_CODE',
    method:'get'
  })
}

// 获取getBarcodeUrl  /mes/wm/barcode/getBarcodeUrl
export function getWorkshopBarcodeUrl(params){
  return request({
    url:'/mes/wm/barcode/getBarcodeUrl',
    method:'get',
    params
  })
}

// 查看 某条数据 /mes/md/workshop/
export function getWorkshopDataById(id){
  return request({
    url:'/mes/md/workshop/'+id,
    method:'get'
  })
}

// 修改：确认修改  /mes/md/workshop
export function submitEditWorkshopData(data){
  return request({
    url:'/mes/md/workshop',
    method:'put',
    data
  })
}

// 工作站---------------------------------------------------
// 获取工作站table数据  /mes/md/workstation/list
export function getWorkstationTableData(params){
  return request({
    url:'/mes/md/workstation/list',
    method:'get',
    params
  })
}
 
// 获取所在车间名称   /mes/md/workshop/listAll
export function getWorkshopData(params){
  return request({
    url:'/mes/md/workshop/listAll',
    method:'get',
    params
  })
}


// 获取所属工序的数据  /mes/pro/process/listAll
export function getProcessData(params){
  return request({
    url:'/mes/pro/process/listAll',
    method:'get',
    params
  })
}

// 删除数据  /mes/md/workstation/
export function deleteWorkStation(id){
  return request({
    url:'/mes/md/workstation/'+id,
    method:'delete',
  })
}

// 获取工作站编号  /system/autocode/get/WORKSTATION_CODE
export function getWORKSTATION_CODE(params){
  return request({
    url:'/system/autocode/get/WORKSTATION_CODE',
    method:'get',
    params
  })
}
// 携带编号  请求  /mes/wm/barcode/getBarcodeUrl
export function getWorkStationBarcodeUrl(params){
  return request({
    url:'/mes/wm/barcode/getBarcodeUrl',
    method:'get',
    params
  })
}


// 提交数据  /mes/md/workstation
export function submitWorkStationData(data){
  return request({
    url:'/mes/md/workstation',
    method:'post',
    data
  })
}

// 数据修改  回显 /mes/md/workstation/
export function backShowEditWorkStationData(id){
  return request({
    url:'/mes/md/workstation/'+id,
    method:'get',
  })
}

// 修改后的数据提交  /mes/md/workstation
export function submitEditWorkStationData(data){
  return request({
    url:'/mes/md/workstation',
    method:'put',
    data
  })
}

// 查询设备资源    数据   /mes/md/workstationmachine/list
export function getWorkstationMachineTableData(params){
  return request({
    url:'/mes/md/workstationmachine/list',
    method:'get',
    params
  })
}
// 设备资源  删除  /mes/md/workstationmachine/
export function deleteWorkstationMachine(id){
  return request({
    url:'/mes/md/workstationmachine/'+id,
    method:'delete',
  })
}

// 获取设备选择左侧树形数据  /mes/dv/machinerytype/list

export function getManchineTreeListData(){
  return request({
    url:'/mes/dv/machinerytype/list',
    method:'get',
  })
}
// 获取设备选择 table数据  /mes/dv/machinery/list
export function getManchineTableData(params){
  return request({
    url:'/mes/dv/machinery/list',
    method:'get',
    params
  })
}
// 获取人力资源table数据  /mes/md/workstationworker/list
export function getworkstationworkerTabelData(params){
  return request({
    url:'/mes/md/workstationworker/list',
    method:'get',
    params
  })
}
// 获取人力资源 弹窗：添加人力资源中的岗位列表  /system/post/listAll
export function getworkerPositionTableData(){
  return request({
    url:'/system/post/listAll',
    method:'get',
  })
}
// 人力资源  删除  /mes/md/workstationworker/
export function deleteworkstationworker(id){
  return request({
    url:'/mes/md/workstationworker/'+id,
    method:'delete',
  })
}
// 添加人力资源  /mes/md/workstationworker
export function submitWorkstationworkerData(data){
  return request({
    url:'/mes/md/workstationworker',
    method:'post',
    data
  })
}
// 搜索 id对应的人力资源数据  /mes/md/workstationworker/
export function getworkstationworkerById(id){
  return request({
    url:'/mes/md/workstationworker/'+id,
    method:'get',
  })
}
// 确认修改  /mes/md/workstationworker
export function submitEditWorkstationworkerData(data){
  return request({
    url:'/mes/md/workstationworker',
    method:'put',
    data
  })
}

 
// 设备选择数据提交  /mes/md/workstationmachine
export function submitWorkstationMachineData(data){
  return request({
    url:'/mes/md/workstationmachine',
    method:'post',
    data
  })
}
