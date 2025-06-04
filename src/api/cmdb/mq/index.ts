import request from '@/config/axios'

// CMDB-MQ VO
export interface MqVO {
  id: number // MQ实例-ID
  cloudArea: string // 云区域
  env: string // 环境
  center: string // 数据中心
  team: string // 团队
  user: string // 用户
  promoter: string // 负责人
  host: string // 域名
  docker: string // docker
  nodes: string // 主机信息
  clusterName: string // 集群名称
  location: string // 自建
  notesInfo: string // 备注
  exporterIp: string // exporter-ip
  exporterPort: string // exporter端口
  monitored: string // 监控
}

// CMDB-MQ API
export const MqApi = {
  // 查询CMDB-MQ分页
  getMqPage: async (params: any) => {
    return await request.get({ url: `/cmdb/mq/page`, params })
  },

  // 查询CMDB-MQ详情
  getMq: async (id: number) => {
    return await request.get({ url: `/cmdb/mq/get?id=` + id })
  },

  // 新增CMDB-MQ
  createMq: async (data: MqVO) => {
    return await request.post({ url: `/cmdb/mq/create`, data })
  },

  // 修改CMDB-MQ
  updateMq: async (data: MqVO) => {
    return await request.put({ url: `/cmdb/mq/update`, data })
  },

  // 删除CMDB-MQ
  deleteMq: async (id: number) => {
    return await request.delete({ url: `/cmdb/mq/delete?id=` + id })
  },

  // 导出CMDB-MQ Excel
  exportMq: async (params) => {
    return await request.download({ url: `/cmdb/mq/export-excel`, params })
  },

  // 下载Mq导入模板
  importMqTemplate: () => {
    return request.download({ url: '/cmdb/mq/get-import-template' })
  },
}
