import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { checkUserAndPhone, getAndSendVerificationCode, register, resetPassword, verifyUser } from '../service/userService'
import { UserRole } from '../types/UserRole'
import { getCacheConfig } from '../service/configService'
import { handleErrors } from '../utils/errorHandler'

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { phone, existingUser } = req.body
  try {
    await checkUserAndPhone(phone, existingUser)
    const response = await getAndSendVerificationCode(phone)
    res.send({ status: 'Success', message: response.message, data: null })
  }
  catch (error) {
    console.error('发送短信验证码失败:', phone, error.message)
    handleErrors(res, error)
  }
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password)
    throw new Error('用户名或密码为空 | Username or password is empty')
  console.log(new Date(), '登录', username)
  try {
    const user = await verifyUser(username, password)
    const config = await getCacheConfig()
    const token = jwt.sign({
      name: user.nickname,
      phone: user.phone,
      avatar: user.avatar,
      description: user.description,
      userId: user._id,
      root: user.roles.includes(UserRole.Admin),
      config: user.config,
    }, config.siteConfig.loginSalt.trim())

    res.send({ status: 'Success', message: '登录成功 | Login successfully', data: { token } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
}

export const userRegister = async (req: Request, res: Response) => {
  const { username, verificationCode, password } = req.body
  try {
    const data = await register(username, verificationCode, password)
    res.send({ status: 'Success', message: data.message, data: null })
  }
  catch (error) {
    console.error('注册失败:', username, error.message)
    handleErrors(res, error)
  }
}

export const userResetPassword = async (req: Request, res: Response) => {
  const { username, password, sign } = req.body
  try {
    const data = await resetPassword(username, password, sign)
    res.send({ status: 'Success', message: data.message, data: null })
  }
  catch (error) {
    handleErrors(res, error)
  }
}
