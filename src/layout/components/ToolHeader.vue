<script lang="tsx">
import { defineComponent, computed } from 'vue'
import JumpServerLogoIcon from '@/assets/imgs/jumpserver-logo.png' // 导入图片
import ArcheryLogoIcon from '@/assets/imgs/archery-logo.png' // 导入图片
import RancherLogoIcon from '@/assets/imgs/rancher-logo.png' // 导入图片
import PinpointLogoIcon from '@/assets/imgs/pinpoint-logo.png' // 导入图片
import { Collapse } from '@/layout/components/Collapse'
import { UserInfo } from '@/layout/components/UserInfo'
import { Screenfull } from '@/layout/components/Screenfull'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { SizeDropdown } from '@/layout/components/SizeDropdown'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import RouterSearch from '@/components/RouterSearch/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { hasPermission } from '@/directives/permission/hasPermi'
import { useUserStore } from '@/store/modules/user'

const { getPrefixCls, variables } = useDesign()
const prefixCls = getPrefixCls('tool-header')
const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)
// 折叠图标
const hamburger = computed(() => appStore.getHamburger)
// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)
// 搜索图片
const search = computed(() => appStore.search)
// 尺寸图标
const size = computed(() => appStore.getSize)
// 布局
const layout = computed(() => appStore.getLayout)
// 多语言图标
const locale = computed(() => appStore.getLocale)

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    const userStore = useUserStore()

    // 检查权限的通用函数
    const checkPermission = (permissions: string[]) => {
      try {
        if (!userStore.permissions) {
          console.log('userStore.permissions is empty:', userStore.permissions)
          return false
        }
        console.log('Checking permissions:', permissions, 'userStore:', JSON.stringify(userStore))
        return hasPermission(permissions)
      } catch (error) {
        console.error('Permission check failed:', error)
        return false
      }
    }

    // 检查 permissions 是否加载
    const permissionsLoaded = computed(() => {
      const permissions = userStore.permissions
      console.log('userStore.permissions:', permissions)
      return permissions && (Array.isArray(permissions) ? permissions.length > 0 : permissions.size > 0)
    })

    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? (
              <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="lt-md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}

        <div class="h-full flex items-center">
          {permissionsLoaded.value && checkPermission(['component:jumpserver']) ? (
            <span class="flex items-center mr-4">
              <img
                src={JumpServerLogoIcon}
                alt="JumpServer Logo"
                class="w-4 h-4 mr-1"
              />
              <el-button
                link
                type="primary"
                class="font-bold"
                onClick={() => redirectToJumpserver()}
              >
                堡垒机
              </el-button>
            </span>
          ) : null}

          {permissionsLoaded.value && checkPermission(['component:archery']) ? (
            <span class="flex items-center mr-4">
              <img
                src={ArcheryLogoIcon}
                alt="Archery Logo"
                class="w-4 h-4 mr-1"
              />
              <el-button
                link
                type="primary"
                class="font-bold"
                onClick={() => redirectToArchery()}
              >
                DB审核工具
              </el-button>
            </span>
          ) : null}

          {permissionsLoaded.value && checkPermission(['component:rancher']) ? (
            <span class="flex items-center mr-4">
              <img
                src={RancherLogoIcon}
                alt="Rancher Logo"
                class="w-4 h-4 mr-1"
              />
              <el-button
                link
                type="primary"
                class="font-bold"
                onClick={() => redirectToRancher()}
              >
                容器管理工具
              </el-button>
            </span>
          ) : null}

          {permissionsLoaded.value && checkPermission(['component:pinpoint']) ? (
            <span class="flex items-center mr-4">
              <img
                src={PinpointLogoIcon}
                alt="Pinpoint Logo"
                class="w-4 h-4 mr-1"
              />
              <el-button
                link
                type="primary"
                class="font-bold"
                onClick={() => redirectToPinpoint()}
              >
                Pinpoint
              </el-button>
            </span>
          ) : null}

          {screenfull.value ? (
            <Screenfull class="custom-hover" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          {search.value ? <RouterSearch isModal={false} /> : undefined}
          {size.value ? (
            <SizeDropdown class="custom-hover" color="var(--top-header-text-color)"></SizeDropdown>
          ) : undefined}
          {locale.value ? (
            <LocaleDropdown
              class="custom-hover"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})

const redirectToJumpserver = () => {
  window.open(import.meta.env.VITE_JUMPSERVER_URL + '/core/auth/openid/callback/', '_blank')
}

const redirectToArchery = () => {
  window.open(import.meta.env.VITE_ARCHERY_URL + '/oidc/callback', '_blank')
}

const redirectToRancher = () => {
  window.open(import.meta.env.VITE_RANCHER_URL + '', '_blank')
}

const redirectToPinpoint = () => {
  // Redirect to the URL when the button is clicked
  window.open('https://tracing-hw.digiwincloud.com.cn/main', "_blank");
};
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);

  // 确保按钮间距和字体样式
  .font-bold {
    font-weight: bold;
  }

  // 可选：微调按钮和图标的间距
  .flex.items-center {
    &:not(:last-child) {
      margin-right: 1rem; // 等同于 mr-4 (Tailwind)
    }
  }
}
</style>
