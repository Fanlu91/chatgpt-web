import { ObjectId } from 'mongodb'
import { Status } from 'src/types/Status'
import Database from '../utils/database'
import { UserConfig, UserInfo, VerificationCode } from '../types/model'
import { UserRole } from '../types/UserRole'

const userCollection = 'user'
const verificationCollection = 'verification_code'

export async function getUser(username: string): Promise<UserInfo> {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  username = username.toLowerCase()
  const userInfo = await userCol.findOne({ username }) as UserInfo
  initUserInfo(userInfo)
  return userInfo
}

export async function createUser(username: string, password: string): Promise<UserInfo> {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  username = username.toLowerCase()
  const userInfo = new UserInfo(username, password)
  await userCol.insertOne(userInfo)
  return userInfo
}

export async function getUserById(userId: string): Promise<UserInfo> {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  const userInfo = await userCol.findOne({ _id: new ObjectId(userId) }) as UserInfo
  initUserInfo(userInfo)
  return userInfo
}

export async function getUsers(page: number, size: number): Promise<{ users: UserInfo[]; total: number }> {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  const query = { status: { $ne: Status.Deleted } }
  const cursor = userCol.find(query).sort({ createTime: -1 })
  const total = await userCol.countDocuments(query)
  const skip = (page - 1) * size
  const limit = size
  const pagedCursor = cursor.skip(skip).limit(limit)
  const users = []
  await pagedCursor.forEach((doc) => {
    users.push(doc)
  })
  users.forEach((user) => {
    initUserInfo(user)
  })
  return { users, total }
}

export async function updateUserInfo(userId: string, user: UserInfo) {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  return userCol.updateOne({ _id: new ObjectId(userId) }
    , { $set: { nickname: user.nickname, description: user.description, avatar: user.avatar } })
}

export async function verifyUser(email: string, status: Status) {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  email = email.toLowerCase()
  return await userCol.updateOne({ email }, { $set: { status, verifyTime: new Date().toLocaleString() } })
}

export async function updateUserStatus(userId: string, status: Status) {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  return await userCol.updateOne({ _id: new ObjectId(userId) }, { $set: { status, verifyTime: new Date().toLocaleString() } })
}

export async function updateUserRole(userId: string, roles: UserRole[]) {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  return await userCol.updateOne({ _id: new ObjectId(userId) }, { $set: { roles, verifyTime: new Date().toLocaleString() } })
}

function initUserInfo(userInfo: UserInfo) {
  if (userInfo == null)
    return
  if (userInfo.config == null)
    userInfo.config = new UserConfig()
  if (userInfo.config.chatModel == null)
    userInfo.config.chatModel = 'gpt-3.5-turbo'
  if (userInfo.roles == null || userInfo.roles.length <= 0)
    userInfo.roles = [UserRole.User]
}
export async function generateVerificationCode(phoneNumber: string): Promise<VerificationCode> {
  const db = await Database.getDB()
  const verificationCol = db.collection(verificationCollection)

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  const existingCode = await verificationCol.findOne({ phoneNumber, createdAt: { $gte: tenMinutesAgo } })
  if (existingCode)
    return new VerificationCode(existingCode.phoneNumber, existingCode.code)

  const newCode = new VerificationCode(phoneNumber, Math.floor(1000 + Math.random() * 9000).toString())
  await verificationCol.insertOne(newCode)

  return newCode
}

export async function getVerificationCode(phoneNumber: string, code: string) {
  const db = await Database.getDB()
  const verificationCol = db.collection(verificationCollection)
  const verificationCode = await verificationCol.findOne({ phoneNumber, code }) as VerificationCode
  // console.log(verificationCode)
  return verificationCode
}

export async function updateUserPassword(userId: string, password: string) {
  const db = await Database.getDB()
  const userCol = db.collection(userCollection)
  return userCol.updateOne({ _id: new ObjectId(userId) }, { $set: { password, updateTime: new Date().toLocaleString() } })
}
