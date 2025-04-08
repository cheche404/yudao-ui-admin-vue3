import request from '@/config/axios'

// CMDB对象属性 VO
export interface AttributeVO {
  id: number // 属性id
  name: string // 属性名称
  code: string // 属性编码
  modelId: number // 所属对象id（关联cmdb_model表的id）
  sort: number // 排序号
  attrType: number // 属性类型（0:字符串, 1:整数, 2:日期, 3:布尔值, 4:浮点数等）
  validationRule: string // 属性校验规则（如正则表达式或长度限制）
  isRequired: boolean // 是否必填（0否 1是）
  isEditable: boolean // 是否能编辑（0否 1是）
  isSingleLine: boolean // 是否单行展示（0否，一行展示两个属性；1是，单独一行展示）
  description: string // 属性描述
}

// CMDB对象属性 API
export const AttributeApi = {
  // 查询CMDB对象属性分页
  getAttributePage: async (params: any) => {
    return await request.get({ url: `/cmdb/attribute/page`, params })
  },

  // 查询CMDB对象属性详情
  getAttribute: async (id: number) => {
    return await request.get({ url: `/cmdb/attribute/get?id=` + id })
  },

  // 新增CMDB对象属性
  createAttribute: async (data: AttributeVO) => {
    return await request.post({ url: `/cmdb/attribute/create`, data })
  },

  // 修改CMDB对象属性
  updateAttribute: async (data: AttributeVO) => {
    return await request.put({ url: `/cmdb/attribute/update`, data })
  },

  // 删除CMDB对象属性
  deleteAttribute: async (id: number) => {
    return await request.delete({ url: `/cmdb/attribute/delete?id=` + id })
  },

  // 导出CMDB对象属性 Excel
  exportAttribute: async (params) => {
    return await request.download({ url: `/cmdb/attribute/export-excel`, params })
  },
}