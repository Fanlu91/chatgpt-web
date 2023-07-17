<script setup lang='ts'>
import { ref } from 'vue'
import { NTabPane, NTabs } from 'naive-ui'

import Advanced from '@/views/setting/Advanced.vue'
import Audit from '@/views/setting/Audit.vue'
import General from '@/views/setting/General.vue'
import Key from '@/views/setting/Keys.vue'
import Site from '@/views/setting/Site.vue'
import Statistics from '@/views/setting/Statistics.vue'
import User from '@/views/setting/User.vue'
import About from '@/views/setting/About.vue'

import { SvgIcon } from '@/components/common'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const active = ref('General')
</script>

<template>
  <NTabs v-model:value="active" type="line" animated style="padding-left: 5px;">
    <NTabPane name="General" tab="General">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri:file-user-line" />
        <span class="ml-2">基础设置</span>
      </template>
      <div class="min-h-[100px]">
        <General />
      </div>
    </NTabPane>
    <NTabPane v-if="userStore.userInfo.root" name="Advanced" tab="Advanced">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri:equalizer-line" />
        <span class="ml-2">{{ $t('setting.advanced') }}</span>
      </template>
      <div class="min-h-[100px]">
        <Advanced />
      </div>
    </NTabPane>
    <NTabPane v-if="userStore.userInfo.root" name="Statistics" tab="Statistics">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri:bar-chart-box-line" />
        <span class="ml-2">{{ $t('setting.statistics') }}</span>
      </template>
      <div class="min-h-[100px]">
        <Statistics />
      </div>
    </NTabPane>
    <NTabPane v-if="userStore.userInfo.root" name="Config" tab="Config">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri:list-settings-line" />
        <span class="ml-2">{{ $t('setting.config') }}</span>
      </template>
      <About />
    </NTabPane>
    <NTabPane v-if="userStore.userInfo.root" name="SiteConfig" tab="SiteConfig">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri:settings-line" />
        <span class="ml-2">{{ $t('setting.siteConfig') }}</span>
      </template>
      <Site />
    </NTabPane>
    <NTabPane v-if="userStore.userInfo.root" name="AuditConfig" tab="AuditConfig">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri:settings-line" />
        <span class="ml-2">{{ $t('setting.auditConfig') }}</span>
      </template>
      <Audit />
    </NTabPane>
    <NTabPane v-if="userStore.userInfo.root" name="UserConfig" tab="UserConfig">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri-user-5-line" />
        <span class="ml-2">{{ $t('setting.userConfig') }}</span>
      </template>
      <User />
    </NTabPane>
    <NTabPane v-if="userStore.userInfo.root" name="KeysConfig" tab="KeysConfig">
      <template #tab>
        <SvgIcon class="text-lg" icon="ri-key-2-line" />
        <span class="ml-2">{{ $t('setting.keysConfig') }}</span>
      </template>
      <Key />
    </NTabPane>
  </NTabs>
</template>
