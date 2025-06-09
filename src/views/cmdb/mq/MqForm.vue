<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
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
          <el-form-item label="部门" prop="center">
            <el-select
              v-model="formData.center"
              placeholder="请选择部门"
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
          <el-form-item label="使用方" prop="user">
            <el-input v-model="formData.user" placeholder="请输入使用方" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="promoter">
            <el-input v-model="formData.promoter" placeholder="请输入负责人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="域名" prop="host">
            <el-input v-model="formData.host" placeholder="请输入域名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="docker" prop="docker">
            <el-select
              v-model="formData.docker"
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
          <el-form-item label="主机信息" prop="nodesInfo">
            <el-input v-model="formData.nodesInfo" placeholder="请输入主机信息" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="集群名称" prop="clusterName">
            <el-input v-model="formData.clusterName" placeholder="请输入集群名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="自建" prop="location">
            <el-select
              v-model="formData.location"
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
          <el-form-item label="监控" prop="monitored">
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
            <el-input v-model="formData.exporterIp" placeholder="请输入exporter-ip" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="exporter端口" prop="exporterPort">
            <el-input v-model="formData.exporterPort" placeholder="请输入exporter端口" />
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
          <el-form-item label="备注" prop="notesInfo">
            <el-input
              v-model="formData.notesInfo"
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
import { MqApi, MqVO } from '@/api/cmdb/mq'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";

/** CMDB-MQ 表单 */
defineOptions({ name: 'MqForm' })

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
  promoter: undefined,
  host: undefined,
  docker: undefined,
  nodesInfo: undefined,
  clusterName: undefined,
  offline: 'N',
  location: 'N',
  notesInfo: undefined,
  exporterIp: undefined,
  exporterPort: undefined,
  monitored: 'N',
})
const formRules = reactive({
  cloudArea: [{ required: true, message: '云区域不能为空', trigger: 'blur' }],
  env: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
  center: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  team: [{ required: true, message: '团队不能为空', trigger: 'blur' }],
  clusterName: [{ required: true, message: '集群名称不能为空', trigger: 'blur' }],
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
      formData.value = await MqApi.getMq(id)
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
    const data = formData.value as unknown as MqVO
    if (formType.value === 'create') {
      await MqApi.createMq(data)
      message.success(t('common.createSuccess'))
    } else {
      await MqApi.updateMq(data)
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
    promoter: undefined,
    host: undefined,
    docker: undefined,
    nodesInfo: undefined,
    clusterName: undefined,
    offline: 'N',
    location: 'N',
    notesInfo: undefined,
    exporterIp: undefined,
    exporterPort: undefined,
    monitored: 'N',
  }
  formRef.value?.resetFields()
}
</script>
