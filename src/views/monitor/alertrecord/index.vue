<template>
  <ContentWrap>
    <!-- Tab 页 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="alert-tabs">
      <el-tab-pane
        v-for="type in monitorTypes"
        :key="type.value"
        :name="type.value"
      >
        <template #label>
          <div class="tab-label">
            <span>{{ type.label }}</span>
            <span class="count-badge" v-if="tabData[type.value]?.firingCount > 0">
              {{ tabData[type.value]?.firingCount }}
            </span>
          </div>
        </template>
        <transition name="fade" mode="out-in">
          <div :key="type.value" class="tab-content">
            <!-- 搜索工作栏 -->
            <el-form
              class="-mb-10px mb-4"
              :model="getTabQueryParams(type.value)"
              :ref="el => setQueryFormRef(type.value, el)"
              :inline="true"
              label-width="85px"
            >
              <el-form-item label="告警名称" prop="alertName">
                <el-input
                  v-model="getTabQueryParams(type.value).alertName"
                  placeholder="请输入告警名称"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item label="告警时间" prop="alertStartTime">
                <el-date-picker
                  v-model="getTabQueryParams(type.value).alertStartTime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item label="恢复时间" prop="alertEndTime">
                <el-date-picker
                  v-model="getTabQueryParams(type.value).alertEndTime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item label="告警来源" prop="alertSource">
                <el-select
                  v-model="getTabQueryParams(type.value).alertSource"
                  placeholder="请选择告警来源"
                  clearable
                  class="!w-220px"
                >
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.ALERT_SOURCE)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="环境信息" prop="env">
                <el-input
                  v-model="getTabQueryParams(type.value).env"
                  placeholder="请输入环境信息"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item label="告警状态" prop="status">
                <el-select
                  v-model="getTabQueryParams(type.value).status"
                  placeholder="请选择告警状态"
                  clearable
                  class="!w-220px"
                >
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.ALERT_STATUS)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="告警内容" prop="summary">
                <el-input
                  v-model="getTabQueryParams(type.value).summary"
                  placeholder="请输入告警内容"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <!-- 只有 monitor_type 为 'pod' 时显示 -->
              <el-form-item v-if="type.value === 'pod'" label="命名空间" prop="namespace">
                <el-input
                  v-model="getTabQueryParams(type.value).namespace"
                  placeholder="请输入命名空间"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item v-if="type.value === 'pod'" label="pod" prop="pod">
                <el-input
                  v-model="getTabQueryParams(type.value).pod"
                  placeholder="请输入pod"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item v-if="type.value === 'mq'" label="vhost" prop="vhost">
                <el-input
                  v-model="getTabQueryParams(type.value).vhost"
                  placeholder="请输入vhost"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item v-if="type.value === 'mq'" label="queue" prop="queue">
                <el-input
                  v-model="getTabQueryParams(type.value).queue"
                  placeholder="请输入queue"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item v-if="type.value === 'k8s_node'" label="node" prop="node">
                <el-input
                  v-model="getTabQueryParams(type.value).node"
                  placeholder="请输入node"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <!--          <el-form-item label="url" prop="url">-->
              <!--            <el-input-->
              <!--              v-model="getTabQueryParams(type.value).url"-->
              <!--              placeholder="请输入url"-->
              <!--              clearable-->
              <!--              @keyup.enter="handleQuery"-->
              <!--              class="!w-220px"-->
              <!--            />-->
              <!--          </el-form-item>-->
              <!--          <el-form-item label="abi_origin_prometheus" prop="abiOriginPrometheus">-->
              <!--            <el-input-->
              <!--              v-model="getTabQueryParams(type.value).abiOriginPrometheus"-->
              <!--              placeholder="请输入abi_origin_prometheus"-->
              <!--              clearable-->
              <!--              @keyup.enter="handleQuery"-->
              <!--              class="!w-220px"-->
              <!--            />-->
              <!--          </el-form-item>-->
              <el-form-item v-if="type.value === 'health_check'" label="name" prop="name">
                <el-input
                  v-model="getTabQueryParams(type.value).name"
                  placeholder="请输入name"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item v-if="type.value === 'health_check'" label="团队" prop="team">
                <el-input
                  v-model="getTabQueryParams(type.value).team"
                  placeholder="请输入团队"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <el-form-item v-if="type.value === 'health_check'" label="instance" prop="instance">
                <el-input
                  v-model="getTabQueryParams(type.value).instance"
                  placeholder="请输入instance"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-220px"
                />
              </el-form-item>
              <!--          <el-form-item label="创建时间" prop="createTime">-->
              <!--            <el-date-picker-->
              <!--              v-model="getTabQueryParams(type.value).createTime"-->
              <!--              value-format="YYYY-MM-DD HH:mm:ss"-->
              <!--              type="daterange"-->
              <!--              start-placeholder="开始日期"-->
              <!--              end-placeholder="结束日期"-->
              <!--              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
              <!--              class="!w-220px"-->
              <!--            />-->
              <!--          </el-form-item>-->
              <el-form-item>
                <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
                <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
                <!--            <el-button-->
                <!--              type="primary"-->
                <!--              plain-->
                <!--              @click="openForm('create')"-->
                <!--              v-hasPermi="['monitor:alert-record:create']"-->
                <!--            >-->
                <!--              <Icon icon="ep:plus" class="mr-5px" /> 新增-->
                <!--            </el-button>-->
                <el-button
                  type="success"
                  plain
                  @click="handleExport"
                  :loading="exportLoading"
                  v-hasPermi="['monitor:alert-record:export']"
                >
                  <Icon icon="ep:download" class="mr-5px" /> 导出
                </el-button>
              </el-form-item>
            </el-form>

            <!-- 列表 -->
            <el-table
              v-loading="tabData[type.value]?.loading ?? true"
              :data="tabData[type.value]?.list ?? []"
              :stripe="true"
              :show-overflow-tooltip="true"
            >
              <el-table-column label="环境信息" align="center" prop="env" width="100px"/>
              <el-table-column label="告警来源" align="center" prop="alertSource" width="100px">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.ALERT_SOURCE" :value="scope.row.alertSource" />
                </template>
              </el-table-column>
              <el-table-column label="告警名称" align="center" prop="alertName" width="400px"/>
              <el-table-column label="告警状态" align="center" prop="status" width="90px">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.ALERT_STATUS" :value="scope.row.status" />
                </template>
              </el-table-column>
              <el-table-column
                label="告警时间"
                align="center"
                prop="alertStartTime"
                :formatter="dateFormatter"
                width="160px"
              />
              <el-table-column
                label="恢复时间"
                align="center"
                prop="alertEndTime"
                :formatter="dateFormatter"
                width="160px"
              />
              <el-table-column
                label="持续时间"
                align="center"
                width="180px"
              >
                <template #default="scope">
                  <span
                    :style="{
                      fontWeight: 'bold',
                      color: scope.row.status === 'firing' ? 'red' : scope.row.status === 'resolved' ? 'green' : 'inherit'
                    }"
                  >
                    {{ formatDuration(scope.row.alertStartTime, scope.row.alertEndTime) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="type.value === 'pod'" label="命名空间" align="center" prop="namespace" />
              <el-table-column v-if="type.value === 'pod'" label="pod" align="center" prop="pod" />
              <el-table-column v-if="type.value === 'mq'" label="vhost" align="center" prop="vhost" />
              <el-table-column v-if="type.value === 'mq'" label="queue" align="center" prop="queue" />
              <el-table-column v-if="type.value === 'k8s_node'" label="node" align="center" prop="node" />
              <el-table-column v-if="type.value === 'health_check'" label="name" align="center" prop="name" width="180px"/>
              <el-table-column v-if="type.value === 'health_check'" label="团队" align="center" prop="team" width="180px"/>
              <el-table-column v-if="type.value === 'health_check'" label="instance" align="center" prop="instance" width="460px">
                <template #default="{ row }">
                  <a :href="row.instance" target="_blank">{{ row.instance }}</a>
                </template>
              </el-table-column>
              <el-table-column label="summary" align="center" prop="summary" width="450px"/>
              <!--          <el-table-column label="description" align="center" prop="description" />-->
              <!--          <el-table-column label="告警类型" align="center" prop="monitorType" />-->
              <!--          <el-table-column label="url" align="center" prop="url" />-->
              <!--          <el-table-column label="abi_origin_prometheus" align="center" prop="abiOriginPrometheus" />-->
              <el-table-column label="操作" align="center" min-width="120px" fixed="right">
                <template #default="scope">
                  <!--                  <el-button-->
                  <!--                    link-->
                  <!--                    type="primary"-->
                  <!--                    @click="openForm('update', scope.row.id)"-->
                  <!--                    v-hasPermi="['monitor:alert-record:update']"-->
                  <!--                  >-->
                  <!--                    编辑-->
                  <!--                  </el-button>-->
                  <el-button
                    link
                    type="danger"
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['monitor:alert-record:delete']"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <Pagination
              :total="tabData[type.value]?.total ?? 0"
              v-model:page="getTabQueryParams(type.value).pageNo"
              v-model:limit="getTabQueryParams(type.value).pageSize"
              @pagination="getList"
            />
          </div>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AlertRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AlertRecordApi, AlertRecordVO } from '@/api/monitor/alertrecord'
import AlertRecordForm from './AlertRecordForm.vue'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { onMounted, onUnmounted, ref, reactive } from 'vue'

/** 告警记录 列表 */
defineOptions({ name: 'AlertRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const activeTab = ref('') // Current active Tab
const monitorTypes = ref<{ label: string; value: string }[]>([]) // Dynamic monitor_type list
const tabQueryParams = ref<Record<string, any>>({}) // Query params for each Tab
const tabData = ref<
  Record<string, { loading: boolean; list: AlertRecordVO[]; total: number; firingCount: number }>
>({}) // List data for each Tab
const queryFormRefs = ref<Record<string, any>>({}) // Form refs for each Tab
const exportLoading = ref(false) // Export loading state

// 自动刷新定时器引用，使用 NodeJS.Timeout 修复类型错误
let refreshInterval: NodeJS.Timeout | null = null

/** Get or create Tab's queryParams */
const getTabQueryParams = (tabValue: string) => {
  if (!tabQueryParams.value[tabValue]) {
    tabQueryParams.value[tabValue] = reactive({
      pageNo: 1,
      pageSize: 10,
      alertName: undefined,
      alertStartTime: [],
      alertEndTime: [],
      alertSource: undefined,
      env: undefined,
      monitorType: tabValue, // Fixed monitorType for each Tab
      status: undefined,
      namespace: undefined,
      pod: undefined,
      instance: undefined,
      vhost: undefined,
      queue: undefined,
      node: undefined,
      url: undefined,
      abiOriginPrometheus: undefined,
      name: undefined,
      team: undefined,
      summary: undefined,
      description: undefined,
      createTime: [],
    })
  }
  return tabQueryParams.value[tabValue]
}

/** Get or create Tab's data */
const getTabData = (tabValue: string) => {
  if (!tabData.value[tabValue]) {
    tabData.value[tabValue] = reactive({
      loading: true,
      list: [],
      total: 0,
      firingCount: 0,
    })
  }
  return tabData.value[tabValue]
}

/** Set form reference */
const setQueryFormRef = (tabValue: string, el: any) => {
  if (el) {
    queryFormRefs.value[tabValue] = el
  }
}

/** Fetch firing count for a specific tab */
const fetchFiringCount = async (tabValue: string) => {
  const params = { ...getTabQueryParams(tabValue), status: 'firing', pageNo: 1, pageSize: 1 }
  const currentData = getTabData(tabValue)
  try {
    const data = await AlertRecordApi.getAlertRecordPage(params)
    currentData.firingCount = data.total
  } catch {
    currentData.firingCount = 0
  }
}

/** Fetch data for a specific tab */
const fetchTabData = async (tabValue: string) => {
  const currentParams = getTabQueryParams(tabValue)
  const currentData = getTabData(tabValue)
  currentData.loading = true
  try {
    const data = await AlertRecordApi.getAlertRecordPage(currentParams)
    currentData.list = data.list
    currentData.total = data.total
    await fetchFiringCount(tabValue)
  } finally {
    currentData.loading = false
  }
}

/** Fetch monitor_type list and initialize all tabs */
const fetchMonitorTypes = async () => {
  monitorTypes.value = getStrDictOptions(DICT_TYPE.ALERT_TYPE)
  if (monitorTypes.value.length > 0) {
    activeTab.value = monitorTypes.value[0].value
    // Initialize all tabs' queryParams and data
    for (const type of monitorTypes.value) {
      getTabQueryParams(type.value)
      getTabData(type.value)
      await fetchTabData(type.value) // Load data for each tab
    }
  }
}

/** Query list for current tab */
const getList = async () => {
  await fetchTabData(activeTab.value)
}

/** Search button operation */
const handleQuery = () => {
  const currentParams = getTabQueryParams(activeTab.value)
  currentParams.pageNo = 1
  getList()
}

/** Reset button operation */
const resetQuery = () => {
  const currentTab = activeTab.value
  const currentFormRef = queryFormRefs.value[currentTab]
  if (currentFormRef) {
    currentFormRef.resetFields()
  }
  const currentParams = getTabQueryParams(currentTab)
  Object.assign(currentParams, {
    pageNo: 1,
    pageSize: 10,
    alertName: undefined,
    alertStartTime: [],
    alertEndTime: [],
    alertSource: undefined,
    env: undefined,
    status: undefined,
    namespace: undefined,
    pod: undefined,
    instance: undefined,
    vhost: undefined,
    queue: undefined,
    node: undefined,
    url: undefined,
    abiOriginPrometheus: undefined,
    name: undefined,
    team: undefined,
    summary: undefined,
    description: undefined,
    createTime: [],
  })
  currentParams.monitorType = currentTab // Preserve monitorType
  getList()
}

/** Tab change operation */
const handleTabChange = (tabValue: string) => {
  activeTab.value = tabValue
  getTabQueryParams(tabValue) // Ensure queryParams initialized
  getTabData(tabValue) // Ensure data initialized
  getList() // Load new Tab's data
}

/** Add/Edit operation */
const formRef = ref()
// const openForm = (type: string, id?: number) => {
//   formRef.value.open(type, id)
// }

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await AlertRecordApi.deleteAlertRecord(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** Export button operation */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const currentParams = getTabQueryParams(activeTab.value)
    const data = await AlertRecordApi.exportAlertRecord(currentParams)
    download.excel(data, '告警记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** Initialize and set up auto-refresh for all tabs */
onMounted(() => {
  fetchMonitorTypes()
  // 设置每60秒自动刷新所有选项卡数据
  refreshInterval = setInterval(() => {
    monitorTypes.value.forEach(type => {
      fetchTabData(type.value)
    })
  }, 60000)
})

/** Clear auto-refresh timer when component is unmounted */
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})

const formatDuration = (startTime, endTime) => {
  // 检查输入是否有效
  if (!startTime) {
    return '无效时间';
  }

  const start = new Date(startTime);
  // 验证 start 是否为有效日期
  if (isNaN(start.getTime())) {
    return '无效开始时间';
  }

  const end = endTime ? new Date(endTime) : new Date();
  // 验证 end 是否为有效日期
  if (endTime && isNaN(end.getTime())) {
    return '无效结束时间';
  }

  // 转换为毫秒数以确保类型为 number
  const diffMs = end.getTime() - start.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  let result = '';
  if (days > 0) result += `${days}天`;
  if (hours > 0 || days > 0) result += `${hours}小时`;
  if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}分`;
  result += `${seconds}秒`;

  return result || '0秒';
};
</script>

<style scoped>
/* Tab header */
:deep(.el-tabs__header) {
  background-color: #f5f7fa;
  padding: 10px 20px; /* 增加左右两侧的内边距 */
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Tab navigation container */
:deep(.el-tabs__nav) {
  padding: 0 10px; /* 确保左右两侧有足够的空间 */
}

/* Tab item */
:deep(.el-tabs__item) {
  display: flex;
  justify-content: center; /* 让文本在标签内居中 */
  align-items: center;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 0 2px; /* 标签之间的统一间距 */
  text-align: center;
  position: relative; /* 为徽章定位 */
}

/* Active tab */
:deep(.el-tabs__item.is-active) {
  background-color: #409eff;
  color: #ffffff;
  font-weight: bold;
  padding: 10px 20px; /* 确保激活状态下内边距一致 */
}

/* Hover effect */
:deep(.el-tabs__item:hover) {
  background-color: #e6f1ff;
  color: #409eff;
  transform: scale(1.05); /* 悬停时轻微放大 */
}

/* Active bar */
:deep(.el-tabs__active-bar) {
  display: none; /* 隐藏默认的活动条，因为我们使用背景色来表示活动状态 */
}

/* Tab content */
:deep(.el-tabs__content) {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 自定义标签标签容器 */
.tab-label {
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 16px; /* 为徽章留出空间 */
  width: 100%; /* 确保整个标签宽度一致 */
  justify-content: center; /* 内容居中 */
}

.tab-label span {
  font-size: 14px; /* Smaller font size for the label text */
}

/* 数量徽章 */
.count-badge {
  position: absolute;
  top: -8px;
  right: 0;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
  background-color: #ff4d4f; /* 提醒的亮红色 */
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 微妙的阴影 */
  transition: transform 0.2s ease; /* 平滑的悬停动画 */
}

/* Badge hover effect */
:deep(.el-tabs__item:hover) .count-badge {
  transform: scale(1.1); /* 悬停时轻微放大 */
}

/* 添加特定的类以便于在需要时覆盖Element Plus的默认样式 */
.alert-tabs :deep(.el-tabs__nav-wrap) {
  margin-bottom: 0; /* 移除底部的默认间距 */
}

.alert-tabs :deep(.el-tabs__nav) {
  display: flex;
  width: 100%;
}

.alert-tabs :deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tab content container */
.tab-content {
  padding: 10px;
}

/* Responsive design */
@media (max-width: 768px) {
  :deep(.el-tabs__header) {
    padding: 8px 10px; /* 调整小屏幕的内边距 */
  }

  :deep(.el-tabs__nav) {
    padding: 0 5px; /* 调整小屏幕的内边距 */
  }

  :deep(.el-tabs__item) {
    padding: 8px 12px;
    font-size: 14px;
  }

  :deep(.el-tabs__content) {
    padding: 10px;
  }

  :deep(.el-form--inline .el-form-item) {
    display: block;
    margin-bottom: 10px;
  }

  :deep(.el-form-item__content) {
    width: 100% !important;
  }

  .count-badge {
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 10px;
    top: -6px;
    right: -2px;
  }

  .tab-label {
    padding-right: 14px; /* 调整小屏幕下的徽章空间 */
  }
}

/* Custom spacing */
.mb-4 {
  margin-bottom: 1rem;
}

/* 自定义按钮样式 */
.el-button--link {
  margin-right: 8px;
  transition: all 0.3s;
}

.el-button--link:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 固定列样式 */
:deep(.el-table__column--fixed-right) {
  background: #fff;
  z-index: 1;
}
</style>
