```
You are a world class software engineer. I need you to draft a technical software spec for building the following: 

使用腾讯云的短信接口，为一个typescript + vue3 + nodejs express + mongodb的web应用增加短信验证码注册用户功能。以下是更多补充信息：

验证码功能至少包括验证码生成和验证功能，验证码（code）应当为4位随机数，10分钟失效。
如果用户已注册，则提示直接登录，不发送验证码
对于 vue，使用setup语法糖，使用NaiveUI组件
发送验证码功能，1分钟之内不能重复发送。增加控制，防止被滥用
关于验证码如何持久化及使用，请根据你的经验给出最佳实践的详细描述

一些已经写好的方法：
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
    <NButton type="primary" :loading="sendLoading" style="flex: 1; margin-left: 10px;" @click="handleSendVerificationCode">
        {{ $t('common.sendVerificationCode') }}
    </NButton>
    </div>
    <NButton block type="primary" :disabled="disabled || password !== confirmPassword" :loading="loading" @click="handleRegister">
    {{ $t('common.register') }}
    </NButton>
</NTabPane>

router.post('/user-send-verification-code', authLimiter, async (req, res) => {
  try {
    const { phone } = req.body as { phone: string }
    if (!phone || !isPhoneNumber(phone))
      throw new Error('请输入格式正确的手机号')

    const user = await getUser(phone)
    if (user != null)
      throw new Error('该手机号已注册，请直接登录')
    // getUserVerificationCode
    try {
      await sendRegisterSms(phone, await getUserVerificationCode(phone))
      res.send({ status: 'Success', message: '短信验证码已发送，10分钟内有效', data: null })
    }
    catch (err) {
      res.send({ status: 'Fail', message: err, data: null })
    }
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})


export async function sendRegisterSms(phoneNumber: string, code: number): Promise<any> {
  try {
    return await sendSms(phoneNumber, code, process.env.REGISTER_TEMPLATE_ID || '')
  }
  catch (err) {
    console.error(`Failed to send register SMS: ${err}`)
    throw err
  }
}

Think through how you would build it step by step. Then, respond with the complete spec in Chinese. I will then reply with "build," and you will proceed to implement the exact spec, writing all of the code needed. I will periodically interject with "continue" to prompt you to keep going. Continue until complete.
```