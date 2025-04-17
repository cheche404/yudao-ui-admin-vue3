import request from '@/config/axios'

// CMDB-Redis VO
export interface RedisVO {
  id: number // Redis实例-ID
  cloudArea: string // 云区域
  env: string // 环境
  center: string // 数据中心
  team: string // 团队
  user: string // 用户
  promoter: string // 推广者
  instanceId: string // 实例ID
  instanceName: string // 实例名称
  host: string // 域名
  hostReadonly: string // 域名只读
  clusterType: string // 部署方式
  port: string // 端口
  passwd: string // 密码
  mem: number // 内存大小(GB)
  offline: string // 离线
  location: string // location
  notes: string // 备注
  ou: string // 组织单位
  tags: string // 标签
  nodeInfo: string // 主机信息
  exporterIp: string // exporter-ip
  exporterPort: string // exporter端口
  monitored: string // 监控
}

// CMDB-Redis API
export const RedisApi = {
  // 查询CMDB-Redis分页
  getRedisPage: async (params: any) => {
    return await request.get({ url: `/cmdb/redis/page`, params })
  },

  // 查询CMDB-Redis详情
  getRedis: async (id: number) => {
    return await request.get({ url: `/cmdb/redis/get?id=` + id })
  },

  // 新增CMDB-Redis
  createRedis: async (data: RedisVO) => {
    return await request.post({ url: `/cmdb/redis/create`, data })
  },

  // 修改CMDB-Redis
  updateRedis: async (data: RedisVO) => {
    return await request.put({ url: `/cmdb/redis/update`, data })
  },

  // 删除CMDB-Redis
  deleteRedis: async (id: number) => {
    return await request.delete({ url: `/cmdb/redis/delete?id=` + id })
  },

  // 导出CMDB-Redis Excel
  exportRedis: async (params) => {
    return await request.download({ url: `/cmdb/redis/export-excel`, params })
  },

  // 下载Redis导入模板
  importMysqlTemplate: () => {
    return request.download({ url: '/cmdb/redis/get-import-template' })
  },
}
