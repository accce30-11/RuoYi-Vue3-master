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