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
      <!-- 默认显示的前 8 个条件（2 行，每行 4 个） -->
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
      <el-form-item label="数据中心" prop="center">
        <el-select
          v-model="queryParams.center"
          placeholder="请选择数据中心"
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
          placeholder="请选择数据中心"
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
      <el-form-item label="用户" prop="user">
        <el-input
          v-model="queryParams.user"
          placeholder="请输入用户"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <el-select v-model="queryParams.area" placeholder="请选择区域" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_AREA)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="promoter">
        <el-input
          v-model="queryParams.promoter"
          placeholder="请输入负责人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="内网IP" prop="ipLan">
        <el-input
          v-model="queryParams.ipLan"
          placeholder="请输入内网IP"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <!-- 可折叠的剩余条件 -->
      <el-form-item label="外网IP" prop="ipWan" v-show="showMore">
        <el-input
          v-model="queryParams.ipWan"
          placeholder="请输入外网IP"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="实例ID" prop="instanceId" v-show="showMore">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入实例ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="实例名称" prop="instanceName" v-show="showMore">
        <el-input
          v-model="queryParams.instanceName"
          placeholder="请输入实例名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="K8S节点" prop="k8sNode" v-show="showMore">
        <el-select v-model="queryParams.k8sNode" placeholder="请选择" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_Y_N_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="离线" prop="offline" v-show="showMore">
        <el-select v-model="queryParams.offline" placeholder="请选择" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_Y_N_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CPU" prop="cpu" v-show="showMore">
        <el-input
          v-model="queryParams.cpu"
          placeholder="请输入CPU核心数"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="内存大小" prop="mem" v-show="showMore">
        <el-input
          v-model="queryParams.mem"
          placeholder="请输入内存大小"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="notes" v-show="showMore">
        <el-input
          v-model="queryParams.notes"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="组织单位" prop="ou" v-show="showMore">
        <el-input
          v-model="queryParams.ou"
          placeholder="请输入组织单位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags" v-show="showMore">
        <el-input
          v-model="queryParams.tags"
          placeholder="请输入标签"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="exporter-ip" prop="exporterIp" v-show="showMore">
        <el-input
          v-model="queryParams.exporterIp"
          placeholder="请输入监控exporterIP"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="exporter端口" prop="exporterPort" v-show="showMore">
        <el-input
          v-model="queryParams.exporterPort"
          placeholder="请输入监控exporter端口"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="监控" prop="monitored" v-show="showMore">
        <el-select v-model="queryParams.monitored" placeholder="请选择" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_Y_N_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" v-show="showMore">
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

      <!-- 展开/收起按钮 -->
      <el-form-item>
        <el-button @click="toggleMore">
          <Icon :icon="showMore ? 'ep:arrow-up' : 'ep:arrow-down'" class="mr-5px" />
          {{ showMore ? '收起' : '展开更多' }}
        </el-button>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['cmdb:host:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['cmdb:host:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="warning" plain @click="handleImport" v-hasPermi="['cmdb:host:import']">
          <Icon icon="ep:upload" /> 导入
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

<!--  &lt;!&ndash; 导入对话框 &ndash;&gt;-->
<!--  <el-dialog-->
<!--    title="导入CMDB主机"-->
<!--    v-model="importDialogVisible"-->
<!--    width="30%"-->
<!--    append-to-body-->
<!--    :close-on-click-modal="false"-->
<!--  >-->
<!--    <el-upload-->
<!--      ref="uploadRef"-->
<!--      :auto-upload="false"-->
<!--      :limit="1"-->
<!--      accept=".xls,.xlsx"-->
<!--      :on-change="handleFileChange"-->
<!--    >-->
<!--      <el-button type="primary">选择Excel文件</el-button>-->
<!--      <template v-slot:tip>-->
<!--        <div class="el-upload__tip">仅支持上传 .xls 或 .xlsx 格式文件</div>-->
<!--      </template>-->
<!--    </el-upload>-->
<!--    <template #footer>-->
<!--      <el-button @click="importDialogVisible = false">取消</el-button>-->
<!--      <el-button type="primary" :loading="importLoading" @click="handleImport">导入</el-button>-->
<!--    </template>-->
<!--  </el-dialog>-->

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主机ID" align="center" prop="id" />-->
      <el-table-column label="云区域" align="center" prop="cloudArea" width="85px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_CLOUD_AREA" :value="scope.row.cloudArea" />
        </template>
      </el-table-column>
      <el-table-column label="环境" align="center" prop="env" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_ENV" :value="scope.row.env" />
        </template>
      </el-table-column>
      <el-table-column label="实例ID" align="center" prop="instanceId" width="300px" />
      <el-table-column label="实例名称" align="center" prop="instanceName" width="300px" />
      <el-table-column label="数据中心" align="center" prop="center" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_CENTER" :value="scope.row.center" />
        </template>
      </el-table-column>
      <el-table-column label="团队" align="center" prop="team" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_CENTER" :value="scope.row.team" />
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" prop="user" width="120px" />
      <el-table-column label="区域" align="center" prop="area" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_AREA" :value="scope.row.area" />
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="promoter" width="150px" />
      <el-table-column label="内网IP" align="center" prop="ipLan" width="125px" />
      <el-table-column label="外网IP" align="center" prop="ipWan" width="125px" />
      <el-table-column label="K8S节点" align="center" prop="k8sNode" width="80px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_Y_N_TYPE" :value="scope.row.k8sNode" />
        </template>
      </el-table-column>
      <el-table-column label="离线" align="center" prop="offline" width="60px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_Y_N_TYPE" :value="scope.row.offline" />
        </template>
      </el-table-column>
      <el-table-column label="CPU" align="center" prop="cpu" width="60px" />
      <el-table-column label="内存" align="center" prop="mem" width="60px" />
      <el-table-column label="exporterIP" align="center" prop="exporterIp" width="160px" />
      <el-table-column label="exporter端口" align="center" prop="exporterPort" width="120px" />
      <el-table-column label="监控" align="center" prop="monitored">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CMDB_Y_N_TYPE" :value="scope.row.monitored" />
        </template>
      </el-table-column>
      <el-table-column label="组织单位" align="center" prop="ou" width="80px" />
      <el-table-column label="标签" align="center" prop="tags" width="300px" />
      <el-table-column label="备注" align="center" prop="notes" width="200px" />
      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        align="center"-->
      <!--        prop="createTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <!-- 固定操作列 -->
      <el-table-column label="操作" align="center" min-width="120px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['cmdb:host:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['cmdb:host:delete']"
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
  <HostForm ref="formRef" @success="getList" />

  <HostImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { HostApi, HostVO } from '@/api/cmdb/host'
import HostForm from './HostForm.vue'
import HostImportForm from './HostImportForm.vue'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'

/** CMDB主机 列表 */
defineOptions({ name: 'Host' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<HostVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const showMore = ref(false) // 控制更多搜索条件的显示/隐藏
const importDialogVisible = ref(false) // 控制导入对话框显示
const importLoading = ref(false) // 导入加载中
const selectedFile = ref<File | null>(null) // 选中的文件
const uploadRef = ref() // 上传组件引用
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cloudArea: undefined,
  env: undefined,
  center: undefined,
  team: undefined,
  user: undefined,
  area: undefined,
  promoter: undefined,
  ipLan: undefined,
  ipWan: undefined,
  instanceId: undefined,
  instanceName: undefined,
  k8sNode: undefined,
  offline: undefined,
  cpu: undefined,
  mem: undefined,
  notes: undefined,
  ou: undefined,
  tags: undefined,
  exporterIp: undefined,
  exporterPort: undefined,
  monitored: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 切换更多搜索条件的显示/隐藏 */
const toggleMore = () => {
  showMore.value = !showMore.value
}

/** 主机导入 */
const importFormRef = ref()
const handleImport = () => {
  importFormRef.value.open()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await HostApi.getHostPage(queryParams)
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
    await HostApi.deleteHost(id)
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
    const data = await HostApi.exportHost(queryParams)
    download.excel(data, 'CMDB主机.xls')
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
