import request from '@/config/axios'

// CMDB-namespace VO
export interface NamespaceVO {
  id: number // namespace实例-ID
  cloudArea: string // 云区域
  env: string // 环境
  center: string // 部门
  team: string // 团队
  namespace: string // 命名空间
  deployment: string // 控制器
  replicas: number // 副本数
}

// CMDB-namespace API
export const NamespaceApi = {
  // 查询CMDB-namespace分页
  getNamespacePage: async (params: any) => {
    return await request.get({ url: `/cmdb/namespace/page`, params })
  },

  // 查询CMDB-namespace详情
  getNamespace: async (id: number) => {
    return await request.get({ url: `/cmdb/namespace/get?id=` + id })
  },

  // 新增CMDB-namespace
  createNamespace: async (data: NamespaceVO) => {
    return await request.post({ url: `/cmdb/namespace/create`, data })
  },

  // 修改CMDB-namespace
  updateNamespace: async (data: NamespaceVO) => {
    return await request.put({ url: `/cmdb/namespace/update`, data })
  },

  // 删除CMDB-namespace
  deleteNamespace: async (id: number) => {
    return await request.delete({ url: `/cmdb/namespace/delete?id=` + id })
  },

  // 导出CMDB-namespace Excel
  exportNamespace: async (params) => {
    return await request.download({ url: `/cmdb/namespace/export-excel`, params })
  },

  // 下载Namespace导入模板
  importNamespaceTemplate: () => {
    return request.download({ url: '/cmdb/namespace/get-import-template' })
  },
}
