<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
<!--      <el-form-item label="id" prop="name">-->
<!--        <el-input v-model="formData.id" placeholder="id" />-->
<!--      </el-form-item>-->
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入属性名称" />
      </el-form-item>
      <el-form-item label="属性编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入属性编码" />
      </el-form-item>
      <el-form-item label="排序号" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入排序号" />
      </el-form-item>
      <el-form-item label="属性类型" prop="attrType">
        <el-select v-model="formData.attrType" placeholder="请选择属性类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.CMDB_MODEL_ATTR_DATA_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="属性校验规则" prop="validationRule">
        <el-input v-model="formData.validationRule" placeholder="请输入属性校验规则（如正则表达式或长度限制）" />
      </el-form-item>
      <el-form-item label="是否必填" prop="isRequired">
        <el-radio-group v-model="formData.isRequired">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.CMDB_YES_NO_TYPE)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否能编辑" prop="isEditable">
        <el-radio-group v-model="formData.isEditable">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.CMDB_YES_NO_TYPE)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单行展示" prop="isSingleLine">
        <el-radio-group v-model="formData.isSingleLine">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.CMDB_YES_NO_TYPE)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="属性描述" prop="description">
            <el-input v-model="formData.description" placeholder="请输入内容" type="textarea" />
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
import { AttributeApi, AttributeVO } from '@/api/cmdb/attribute'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** CMDB对象属性 表单 */
defineOptions({ name: 'AttributeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  code: '',
  modelId: undefined,
  sort: undefined,
  attrType: undefined,
  validationRule: undefined,
  isRequired: 0,
  isEditable: 0,
  isSingleLine: 0,
  description: '',
})
const formRules = reactive({
  name: [{ required: true, message: '属性名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '属性编码不能为空', trigger: 'blur' }],
  modelId: [{ required: true, message: '所属对象id不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序号不能为空', trigger: 'blur' }],
  attrType: [{ required: true, message: '属性类型不能为空', trigger: 'change' }],
  isRequired: [{ required: true, message: '是否必填', trigger: 'blur' }],
  isEditable: [{ required: true, message: '是否能编辑', trigger: 'blur' }],
  isSingleLine: [{ required: false, message: '是否单行展示不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, modelId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AttributeApi.getAttribute(id)
    } finally {
      formLoading.value = false
    }
  } else {
    formData.value.modelId = modelId // 设置所属对象id
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
    const data = formData.value as unknown as AttributeVO
    if (formType.value === 'create') {
      await AttributeApi.createAttribute(data)
      message.success(t('common.createSuccess'))
    } else {
      await AttributeApi.updateAttribute(data)
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
    name: undefined,
    code: undefined,
    modelId: undefined,
    sort: undefined,
    attrType: undefined,
    validationRule: undefined,
    isRequired: 0,
    isEditable: 0,
    isSingleLine: 0,
    description: undefined,
  }
  formRef.value?.resetFields()
}
</script>
