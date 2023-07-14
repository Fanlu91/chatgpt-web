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
    label: 'chat',
    key: 'c',
    icon: renderIcon('ri:message-3-line'),
  },
  {
    label: 'info',
    key: 'u',
    icon: renderIcon('ri:file-user-line'),
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
        <NLayoutSider width="70px">
          <NMenu :options="menuOptions" @update:value="handleMenuChange" />
        </NLayoutSider>
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NaiveProvider>
  </NConfigProvider>
</template>
