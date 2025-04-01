<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="实例名称" prop="instanceName">
        <el-input v-model="formData.instanceName" placeholder="请输入实例名称" />
      </el-form-item>
      <el-form-item label="关联主机编号，引用 system_host 的 id" prop="hostId">
        <el-input v-model="formData.hostId" placeholder="请输入关联主机编号，引用 system_host 的 id" />
      </el-form-item>
      <el-form-item label="IP 地址" prop="ipAddress">
        <el-input v-model="formData.ipAddress" placeholder="请输入IP 地址" />
      </el-form-item>
      <el-form-item label="数据库端口" prop="port">
        <el-input v-model="formData.port" placeholder="请输入数据库端口" />
      </el-form-item>
      <el-form-item label="MySQL 版本" prop="version">
        <el-input v-model="formData.version" placeholder="请输入MySQL 版本" />
      </el-form-item>
      <el-form-item label="数据库用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入数据库用户名" />
      </el-form-item>
      <el-form-item label="数据库密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入数据库密码" />
      </el-form-item>
      <el-form-item label="默认数据库名" prop="databaseName">
        <el-input v-model="formData.databaseName" placeholder="请输入默认数据库名" />
      </el-form-item>
      <el-form-item label="状态，枚举 CommonStatusEnum" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MysqlApi, MysqlVO } from '@/api/cmdb/mysql'

/** MySQL 实例 表单 */
defineOptions({ name: 'MysqlForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  instanceName: undefined,
  hostId: undefined,
  ipAddress: undefined,
  port: undefined,
  version: undefined,
  username: undefined,
  password: undefined,
  databaseName: undefined,
  status: undefined,
  remark: undefined,
})
const formRules = reactive({
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
      formData.value = await MysqlApi.getMysql(id)
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
    const data = formData.value as unknown as MysqlVO
    if (formType.value === 'create') {
      await MysqlApi.createMysql(data)
      message.success(t('common.createSuccess'))
    } else {
      await MysqlApi.updateMysql(data)
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
    instanceName: undefined,
    hostId: undefined,
    ipAddress: undefined,
    port: undefined,
    version: undefined,
    username: undefined,
    password: undefined,
    databaseName: undefined,
    status: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>