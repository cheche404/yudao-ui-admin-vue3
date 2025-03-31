import request from '@/config/axios'

export interface HostVO {
  id?: number
  hostname: string
  ipAddress: string
  osType: number
  cpuCores: number
  memorySize: number
  diskSize: number
  sshPort: number
  sshUsername: string
  sshPassword?: string
  status: number
  remark?: string
  createTime?: Date
}

export interface HostPageReqVO extends PageParam {
  hostname?: string
  ipAddress?: string
  osType?: number
  status?: number
}

// 查询主机列表
export const getHostPage = (params: HostPageReqVO) => {
  return request.get({ url: '/system/host/page', params })
}

// 查询主机详情
export const getHost = (id: number) => {
  return request.get({ url: `/system/host/get?id=${id}` })
}

// 新增主机
export const createHost = (data: HostVO) => {
  return request.post({ url: '/system/host/create', data })
}

// 修改主机
export const updateHost = (data: HostVO) => {
  return request.put({ url: '/system/host/update', data })
}

// 删除主机
export const deleteHost = (id: number) => {
  return request.delete({ url: `/system/host/delete?id=${id}` })
}

// 导出主机
export const exportHost = (params: HostPageReqVO) => {
  return request.download({ url: '/system/host/export', params })
}

// 获取主机列表（精简版本）
export const getSimpleHostList = () => {
  return request.get({ url: '/system/host/list-all-simple' })
}
