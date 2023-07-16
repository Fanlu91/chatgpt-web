<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutContent, NLayoutSider, NMenu } from 'naive-ui'
import { useRouter } from 'vue-router'
import { h } from 'vue'
import { NaiveProvider, SvgIcon } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()

const router = useRouter()
const renderIcon = (icon: string) => {
  return () => h(SvgIcon, { icon })
}
const menuOptions = [
  {
    label: '智能对话',
    key: 'c',
    icon: renderIcon('ri:message-3-line'),
    props: {
      style: {
        padding: '2px',
        margin: '2px',
      },
    },
  },
  {
    label: '用户信息',
    key: 'u',
    icon: renderIcon('ri:file-user-line'),
    props: {
      style: {
        padding: '2px',
        margin: '2px',
      },
    },
  },
  // ...
]

const handleMenuChange = (key: string) => {
  router.push(`/${key}`)
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
        <NLayoutSider collapsed collapse-mode="width" :collapsed-width="52" content-style="padding: 2px;">
          <NMenu collapsed :collapsed-width="48" :options="menuOptions" @update:value="handleMenuChange" />
        </NLayoutSider>
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NaiveProvider>
  </NConfigProvider>
</template>
