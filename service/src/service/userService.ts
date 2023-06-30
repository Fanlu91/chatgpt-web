import { isPhoneNumber, isValidPassword } from 'src/utils/is'
import { sendRegisterSms } from 'src/utils/phone'
import { ForbiddenError, ServiceUnavailableError } from 'src/utils/errorHandler'
import type { UserInfo } from 'src/types/model'
import { Status } from '../types/Status'
import { encryptPassword } from '../utils/security'
import { createUser, generateVerificationCode, getUser, getUserById, getVerificationCode, updateUserInfo, updateUserPassword } from '../repository/UserRepository'
import { getCacheConfig } from './configService'

export const verifyUser = async (username: string, password: string) => {
  const user = await getUser(username)
  if (!user || user.password !== encryptPassword(password))
    throw new ForbiddenError('用户不存在或密码错误 | User does not exist or incorrect password.')

  if (user.status === Status.PreVerify)
    throw new ForbiddenError('注册信息验证成功。但是很抱歉，本站目前不向公众提供服务。')

  if (user.status === Status.AdminVerify)
    throw new ForbiddenError('请等待管理员开通 | Please wait for the admin to activate')

  if (user.status === Status.Expired)
    throw new ForbiddenError('您的账户已过期，请联系管理员处理。')

  if (user.status !== Status.Normal)
    throw new ForbiddenError('账状态异常 | Account status abnormal.')

  return user
}

const sendVerificationCodeCooldown = {}

export const checkUserAndPhone = async (phone: string, existingUser: boolean) => {
  if (!phone || !isPhoneNumber(phone))
    throw new ForbiddenError('请输入格式正确的手机号')

  const user = await getUser(phone)
  if (existingUser) {
    if (user == null)
      throw new ForbiddenError('您不是本站用户')
  }
  else {
    if (user != null)
      throw new ForbiddenError('该手机号已注册，请直接登录')
  }

  if (sendVerificationCodeCooldown[phone] && Date.now() - sendVerificationCodeCooldown[phone] < 60000)
    throw new ForbiddenError('1分钟之内不能重复发送验证码')
}

export const getAndSendVerificationCode = async (phone: string) => {
  const verificationCode = await generateVerificationCode(phone)
  console.log('生成短信验证码:', phone, verificationCode.code)

  const response = await sendRegisterSms(phone, verificationCode.code)

  if (response.SendStatusSet[0].Code === 'Ok') {
    sendVerificationCodeCooldown[phone] = Date.now()
    return { message: '短信验证码已发送，10分钟内有效' }
  }
  else {
    throw new ServiceUnavailableError('短信服务暂时不可用，请稍后重试或联系管理员')
  }
}

export const validateVerificationCode = async (username, verificationCode) => {
  const existingCode = await getVerificationCode(username, verificationCode)
  if (!existingCode)
    throw new ForbiddenError('验证码错误')

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  if (existingCode.createdAt < tenMinutesAgo)
    throw new ForbiddenError('验证码已过期')
}

export const register = async (username: string, verificationCode: string, password: string) => {
  const config = await getCacheConfig()
  if (!config.siteConfig.registerEnabled)
    throw new ForbiddenError('注册账号功能未启用')

  const user = await getUser(username)
  if (user != null)
    throw new ForbiddenError('该手机号已注册，请直接登录')

  if (!password || !isValidPassword(password))
    throw new ForbiddenError('密码太简单，建议最少6位且需同时包含数字和字母')

  // await 关键字修饰的，这意味着如果这个函数抛出错误（或者返回一个 rejected 状态的 Promise），那么该错误会被立即抛出
  // register 函数的后续代码将不会被执行。
  await validateVerificationCode(username, verificationCode)

  const newPassword = encryptPassword(password)
  await createUser(username, newPassword)

  return { message: '注册成功。' }
}

export const resetPassword = async (username: string, password: string, sign: string) => {
  await validateVerificationCode(username, sign)

  const user = await getUser(username)
  if (user == null || user.status !== Status.Normal)
    throw new Error('账户状态异常 | Account status abnormal.')

  updateUserPassword(user._id.toString(), encryptPassword(password))

  return { message: '密码重置成功 | Password reset successful' }
}

export const performUpdateUserInfo = async (userId: string, nickname: string) => {
  const user = await getUserById(userId)
  if (user == null || user.status !== Status.Normal)
    throw new Error('用户不存在 | User does not exist.')
  await updateUserInfo(userId, { nickname } as UserInfo)
}
