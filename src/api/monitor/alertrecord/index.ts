import request from '@/config/axios'

// 告警记录 VO
export interface AlertRecordVO {
  id: number // 告警记录-ID
  alertName: string // 告警名称
  alertStartTime: Date // 告警开始时间
  alertEndTime: Date // 告警结束时间
  alertSource: string // 告警来源
  env: string // 环境信息
  monitorType: string // 告警类型
  status: string // 告警状态
  namespace: string // 命名空间
  pod: string // pod
  instance: string // instance
  vhost: string // vhost
  queue: string // queue
  node: string // node
  url: string // url
  abiOriginPrometheus: string // abi_origin_prometheus
  name: string // name
  team: string // 团队
  summary: string // summary
  description: string // description
}

// 告警记录 API
export const AlertRecordApi = {
  // 查询告警记录分页
  getAlertRecordPage: async (params: any) => {
    return await request.get({ url: `/monitor/alert-record/page`, params })
  },

  // 查询告警记录详情
  getAlertRecord: async (id: number) => {
    return await request.get({ url: `/monitor/alert-record/get?id=` + id })
  },

  // 新增告警记录
  createAlertRecord: async (data: AlertRecordVO) => {
    return await request.post({ url: `/monitor/alert-record/create`, data })
  },

  // 修改告警记录
  updateAlertRecord: async (data: AlertRecordVO) => {
    return await request.put({ url: `/monitor/alert-record/update`, data })
  },

  // 删除告警记录
  deleteAlertRecord: async (id: number) => {
    return await request.delete({ url: `/monitor/alert-record/delete?id=` + id })
  },

  // 导出告警记录 Excel
  exportAlertRecord: async (params) => {
    return await request.download({ url: `/monitor/alert-record/export-excel`, params })
  },
}