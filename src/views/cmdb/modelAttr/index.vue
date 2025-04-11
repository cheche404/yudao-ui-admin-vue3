<template>
  <el-row :gutter="20">
    <!-- 左侧对象树 -->
    <el-col :span="4" :xs="24">
      <ContentWrap class="h-1/1">
        <ModelTree @node-click="handleModelNodeClick" />
      </ContentWrap>
    </el-col>
    <el-col :span="20" :xs="24">
      <!-- 使用 el-tabs 包裹右侧内容 -->
      <ContentWrap>
        <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
          <!-- Tab 1: 属性列表 -->
          <el-tab-pane label="属性" name="attributes">
            <!-- 搜索栏 -->
            <el-form
              class="-mb-15px"
              :model="queryParams"
              ref="queryFormRef"
              :inline="true"
              label-width="68px"
            >
              <el-form-item label="名称" prop="name">
                <el-input
                  v-model="queryParams.name"
                  placeholder="请输入属性名称"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-240px"
                />
              </el-form-item>
              <el-form-item label="编码" prop="code">
                <el-input
                  v-model="queryParams.code"
                  placeholder="请输入属性编码"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-240px"
                />
              </el-form-item>
              <el-form-item label="属性类型" prop="attrType">
                <el-select
                  v-model="queryParams.attrType"
                  placeholder="请选择属性类型"
                  clearable
                  class="!w-240px"
                >
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_MODEL_ATTR_DATA_TYPE)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
                <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
                <el-button
                  type="primary"
                  plain
                  @click="openForm('create')"
                  v-hasPermi="['cmdb:attribute:create']"
                >
                  <Icon icon="ep:plus" class="mr-5px" /> 新增
                </el-button>
                <el-button
                  type="success"
                  plain
                  @click="handleExport"
                  :loading="exportLoading"
                  v-hasPermi="['cmdb:attribute:export']"
                >
                  <Icon icon="ep:download" class="mr-5px" /> 导出
                </el-button>
              </el-form-item>
            </el-form>
            <!-- 表格 -->
            <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
              <el-table-column label="名称" align="center" prop="name" />
              <el-table-column label="编码" align="center" prop="code" />
              <el-table-column label="排序号" align="center" prop="sort" />
              <el-table-column label="属性类型" align="center" prop="attrType" min-width="100">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.CMDB_MODEL_ATTR_DATA_TYPE" :value="scope.row.attrType" />
                </template>
              </el-table-column>
              <el-table-column label="是否必填" align="center" prop="isRequired">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.CMDB_YES_NO_TYPE" :value="scope.row.isRequired" />
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                :formatter="dateFormatter"
                width="180px"
              />
              <el-table-column label="操作" align="center" min-width="120px">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    @click="openForm('update', scope.row.id)"
                    v-hasPermi="['cmdb:attribute:update']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['cmdb:attribute:delete']"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <Pagination
              :total="total"
              v-model:page="queryParams.pageNo"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
            />
          </el-tab-pane>

          <!-- Tab 2: 其他信息 -->
          <el-tab-pane label="关系" name="relationship">
            <div class="p-20px">
              <p>这里可以展示与所选对象相关的其他信息（待实现）。</p>
              <p>当前选中的 modelId: {{ queryParams.modelId }}</p>
            </div>
          </el-tab-pane>

          <!-- Tab 3: 统计数据 -->
          <el-tab-pane label="统计数据" name="stats">
            <div class="p-20px">
              <p>这里可以展示与所选对象的统计数据（待实现）。</p>
              <p>当前选中的 modelId: {{ queryParams.modelId }}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
    </el-col>
  </el-row>

  <!-- 表单弹窗：添加/修改 -->
  <AttributeForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AttributeApi, AttributeVO } from '@/api/cmdb/attribute'
import AttributeForm from './AttributeForm.vue'
import ModelTree from './ModelTree.vue'

defineOptions({ name: 'ModelAttr' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AttributeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  code: undefined,
  modelId: undefined,
  sort: undefined,
  attrType: undefined,
  validationRule: undefined,
  isRequired: undefined,
  isEditable: undefined,
  isSingleLine: undefined,
  description: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const activeTab = ref('attributes') // 当前激活的 Tab

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AttributeApi.getAttributePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (type === 'create') {
    if (!queryParams.modelId || queryParams.modelId === -1) {
      ElMessage({
        message: '请选中叶子节点',
        type: 'warning',
      })
      return
    }
    formRef.value.open(type, id, queryParams.modelId)
  } else {
    formRef.value.open(type, id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await AttributeApi.deleteAttribute(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await AttributeApi.exportAttribute(queryParams)
    download.excel(data, 'CMDB对象属性.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 处理对象被点击 */
const handleModelNodeClick = async (row) => {
  queryParams.modelId = row.id
  await getList()
}

/** Tab 点击事件 */
const handleTabClick = (tab: any) => {
  // 可根据 Tab 切换加载不同数据
  if (tab.props.name === 'attributes') {
    getList()
  } else if (tab.props.name === 'relationship') {
    // TODO: 加载其他信息数据
    console.log('加载其他信息')
  } else if (tab.props.name === 'stats') {
    // TODO: 加载统计数据
    console.log('加载统计数据')
  }
}

/** 初始化 **/
onMounted(() => {
  queryParams.modelId = -1
  getList()
})
</script>
