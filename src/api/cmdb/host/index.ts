import request from '@/config/axios'

// CMDB主机 VO
export interface HostVO {
  id: number // 主机ID
  cloudArea: string // 云区域
  env: string // 环境
  center: string // 数据中心
  team: string // 团队
  user: string // 用户
  area: string // 区域
  promoter: string // 推广者
  ipLan: string // 内网IP
  ipWan: string // 外网IP
  instanceId: string // 云实例ID
  instanceName: string // 云实例名称
  k8sNode: string // 是否K8S节点（Y:是 N:否）
  offline: string // 是否离线（Y:是 N:否）
  cpu: number // CPU核心数(单位: C)
  mem: number // 内存大小（单位：GB）
  notes: string // 备注
  ou: string // 组织单位
  tags: string // 标签
  exporterIp: string // 监控exporterIP
  exporterPort: string // 监控exporter端口
  monitored: string // 是否监控（Y:是 N:否）
}

// CMDB主机 API
export const HostApi = {
  // 查询CMDB主机分页
  getHostPage: async (params: any) => {
    return await request.get({ url: `/cmdb/host/page`, params })
  },

  // 查询CMDB主机详情
  getHost: async (id: number) => {
    return await request.get({ url: `/cmdb/host/get?id=` + id })
  },

  // 新增CMDB主机
  createHost: async (data: HostVO) => {
    return await request.post({ url: `/cmdb/host/create`, data })
  },

  // 修改CMDB主机
  updateHost: async (data: HostVO) => {
    return await request.put({ url: `/cmdb/host/update`, data })
  },

  // 删除CMDB主机
  deleteHost: async (id: number) => {
    return await request.delete({ url: `/cmdb/host/delete?id=` + id })
  },

  // 导出CMDB主机 Excel
  exportHost: async (params) => {
    return await request.download({ url: `/cmdb/host/export-excel`, params })
  },

  // 下载用户导入模板
  importHostTemplate: () => {
    return request.download({ url: '/cmdb/host/get-import-template' })
  },

}
