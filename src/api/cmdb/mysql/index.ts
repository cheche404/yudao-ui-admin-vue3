import request from '@/config/axios'

// CMDB-MySQL VO
export interface MysqlVO {
  id: number // MySQL实例-ID
  cloudArea: string // 云区域
  env: string // 环境
  center: string // 部门
  team: string // 团队
  user: string // 用户
  instanceId: string // 云实例ID
  instanceName: string // 云实例名称
  host: string // 域名
  clusterType: string // 实例部署方式
  storage: number // 存储大小（单位：GB）
  location: string // location
  notes: string // 备注
  offline: string // 是否离线
  ou: string // 组织单位
  tags: string // 标签
  exporterIp: string // 监控exporterIP
  exporterPort: string // 监控exporter端口
  monitored: string // 监控
}

// CMDB-MySQL API
export const MysqlApi = {
  // 查询CMDB-MySQL分页
  getMysqlPage: async (params: any) => {
    return await request.get({ url: `/cmdb/mysql/page`, params })
  },

  // 查询CMDB-MySQL详情
  getMysql: async (id: number) => {
    return await request.get({ url: `/cmdb/mysql/get?id=` + id })
  },

  // 新增CMDB-MySQL
  createMysql: async (data: MysqlVO) => {
    return await request.post({ url: `/cmdb/mysql/create`, data })
  },

  // 修改CMDB-MySQL
  updateMysql: async (data: MysqlVO) => {
    return await request.put({ url: `/cmdb/mysql/update`, data })
  },

  // 删除CMDB-MySQL
  deleteMysql: async (id: number) => {
    return await request.delete({ url: `/cmdb/mysql/delete?id=` + id })
  },

  // 导出CMDB-MySQL Excel
  exportMysql: async (params) => {
    return await request.download({ url: `/cmdb/mysql/export-excel`, params })
  },

  // 下载Mysql导入模板
  importMysqlTemplate: () => {
    return request.download({ url: '/cmdb/mysql/get-import-template' })
  },
}
