<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-20px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="85px"
    >
      <el-form-item label="云区域" prop="cloudArea">
        <el-select
          v-model="queryParams.cloudArea"
          placeholder="请选择云区域"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_CLOUD_AREA)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="环境" prop="env">
        <el-select v-model="queryParams.env" placeholder="请选择环境" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_ENV)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="center">
        <el-select
          v-model="queryParams.center"
          placeholder="请选择部门"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_CENTER)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="团队" prop="team">
        <el-select
          v-model="queryParams.team"
          placeholder="请选择团队"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_TEAM)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="命名空间" prop="namespace">
        <el-input
          v-model="queryParams.namespace"
          placeholder="请输入命名空间"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="控制器" prop="deployment">-->
<!--        <el-input-->
<!--          v-model="queryParams.deployment"-->
<!--          placeholder="请输入控制器"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="副本数" prop="replicas">-->
<!--        <el-input-->
<!--          v-model="queryParams.replicas"-->
<!--          placeholder="请输入副本数"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['cmdb:namespace:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['cmdb:namespace:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="warning" plain @click="handleImport" v-hasPermi="['cmdb:namespace:import']">
          <Icon icon="ep:upload" /> 导入
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="namespace实例-ID" align="center" prop="id" />-->
      <el-table-column label="云区域" align="center" prop="cloudArea" width="185px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_CLOUD_AREA" :value="scope.row.cloudArea" />
        </template>
      </el-table-column>
      <el-table-column label="环境" align="center" prop="env" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_ENV" :value="scope.row.env" />
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" prop="center" width="150px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_CENTER" :value="scope.row.center" />
        </template>
      </el-table-column>
      <el-table-column label="团队" align="center" prop="team" width="150px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_TEAM" :value="scope.row.team" width="320px"/>
        </template>
      </el-table-column>
      <el-table-column label="命名空间" align="center" prop="namespace" />
<!--      <el-table-column label="控制器" align="center" prop="deployment" />-->
<!--      <el-table-column label="副本数" align="center" prop="replicas" />-->
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        align="center"-->
<!--        prop="createTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
      <el-table-column label="操作" align="center" min-width="120px" fixed="right" v-if="hasUpdatePerm || hasDeletePerm">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['cmdb:namespace:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['cmdb:namespace:delete']"
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
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <NamespaceForm ref="formRef" @success="getList" />

  <NamespaceImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { NamespaceApi, NamespaceVO } from '@/api/cmdb/namespace'
import NamespaceForm from './NamespaceForm.vue'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import NamespaceImportForm from "@/views/cmdb/namespace/NamespaceImportForm.vue";
import {useUserStore} from "@/store/modules/user";

/** CMDB-namespace 列表 */
defineOptions({ name: 'Namespace' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const userStore = useUserStore()
const loading = ref(true) // 列表的加载中
const list = ref<NamespaceVO[]>([]) // 列表的数据
// const showMore = ref(false) // 控制更多搜索条件的显示/隐藏
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cloudArea: undefined,
  env: undefined,
  center: undefined,
  team: undefined,
  namespace: undefined,
  deployment: undefined,
  replicas: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 切换更多搜索条件的显示/隐藏 */
// const toggleMore = () => {
//   showMore.value = !showMore.value
// }

/** Namespace导入 */
const importFormRef = ref()
const handleImport = () => {
  importFormRef.value.open()
}

const hasUpdatePerm = computed(() => {
  return userStore.permissions.has('cmdb:namespace:update');
});

const hasDeletePerm = computed(() => {
  return userStore.permissions.has('cmdb:namespace:delete');
});

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await NamespaceApi.getNamespacePage(queryParams)
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
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await NamespaceApi.deleteNamespace(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await NamespaceApi.exportNamespace(queryParams)
    download.excel(data, 'CMDB-namespace.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
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
