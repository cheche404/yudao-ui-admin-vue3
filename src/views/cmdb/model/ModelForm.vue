<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="上级对象" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="modelTree"
          :props="defaultProps"
          check-strictly
          default-expand-all
          placeholder="请选择上级对象"
          value-key="id"
        />
      </el-form-item>
      <el-form-item label="对象名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入对象名称" />
      </el-form-item>
      <el-form-item label="对象编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入对象编码" />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="对象描述" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入对象描述" />
      </el-form-item>
      <el-form-item v-if="formData.type !== 3" label="菜单图标">
        <IconSelect v-model="formData.icon" clearable />
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
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import * as ModelApi from '@/api/cmdb/model'
import { CommonStatusEnum } from '@/utils/constants'
import { FormRules } from 'element-plus'

defineOptions({ name: 'CmdbModelForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗是否展示
const dialogTitle = ref('') // 弹窗标题
const formLoading = ref(false) // 表单加载中
const formType = ref('') // 表单类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parentId: 0, // 默认顶级对象
  name: undefined,
  code: undefined,
  sort: 0,
  description: undefined,
  icon: undefined,
  status: CommonStatusEnum.ENABLE
})
const formRules = reactive<FormRules>({
  parentId: [{ required: true, message: '上级对象不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '对象名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '对象编码不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const modelTree = ref<Tree[]>([]) // 对象树形结构

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
      formData.value = await ModelApi.getModel(id)
    } finally {
      formLoading.value = false
    }
  }
  // 获得对象树
  await getTree()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    const data = formData.value as unknown as ModelApi.ModelVO
    if (formType.value === 'create') {
      await ModelApi.createModel(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelApi.updateModel(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    parentId: 0,
    name: undefined,
    code: undefined,
    sort: 0,
    description: undefined,
    icon: undefined,
    status: CommonStatusEnum.ENABLE
  }
  formRef.value?.resetFields()
}

/** 获得对象树 */
const getTree = async () => {
  modelTree.value = []
  const data = await ModelApi.getSimpleModelList()
  let root: Tree = { id: 0, name: '顶级对象', children: [] }
  root.children = handleTree(data)
  modelTree.value.push(root)
}

/** Tree 类型定义 */
interface Tree {
  id: number
  name: string
  children?: Tree[]
}
</script>
