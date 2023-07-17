<script setup lang="ts">
import { NConfigProvider, NDropdown, NLayout, NLayoutContent, NLayoutSider, NMenu } from 'naive-ui'
import { useRouter } from 'vue-router'
import { h } from 'vue'
import { NaiveProvider, SvgIcon, UserAvatar } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuthStore } from '@/store'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
const authStore = useAuthStore()

const router = useRouter()
const renderIcon = (icon: string) => {
  return () => h(SvgIcon, { icon })
}
const menuOptions = [
  {
    label: '智能对话',
    key: 'c',
    icon: renderIcon('ri:message-3-line'),
  },

  // ...
]

const dropDownOptions = [
  {
    label: '用户信息',
    key: 'u',
    icon: renderIcon('ri:file-user-line'),
  },
  {
    label: '系统设置',
    key: 's',
    icon: renderIcon('ri:settings-4-line'),
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('ri:logout-box-r-line'),
  },
]

const handleMenuChange = (key: string) => {
  router.push(`/${key}`)
}

async function handleLogout() {
  await authStore.removeToken()
}

async function handleSelect(key: string | number) {
  if (key === 'logout') {
    await handleLogout()
    router.push('/home')
  }
  else {
    router.push(`/${key}`)
  }
}
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <NLayout has-sider style="height: 100%">
        <NLayoutSider bordered collapsed collapse-mode="width" :collapsed-width="52" content-style="padding: 2px;">
          <div style="display: flex; flex-direction: column; height: 100%;">
            <NMenu collapsed :collapsed-width="48" :options="menuOptions" @update:value="handleMenuChange" />
            <div style="margin-top: auto; padding-left: 5px; padding-bottom: 10px;">
              <!-- Footer Content Goes Here -->
              <NDropdown :options="dropDownOptions" @select="handleSelect">
                <div class="flex-1 flex-shrink-0 overflow-hidden">
                  <UserAvatar />
                </div>
              </NDropdown>
            </div>
          </div>
        </NLayoutSider>
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NaiveProvider>
  </NConfigProvider>
</template>
