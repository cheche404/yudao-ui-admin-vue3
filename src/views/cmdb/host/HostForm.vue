<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="主机名称" prop="hostname">
        <el-input v-model="formData.hostname" placeholder="请输入主机名称" />
      </el-form-item>
      <el-form-item label="IP地址" prop="ipAddress">
        <el-input v-model="formData.ipAddress" placeholder="请输入IP地址" />
      </el-form-item>
      <el-form-item label="操作系统" prop="osType">
        <el-select v-model="formData.osType" clearable placeholder="请选择操作系统">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.HOST_OS_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CPU核数" prop="cpuCores">
        <el-input-number v-model="formData.cpuCores" :min="1" :max="128" placeholder="请输入CPU核数" />
      </el-form-item>
      <el-form-item label="内存(GB)" prop="memorySize">
        <el-input-number v-model="formData.memorySize" :min="1" :max="1024" placeholder="请输入内存大小" />
      </el-form-item>
      <el-form-item label="磁盘容量(GB)" prop="diskSize">
        <el-input-number v-model="formData.diskSize" :min="1" :max="10000" placeholder="请输入磁盘容量" />
      </el-form-item>
      <el-form-item label="SSH端口" prop="sshPort">
        <el-input-number v-model="formData.sshPort" :min="1" :max="65535" placeholder="请输入SSH端口" />
      </el-form-item>
      <el-form-item label="SSH用户名" prop="sshUsername">
        <el-input v-model="formData.sshUsername" placeholder="请输入SSH用户名" />
      </el-form-item>
      <el-form-item label="SSH密码" prop="sshPassword">
        <el-input v-model="formData.sshPassword" placeholder="请输入SSH密码" type="password" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" clearable placeholder="请选择状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as HostApi from '@/api/cmdb/host'

defineOptions({ name: 'SystemHostForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  hostname: '',
  ipAddress: '',
  osType: undefined,
  cpuCores: 1,
  memorySize: 1,
  diskSize: 50,
  sshPort: 22,
  sshUsername: 'root',
  sshPassword: '',
  status: CommonStatusEnum.ENABLE,
  remark: ''
})
const formRules = reactive({
  hostname: [{ required: true, message: '主机名称不能为空', trigger: 'blur' }],
  ipAddress: [{ required: true, message: 'IP地址不能为空', trigger: 'blur' }],
  osType: [{ required: true, message: '操作系统不能为空', trigger: 'change' }],
  cpuCores: [{ required: true, message: 'CPU核数不能为空', trigger: 'blur' }],
  memorySize: [{ required: true, message: '内存大小不能为空', trigger: 'blur' }],
  diskSize: [{ required: true, message: '磁盘容量不能为空', trigger: 'blur' }],
  sshPort: [{ required: true, message: 'SSH端口不能为空', trigger: 'blur' }],
  sshUsername: [{ required: true, message: 'SSH用户名不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
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
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as HostApi.HostVO
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
    hostname: '',
    ipAddress: '',
    osType: undefined,
    cpuCores: 1,
    memorySize: 1,
    diskSize: 50,
    sshPort: 22,
    sshUsername: 'root',
    sshPassword: '',
    status: CommonStatusEnum.ENABLE,
    remark: ''
  } as any
  formRef.value?.resetFields()
}
</script>
