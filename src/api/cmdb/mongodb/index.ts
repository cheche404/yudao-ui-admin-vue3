import request from '@/config/axios'

// CMDB-MongoDB VO
export interface MongodbVO {
  id: number // MongoDB实例-ID
  cloudArea: string // 云区域
  env: string // 环境
  center: string // 数据中心
  team: string // 团队
  user: string // 用户
  promoter: string // 负责人
  instanceId: string // 实例ID
  instanceName: string // 实例名称
  host: string // 域名
  clusterType: string // 部署方式
  cpu: number // CPU(核)
  mem: number // 内存大小(GB)
  storage: number // 磁盘大小(GB)
  location: string // 自建
  notes: string // 备注
  offline: string // 离线
  ou: string // 组织单位
  tags: string // 标签
  nodeInfo: string // 主机信息
  exporterIp: string // exporter-ip
  exporterPort: string // exporter端口
  monitored: string // 监控
}

// CMDB-MongoDB API
export const MongodbApi = {
  // 查询CMDB-MongoDB分页
  getMongodbPage: async (params: any) => {
    return await request.get({ url: `/cmdb/mongodb/page`, params })
  },

  // 查询CMDB-MongoDB详情
  getMongodb: async (id: number) => {
    return await request.get({ url: `/cmdb/mongodb/get?id=` + id })
  },

  // 新增CMDB-MongoDB
  createMongodb: async (data: MongodbVO) => {
    return await request.post({ url: `/cmdb/mongodb/create`, data })
  },

  // 修改CMDB-MongoDB
  updateMongodb: async (data: MongodbVO) => {
    return await request.put({ url: `/cmdb/mongodb/update`, data })
  },

  // 删除CMDB-MongoDB
  deleteMongodb: async (id: number) => {
    return await request.delete({ url: `/cmdb/mongodb/delete?id=` + id })
  },

  // 导出CMDB-MongoDB Excel
  exportMongodb: async (params) => {
    return await request.download({ url: `/cmdb/mongodb/export-excel`, params })
  },

  // 下载MongoDB导入模板
  importMongodbTemplate: () => {
    return request.download({ url: '/cmdb/mongodb/get-import-template' })
  },
}
