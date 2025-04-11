<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
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
        <el-select
          v-model="formData.attrType"
          placeholder="请选择属性类型"
          @change="handleAttrTypeChange"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_MODEL_ATTR_DATA_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- 单选对象选择（动态显示） -->
      <el-form-item
        v-if="formData.attrType === 'select' || formData.attrType === 'radio_group' || formData.attrType === 'checkbox_group'"
        label="关联对象"
        prop="relationObjectType"
      >
        <el-select
          v-model="formData.relationObjectType"
          placeholder="请选择关联对象"
          clearable
          :disabled="formData.attrType === 'radio_group' || formData.attrType === 'checkbox_group'"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CMDB_ATTR_SELECT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.relationObjectType === 'object'"
        label="对象模型"
        prop="objectModelId"
      >
        <el-tree-select
          v-model="formData.objectModelId"
          :data="modelList"
          :props="defaultProps"
          check-strictly
          node-key="id"
          placeholder="请选择对象模型"
          @change="handleObjectModelChange"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.relationObjectType === 'dict'"
        label="字典"
        prop="relationDictId"
      >
        <el-select
          v-model="formData.relationDictId"
          placeholder="请选择字典类型"
          clearable
        >
          <el-option
            v-for="item in dictTypeList"
            :key="item.type"
            :label="item.name"
            :value="item.type"
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
            :value="dict.value"
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
            :value="dict.value"
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
            :value="dict.value"
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
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { ref, watch } from 'vue'
import { pinyin } from 'pinyin-pro'
import {defaultProps, handleTree} from "@/utils/tree";
import * as ModelApi from "@/api/cmdb/model";
import * as DictTypeApi from '@/api/system/dict/dict.type'
import {getCmdbSimpleDictTypeList} from "@/api/system/dict/dict.type";

/** CMDB对象属性 表单 */
defineOptions({ name: 'AttributeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dictTypeList = ref<DictTypeApi.DictTypeVO[]>() // 字典类型的列表
const modelList = ref<Tree[]>([]) // 树形结构
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中
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
  relationObjectType: undefined, // 关联对象
  objectModel: undefined,
  relationDictId: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '属性名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '属性编码不能为空', trigger: 'blur' }],
  modelId: [{ required: true, message: '所属对象id不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序号不能为空', trigger: 'blur' }],
  attrType: [{ required: true, message: '属性类型不能为空', trigger: 'change' }],
  relationObjectType: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (formData.value.attrType === 'select' && (value === undefined || value === null)) {
          callback(new Error('请选择关联对象'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  objectModelId: [{ required: true, message: '对象模型不能为空', trigger: 'change' }],
  relationDictId: [{ required: true, message: '字典不能为空', trigger: 'change' }],
  isRequired: [{ required: true, message: '是否必填不能为空', trigger: 'change' }],
  isEditable: [{ required: true, message: '是否能编辑不能为空', trigger: 'change' }],
  isSingleLine: [{ required: false, message: '是否单行展示不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 监听属性名称变化，自动生成拼音编码 */
watch(
  () => formData.value.name,
  (newName) => {
    if (newName) {
      // 转换为拼音，首字母大写，驼峰格式
      const pinyinStr = pinyin(newName, { toneType: 'none', v: true, firstLetterUpper: true })
      formData.value.code = pinyinStr.replace(/\s+/g, '')
    } else {
      formData.value.code = '' // 清空时重置
    }
  }
)

watch(
  () => formData.value.attrType,
    (newAttrType) => {
      if (newAttrType === 'radio_group' || newAttrType === 'checkbox_group') {
        formData.value.relationObjectType = 'dict'; // 默认设置为 'dict'
      }
    },
    { immediate: true } // 立即执行，确保初始化时设置默认值
)

/** 打开弹窗 */
const open = async (type: string, id?: number, modelId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
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
  // 加载部门树
  modelList.value = handleTree(await ModelApi.getSimpleModelList())

}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 属性类型变化处理 */
const handleAttrTypeChange = (value: string) => {
  if (value !== 'select') {
    formData.value.relationObjectType = undefined // 清空单选对象
  }
}

const handleObjectModelChange = (value: string) => {
  const findNodeById = (nodes: any[], id: string): any => {
    for (const node of nodes) {
      if (node.id === id) {
        return node
      } else if (node.children) {
        const result = findNodeById(node.children, id)
        if (result) return result
      }
    }
    return null
  }

  const selectedNode = findNodeById(modelList.value, value)
  if (selectedNode && selectedNode.children && selectedNode.children.length > 0) {
    ElMessage.warning('只能选择叶子节点')
    formData.value.objectModelId = undefined
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件
const submitForm = async () => {
  await formRef.value.validate()
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
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
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
    relationObjectType: undefined,
    objectModelId: undefined,
    relationDictId: undefined
  }
  formRef.value?.resetFields()
}

/** 初始化 **/
onMounted(async () => {
  // 查询字典（精简)列表
  dictTypeList.value = await DictTypeApi.getCmdbSimpleDictTypeList()
})

</script>
