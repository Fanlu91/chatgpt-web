<script lang="ts" setup>
import { computed, ref, unref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'

import { useUserStore } from '@/store'
import type { UserInfo } from '@/store/modules/user/helper'
import { t } from '@/locales'

const ms = useMessage()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const avatar = ref(userInfo.value.avatar ?? '')
const nickname = ref(userInfo.value.nickname ?? '')
const phone = ref(userInfo.value.phone ?? '')
const createTime = ref(userInfo.value.createTime ?? '')
const expiredTime = ref(userInfo.value.expiredTime ?? '')

const remainingDays = computed(() => {
  const now = new Date()
  const expiryDate = new Date(unref(expiredTime))
  const diffTime = expiryDate.getTime() - now.getTime()
  return unref(diffTime) < 0 ? '已过期' : Math.ceil(unref(diffTime) / (1000 * 60 * 60 * 24)) // convert milliseconds to days
})

userStore.getUserData()

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
        <span class="flex-shrink-0 w-[100px]">头像链接</span>
        <div class="w-[200px]">
          <NInput v-model:value="avatar" placeholder="" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">手机号码</span>
        <div class="w-[200px]">
          <span>{{ phone }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">账户创建时间</span>
        <div class="w-[200px]">
          <span>{{ createTime }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">账户有效期</span>
        <div class="w-[200px]">
          <span>{{ expiredTime }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">剩余有效天数</span>
        <div class="w-[200px]">
          <span>{{ remainingDays }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]" />
        <NButton type="primary" @click="updateUserInfo({ nickname })">
          保存设置
        </NButton>
      </div>
    </div>
  </div>
</template>
