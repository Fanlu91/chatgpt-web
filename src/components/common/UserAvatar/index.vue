<script setup lang='ts'>
import { computed } from 'vue'
import { NAvatar, NTag } from 'naive-ui'
import { useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <NAvatar size="large" round :src="defaultAvatar" />
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 v-if="userInfo.nickname" class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo.nickname }}
        <NTag size="small" :bordered="false" type="success">
          Admin
        </NTag>
      </h2>
    </div>
  </div>
</template>
