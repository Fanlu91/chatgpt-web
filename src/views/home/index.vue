<script setup lang='ts'>
import { NButton, NInput, NModal, NTabPane, NTabs, useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchLogin, fetchRegister, fetchResetPassword, fetchSendVerificationCode } from '@/api'
import Icon403 from '@/icons/403.vue'
import { useAuthStore } from '@/store'

const visible = ref(true)
const router = useRouter()
const authStore = useAuthStore()

const showMessage = useMessage()

const activeTab = ref('login')

const loading = ref(false)
const sendLoading = ref(false)

const username = ref('')
const password = ref('')
const verificationCode = ref('')
const showConfirmPassword = ref(false)
const confirmPassword = ref('')
const disabled = computed(() => !username.value.trim() || !password.value.trim() || loading.value)

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)

const confirmPasswordStatus = computed(() => {
  if (!password.value || !confirmPassword.value)
    return undefined
  return password.value !== confirmPassword.value ? 'error' : 'success'
})

onMounted(async () => {
  // console.log(authStore.$state.session)
  if (authStore.isAuthenticated)
    router.replace('/chat')
})

function handlePasswordInput() {
  showConfirmPassword.value = password.value.trim() !== ''
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLogin()
  }
}

async function handleLogin() {
  const name = username.value.trim()
  const pwd = password.value.trim()

  if (!name || !pwd)
    return

  try {
    loading.value = true
    const result = await fetchLogin(name, pwd)
    await authStore.setToken(result.data.token)
    showMessage.success('success')
    window.location.reload()
  }
  catch (error: any) {
    showMessage.loading(error.message ?? 'error')
    password.value = ''
  }
  finally {
    loading.value = false
  }
}

async function handleRegister() {
  const name = username.value.trim()
  const pwd = password.value.trim()
  const confirmPwd = confirmPassword.value.trim()
  const verifCode = verificationCode.value.trim()
  if (!name || !pwd || !confirmPwd || pwd !== confirmPwd) {
    showMessage.loading('两次输入的密码不一致 | Passwords don\'t match')
    return
  }

  try {
    loading.value = true
    const result = await fetchRegister(name, pwd, verifCode)
    showMessage.success(result.message as string)
  }
  catch (error: any) {
    const message = error.response?.data?.message ?? 'error'
    showMessage.loading(message)
  }
  finally {
    loading.value = false
  }
}

async function handleSendVerificationCode(isReset: boolean) {
  const name = username.value.trim()

  if (!name)
    return

  try {
    sendLoading.value = true
    const result = await fetchSendVerificationCode(name, isReset)
    showMessage.success(result.message as string)
    if (result.status === 'Success')
      authStore.startCooldown()
  }
  catch (error: any) {
    const message = error.response?.data?.message ?? 'error'
    showMessage.loading(message)
  }
  finally {
    sendLoading.value = false
  }
}

async function handleResetPassword() {
  const name = username.value.trim()
  const pwd = password.value.trim()
  const confirmPwd = confirmPassword.value.trim()
  const verifCode = verificationCode.value.trim()
  if (!name || !pwd || !confirmPwd || pwd !== confirmPwd) {
    showMessage.loading('两次输入的密码不一致 | Passwords don\'t match')
    return
  }

  try {
    loading.value = true
    const result = await fetchResetPassword(name, pwd, verifCode)
    showMessage.success(result.message as string)
    router.replace('/chat')
  }
  catch (error: any) {
    const message = error.response?.data?.message ?? 'error'
    showMessage.loading(message)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <NModal :show="visible" style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh;">
    <div class="p-10 bg-white rounded dark:bg-slate-800 flex flex-col h-full">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <div style="width: 90%; max-width: 600px; margin: 0 auto; " class="space-y-4">
          <NTabs v-model:value="activeTab" type="line">
            <NTabPane name="login" :tab="$t('common.login')">
              <NInput v-model:value="username" type="text" :placeholder="$t('common.phone')" class="mb-2" />
              <NInput v-model:value="password" type="password" :placeholder="$t('common.password')" class="mb-2" @keypress="handlePress" />

              <NButton block type="primary" :disabled="disabled" :loading="loading" @click="handleLogin">
                {{ $t('common.login') }}
              </NButton>
            </NTabPane>

            <NTabPane v-if="authStore.session && authStore.session.allowRegister" name="register" :tab="$t('common.register')">
              <NInput
                v-model:value="username"
                type="text"
                :allow-input="onlyAllowNumber"
                :placeholder="$t('common.phone')"
                class="mb-2"
              />
              <NInput v-model:value="password" type="password" :placeholder="$t('common.password')" class="mb-2" @input="handlePasswordInput" />
              <NInput
                v-if="showConfirmPassword"
                v-model:value="confirmPassword"
                type="password"
                :placeholder="$t('common.passwordConfirm')"
                class="mb-4"
                :status="confirmPasswordStatus"
              />
              <div style="display: flex; justify-content: space-between; ">
                <NInput
                  v-model:value="verificationCode"
                  maxlength="4"
                  show-count
                  clearable
                  :allow-input="onlyAllowNumber"
                  type="text"
                  :placeholder="$t('common.verificationCode')"
                  class="mb-4"
                  :status="confirmPasswordStatus"
                />

                <NButton type="primary" :loading="sendLoading" :disabled="authStore.cooldown > 0" style="flex: 1; margin-left: 10px;" @click="handleSendVerificationCode(false)">
                  {{ authStore.cooldown > 0 ? `${authStore.cooldown}秒后重新发送` : $t('common.sendVerificationCode') }}
                </NButton>
              </div>
              <NButton block type="primary" :disabled="disabled || password !== confirmPassword" :loading="loading" @click="handleRegister">
                {{ $t('common.register') }}
              </NButton>
            </NTabPane>

            <NTabPane name="resetPassword" :tab="$t('common.resetPassword')">
              <NInput v-model:value="username" type="text" :placeholder="$t('common.phone')" class="mb-2" />
              <div style="display: flex; justify-content: space-between;">
                <NInput v-model:value="verificationCode" maxlength="4" show-count clearable :allow-input="onlyAllowNumber" type="text" :placeholder="$t('common.verificationCode')" class="mb-4" />
                <NButton type="primary" :loading="sendLoading" :disabled="authStore.cooldown > 0" style="flex: 1; margin-left: 10px;" @click="handleSendVerificationCode(true)">
                  {{ authStore.cooldown > 0 ? `${authStore.cooldown}秒后重新发送` : $t('common.sendVerificationCode') }}
                </NButton>
              </div>
              <NInput v-model:value="password" type="password" :placeholder="$t('common.password')" class="mb-2" @input="handlePasswordInput" />
              <NInput v-if="showConfirmPassword" v-model:value="confirmPassword" type="password" :placeholder="$t('common.passwordConfirm')" class="mb-4" :status="confirmPasswordStatus" />
              <NButton block type="primary" :disabled="disabled || password !== confirmPassword" :loading="loading" @click="handleResetPassword">
                {{ $t('common.resetPassword') }}
              </NButton>
            </NTabPane>
          </NTabs>
        <!-- End Tabs -->
        </div>
      </div>
      <div class="mt-auto text-center">
        <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023008921号-1</a>
      </div>
    </div>
  </NModal>
</template>
