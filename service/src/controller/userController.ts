import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { Status } from 'src/types/Status'
import type { UserInfo } from 'src/types/model'
import { sendNoticeMail } from 'src/utils/mail'
import { getUserById, listUser, updateUserRole, updateUserStatus } from '../repository/UserRepository'
import { checkUserAndPhone, getAndSendVerificationCode, performUpdateUserInfo, register, resetPassword, verifyUser } from '../service/userService'
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
      userId: user._id,
      root: user.roles.includes(UserRole.Admin),
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

export const updateUserInfoController = async (req, res) => {
  try {
    const { nickname } = req.body as UserInfo
    const userId = req.headers.userId.toString()
    await performUpdateUserInfo(userId, nickname)
    res.send({ status: 'Success', message: '更新成功 | Update successfully' })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
}

export const getUserInfoController = async (req, res) => {
  try {
    const userId = req.headers.userId.toString()
    const user = await getUserById(userId)
    res.send({ status: 'Success', message: '获取成功 | Get successfully', data: user })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
}

export const getUsersController = async (req, res) => {
  try {
    const page = +req.query.page
    const size = +req.query.size
    const data = await listUser(page, size)
    res.send({ status: 'Success', message: '获取成功 | Get successfully', data })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
}

export const updateUserStatusController = async (req, res) => {
  try {
    const { userId, status } = req.body as { userId: string; status: Status }
    const user = await getUserById(userId)
    await updateUserStatus(userId, status)
    if ((user.status === Status.PreVerify || user.status === Status.AdminVerify) && status === Status.Normal)
      await sendNoticeMail(user.email)
    res.send({ status: 'Success', message: '更新成功 | Update successfully' })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
}

export const updateUserRoleController = async (req, res) => {
  try {
    const { userId, roles } = req.body as { userId: string; roles: UserRole[] }
    await updateUserRole(userId, roles)
    res.send({ status: 'Success', message: '更新成功 | Update successfully' })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
}
