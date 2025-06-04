<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
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
      <el-form-item label="命名空间" prop="namespace">
        <el-input v-model="formData.namespace" placeholder="请输入命名空间" />
      </el-form-item>
      <el-form-item label="控制器" prop="deployment">
        <el-input v-model="formData.deployment" placeholder="请输入控制器" />
      </el-form-item>
      <el-form-item label="副本数" prop="replicas">
        <el-input v-model="formData.replicas" placeholder="请输入副本数" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { NamespaceApi, NamespaceVO } from '@/api/cmdb/namespace'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";

/** CMDB-namespace 表单 */
defineOptions({ name: 'NamespaceForm' })

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
  namespace: undefined,
  deployment: undefined,
  replicas: undefined,
})
const formRules = reactive({
  cloudArea: [{ required: true, message: '云区域不能为空', trigger: 'blur' }],
  env: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
  center: [{ required: true, message: '数据中心不能为空', trigger: 'blur' }],
  team: [{ required: true, message: '团队不能为空', trigger: 'blur' }],
  namespace: [{ required: true, message: 'namespace不能为空', trigger: 'blur' }],
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
      formData.value = await NamespaceApi.getNamespace(id)
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
    const data = formData.value as unknown as NamespaceVO
    if (formType.value === 'create') {
      await NamespaceApi.createNamespace(data)
      message.success(t('common.createSuccess'))
    } else {
      await NamespaceApi.updateNamespace(data)
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
    namespace: undefined,
    deployment: undefined,
    replicas: undefined,
  }
  formRef.value?.resetFields()
}
</script>
