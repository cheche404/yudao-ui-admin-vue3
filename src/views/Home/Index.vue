<template>
  <div>
    <el-card shadow="never">
      <el-skeleton :loading="loading" animated>
        <el-row :gutter="16" justify="space-between">
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex items-center">
              <el-avatar :src="avatar" :size="70" class="mr-16px">
                <img src="@/assets/imgs/avatar.png" alt="" />
              </el-avatar>
              <div>
                <div class="text-20px">
                  {{ t('workplace.welcome') }} {{ username }} {{ t('workplace.happyDay') }}
                </div>
                <div class="mt-10px text-14px text-gray-500">
                  欢迎进入运维管理平台！
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-skeleton>
    </el-card>
  </div>

  <el-row class="mt-4px" :gutter="24" justify="space-between">
    <el-col :xl="12" :lg="12" :md="20" :sm="20" :xs="20" class="mb-8px">
      <el-card shadow="never">
        <template #header>
          <div class="h-6 flex justify-between items-center text-lg font-medium">
            <span>{{ t('workplace.resource') }}</span>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <el-row :gutter="24">
            <el-col
              v-for="(item, index) in resourceNumList"
              :key="`project-${index}`"
              :xl="8"
              :lg="12"
              :md="12"
              :sm="12"
              :xs="12"
            >
<!--              @click="router.push({ name: item.menuName, query: { type: item.resourceType }})"-->
              <el-card shadow="hover" class="mb-2px">
                <div class="flex justify-between items-center mb-8px">
                  <div class="flex items-center space-x-2">
                    <Icon :icon="item.icon" :size="30" class="text-primary" />
                    <span class="text-lg font-semibold">{{ item.resourceType }}</span>
                  </div>
                  <span
                    class="text-xl font-bold text-green-500 cursor-pointer hover:underline"
                    style="line-height: 15px;"
                  >
                    {{ item.count }}
                  </span>
                </div>
                <el-row :gutter="8">
                  <el-col
                    v-for="(cloud, cloudIndex) in item.resourceNumVOs"
                    :key="`cloud-${cloudIndex}`"
                    :xl="8"
                    :lg="8"
                    :md="8"
                    :sm="8"
                    :xs="8"
                  >
                    <el-card shadow="hover" class="mb-2px">
                      <div class="flex flex-col items-center">
                        <Icon :icon="cloud.icon" :size="12" class="mb-1 text-blue-500" />
                        <span class="text-sm font-medium">{{ cloud.cloudArea }}</span>
                      </div>
                      <div class="mt-2 text-base font-bold text-green-500 text-center">
                        {{ cloud.num }}
                      </div>
                    </el-card>
                  </el-col>
                </el-row>

              </el-card>
            </el-col>
          </el-row>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { CMDBResourceNumVO, StatisticsApi } from '@/api/cmdb/statistics'
import { useUserStore } from '@/store/modules/user'
// import {useRouter} from "vue-router";

defineOptions({ name: 'Home' })

const { t } = useI18n()
const userStore = useUserStore()
// const router = useRouter() // 路由
const loading = ref(true)
const resourceNumList = ref<CMDBResourceNumVO[]>([]) // 列表的数据
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname

const getResourceNum = async () => {
  loading.value = true
  try {
    resourceNumList.value = await StatisticsApi.getResourceNum()
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getResourceNum()
})
</script>
