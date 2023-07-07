<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'

import { useUserStore } from '@/store'
import type { UserInfo } from '@/store/modules/user/helper'
import { t } from '@/locales'

const userStore = useUserStore()

const ms = useMessage()

const userInfo = computed(() => userStore.userInfo)

const avatar = ref(userInfo.value.avatar ?? '')

const nickname = ref(userInfo.value.nickname ?? '')

const description = ref(userInfo.value.description ?? '')

async function updateUserInfo(options: Partial<UserInfo>) {
  await userStore.updateUserInfo(true, options)
  ms.success(t('common.success'))
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">用户昵称</span>
        <div class="w-[200px]">
          <NInput v-model:value="nickname" placeholder="" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]" />
        <NButton type="primary" @click="updateUserInfo({ avatar, nickname, description })">
          保存设置
        </NButton>
      </div>
    </div>
  </div>
</template>
