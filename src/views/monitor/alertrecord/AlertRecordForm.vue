<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="告警名称" prop="alertName">
        <el-input v-model="formData.alertName" placeholder="请输入告警名称" />
      </el-form-item>
      <el-form-item label="告警开始时间" prop="alertStartTime">
        <el-date-picker
          v-model="formData.alertStartTime"
          type="date"
          value-format="x"
          placeholder="选择告警开始时间"
        />
      </el-form-item>
      <el-form-item label="告警结束时间" prop="alertEndTime">
        <el-date-picker
          v-model="formData.alertEndTime"
          type="date"
          value-format="x"
          placeholder="选择告警结束时间"
        />
      </el-form-item>
      <el-form-item label="告警来源" prop="alertSource">
        <el-input v-model="formData.alertSource" placeholder="请输入告警来源" />
      </el-form-item>
      <el-form-item label="环境信息" prop="env">
        <el-input v-model="formData.env" placeholder="请输入环境信息" />
      </el-form-item>
      <el-form-item label="告警类型" prop="monitorType">
        <el-select v-model="formData.monitorType" placeholder="请选择告警类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="命名空间" prop="namespace">
        <el-input v-model="formData.namespace" placeholder="请输入命名空间" />
      </el-form-item>
      <el-form-item label="pod" prop="pod">
        <el-input v-model="formData.pod" placeholder="请输入pod" />
      </el-form-item>
      <el-form-item label="instance" prop="instance">
        <el-input v-model="formData.instance" placeholder="请输入instance" />
      </el-form-item>
      <el-form-item label="vhost" prop="vhost">
        <el-input v-model="formData.vhost" placeholder="请输入vhost" />
      </el-form-item>
      <el-form-item label="queue" prop="queue">
        <el-input v-model="formData.queue" placeholder="请输入queue" />
      </el-form-item>
      <el-form-item label="node" prop="node">
        <el-input v-model="formData.node" placeholder="请输入node" />
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-input v-model="formData.url" placeholder="请输入url" />
      </el-form-item>
      <el-form-item label="abi_origin_prometheus" prop="abiOriginPrometheus">
        <el-input v-model="formData.abiOriginPrometheus" placeholder="请输入abi_origin_prometheus" />
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input v-model="formData.name" placeholder="请输入name" />
      </el-form-item>
      <el-form-item label="团队" prop="team">
        <el-input v-model="formData.team" placeholder="请输入团队" />
      </el-form-item>
      <el-form-item label="summary" prop="summary">
        <el-input v-model="formData.summary" placeholder="请输入summary" />
      </el-form-item>
      <el-form-item label="description" prop="description">
        <Editor v-model="formData.description" height="150px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AlertRecordApi, AlertRecordVO } from '@/api/monitor/alertrecord'

/** 告警记录 表单 */
defineOptions({ name: 'AlertRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  alertName: undefined,
  alertStartTime: undefined,
  alertEndTime: undefined,
  alertSource: undefined,
  env: undefined,
  monitorType: undefined,
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
})
const formRules = reactive({
  alertName: [{ required: true, message: '告警名称不能为空', trigger: 'blur' }],
  alertStartTime: [{ required: true, message: '告警开始时间不能为空', trigger: 'blur' }],
  monitorType: [{ required: true, message: '告警类型不能为空', trigger: 'change' }],
  status: [{ required: true, message: '告警状态不能为空', trigger: 'blur' }],
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
      formData.value = await AlertRecordApi.getAlertRecord(id)
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
    const data = formData.value as unknown as AlertRecordVO
    if (formType.value === 'create') {
      await AlertRecordApi.createAlertRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await AlertRecordApi.updateAlertRecord(data)
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
    alertName: undefined,
    alertStartTime: undefined,
    alertEndTime: undefined,
    alertSource: undefined,
    env: undefined,
    monitorType: undefined,
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
  }
  formRef.value?.resetFields()
}
</script>