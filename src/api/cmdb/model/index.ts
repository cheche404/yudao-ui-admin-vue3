import request from '@/config/axios'

export interface ModelVO {
  id?: number
  name: string
  code: string
  parentId: number
  sort: number
  description?: string
  icon?: string
  status: number
  createTime?: Date
}

// 查询模型（精简)列表
export const getSimpleModelList = async (): Promise<ModelVO[]> => {
  return await request.get({ url: '/cmdb/model/simple-list' })
}

// 查询模型列表
export const getModelPage = async (params: PageParam) => {
  return await request.get({ url: '/cmdb/model/list', params })
}

// 查询模型详情
export const getModel = async (id: number) => {
  return await request.get({ url: '/cmdb/model/get?id=' + id })
}

// 新增模型
export const createModel = async (data: ModelVO) => {
  return await request.post({ url: '/cmdb/model/create', data })
}

// 修改模型
export const updateModel = async (data: ModelVO) => {
  return await request.put({ url: '/cmdb/model/update', data })
}

// 删除模型
export const deleteModel = async (id: number) => {
  return await request.delete({ url: '/cmdb/model/delete?id=' + id })
}
