import request from '@/config/axios'

// MySQL 实例 VO
export interface MysqlVO {
  id: number // 实例编号
  instanceName: string // 实例名称
  hostId: number // 关联主机编号，引用 system_host 的 id
  ipAddress: string // IP 地址
  port: number // 数据库端口
  version: string // MySQL 版本
  username: string // 数据库用户名
  password: string // 数据库密码
  databaseName: string // 默认数据库名
  status: number // 状态，枚举 CommonStatusEnum
  remark: string // 备注
}

// MySQL 实例 API
export const MysqlApi = {
  // 查询MySQL 实例分页
  getMysqlPage: async (params: any) => {
    return await request.get({ url: `/cmdb/mysql/page`, params })
  },

  // 查询MySQL 实例详情
  getMysql: async (id: number) => {
    return await request.get({ url: `/cmdb/mysql/get?id=` + id })
  },

  // 新增MySQL 实例
  createMysql: async (data: MysqlVO) => {
    return await request.post({ url: `/cmdb/mysql/create`, data })
  },

  // 修改MySQL 实例
  updateMysql: async (data: MysqlVO) => {
    return await request.put({ url: `/cmdb/mysql/update`, data })
  },

  // 删除MySQL 实例
  deleteMysql: async (id: number) => {
    return await request.delete({ url: `/cmdb/mysql/delete?id=` + id })
  },

  // 导出MySQL 实例 Excel
  exportMysql: async (params) => {
    return await request.download({ url: `/cmdb/mysql/export-excel`, params })
  },
}