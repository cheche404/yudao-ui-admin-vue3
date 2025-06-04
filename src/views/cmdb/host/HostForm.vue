<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      class="wide-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="云区域" prop="cloudArea">
            <el-select
              v-model="formData.cloudArea"
              placeholder="请选择云区域"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_CLOUD_AREA)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环境" prop="env">
            <el-select
              v-model="formData.env"
              placeholder="请选择环境"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_ENV)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据中心" prop="center">
            <el-select
              v-model="formData.center"
              placeholder="请选择数据中心"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_CENTER)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="团队" prop="team">
            <el-select
              v-model="formData.team"
              placeholder="请选择团队"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_TEAM)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户" prop="user">
            <el-input v-model="formData.user" placeholder="请输入用户" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域" prop="area">
            <el-select
              v-model="formData.area"
              placeholder="请选择区域"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_AREA)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="负责人" prop="promoter">
            <el-input v-model="formData.promoter" placeholder="请输入负责人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内网IP" prop="ipLan">
            <el-input v-model="formData.ipLan" placeholder="请输入内网IP" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="外网IP" prop="ipWan">
            <el-input v-model="formData.ipWan" placeholder="请输入外网IP" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实例ID" prop="instanceId">
            <el-input v-model="formData.instanceId" placeholder="请输入实例ID" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实例名称" prop="instanceName">
            <el-input v-model="formData.instanceName" placeholder="请输入实例名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="K8S节点" prop="k8sNode">
            <el-select
              v-model="formData.k8sNode"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_Y_N_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="离线" prop="offline">
            <el-select
              v-model="formData.offline"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_Y_N_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CPU核心数" prop="cpu">
            <el-input v-model="formData.cpu" placeholder="请输入CPU核心数(单位: C)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="组织单位" prop="ou">
            <el-input v-model="formData.ou" placeholder="请输入组织单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签" prop="tags">
            <el-input v-model="formData.tags" placeholder="请输入标签" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="内存" prop="mem">
            <el-input v-model="formData.mem" placeholder="请输入内存大小（单位：GB）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否监控" prop="monitored">
            <el-select
              v-model="formData.monitored"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_Y_N_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="exporter-ip" prop="exporterIp">
            <el-input v-model="formData.exporterIp" placeholder="请输入监控exporterIP" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="exporter端口" prop="exporterPort">
            <el-input v-model="formData.exporterPort" placeholder="请输入监控exporter端口" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="formData.notes"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { HostApi, HostVO } from '@/api/cmdb/host'
import { DICT_TYPE, getStrDictOptions } from "@/utils/dict"

/** CMDB主机 表单 */
defineOptions({ name: 'HostForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
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
  k8sNode: 'N',
  offline: 'N',
  cpu: undefined,
  mem: undefined,
  notes: undefined,
  ou: undefined,
  tags: undefined,
  exporterIp: undefined,
  exporterPort: undefined,
  monitored: 'N',
})
const formRules = reactive({
  cloudArea: [{ required: true, message: '云区域不能为空', trigger: 'blur' }],
  env: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
  center: [{ required: true, message: '数据中心不能为空', trigger: 'blur' }],
  team: [{ required: true, message: '团队不能为空', trigger: 'blur' }],
  instanceName: [{ required: true, message: '实例名称不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await HostApi.getHost(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as HostVO
    if (formType.value === 'create') {
      await HostApi.createHost(data)
      message.success(t('common.createSuccess'))
    } else {
      await HostApi.updateHost(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
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
    k8sNode: 'N',
    offline: 'N',
    cpu: undefined,
    mem: undefined,
    notes: undefined,
    ou: undefined,
    tags: undefined,
    exporterIp: undefined,
    exporterPort: undefined,
    monitored: 'N',
  }
  formRef.value?.resetFields()
}
</script>
