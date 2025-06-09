import request from '@/config/axios'

export interface CMDBResourceNumVO {
  resourceType: string
  count: number
  icon: string
  menuName: string
  resourceNumVOs: ResourceNumVO[]
}

export interface ResourceNumVO {
  cloudArea: string
  num: number
  icon: string
}

// StatisticsApi
export const StatisticsApi = {

  getResourceNum: async () => {
    return await request.get({ url: `/cmdb/statistics/get-resource-num` })
  },

}
