import type { ObjectId } from 'mongodb'
import type { TextAuditServiceOptions, TextAuditServiceProvider } from 'src/utils/textAudit'
import { Status } from '../types/Status'
import { UserRole } from '../types/UserRole'

export class UserInfo {
  _id: ObjectId
  username: string
  nickname: string
  email: string
  phone: string
  password: string
  status: Status
  createTime: string
  expiredTime: string
  avatar?: string
  description?: string
  updateTime?: string
  config?: UserConfig
  roles?: UserRole[]
  constructor(username: string, password: string) {
    const expiredDate = new Date()
    expiredDate.setDate(expiredDate.getDate() + 7)

    this.nickname = '暂未设置'
    this.username = username
    this.phone = username
    this.password = password
    this.status = Status.Expired
    this.createTime = new Date().toLocaleString()
    this.expiredTime = expiredDate.toLocaleString()
    this.updateTime = new Date().toLocaleString()
    this.roles = [UserRole.User]
  }
}

export class UserConfig {
  chatModel: CHATMODEL
}

// https://platform.openai.com/docs/models/overview
// 除此之外，gpt-4-0314、gpt-4-32k-0314、gpt-3.5-turbo-0301 模型将在 9 月 13 日被弃用。
export type CHATMODEL = 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k' | 'gpt-4' | 'gpt-4-32k' | 'gpt-4-browsing'

export const chatModels: CHATMODEL[] = [
  'gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k', 'gpt-4-browsing',
]

export const chatModelOptions = [
  'gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k', 'gpt-4-browsing',
].map((model: string) => {
  const label = model
  return {
    label,
    key: model,
    value: model,
  }
})

export class ChatRoom {
  _id: ObjectId
  roomId: number
  userId: string
  title: string
  prompt: string
  usingContext: boolean // 上下文模式
  status: Status = Status.Normal
  constructor(userId: string, title: string, roomId: number) {
    this.userId = userId
    this.title = title
    this.prompt = undefined
    this.roomId = roomId
    this.usingContext = true
  }
}

export class ChatOptions {
  parentMessageId?: string
  messageId?: string
  conversationId?: string
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
  estimated?: boolean
  constructor(parentMessageId?: string, messageId?: string, conversationId?: string) {
    this.parentMessageId = parentMessageId
    this.messageId = messageId
    this.conversationId = conversationId
  }
}

export class previousResponse {
  response: string
  options: ChatOptions
}

export class ChatInfo {
  _id: ObjectId
  roomId: number
  uuid: number
  dateTime: number
  prompt: string
  response?: string
  status: Status = Status.Normal
  options: ChatOptions
  previousResponse?: previousResponse[]
  constructor(roomId: number, uuid: number, prompt: string, options: ChatOptions) {
    this.roomId = roomId
    this.uuid = uuid
    this.prompt = prompt
    this.options = options
    this.dateTime = new Date().getTime()
  }
}

export class UsageResponse {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  estimated: boolean
}

export class ChatUsage {
  _id: ObjectId
  userId: ObjectId
  roomId: number
  chatId: ObjectId
  messageId: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimated: boolean
  dateTime: number
  constructor(userId: ObjectId, roomId: number, chatId: ObjectId, messageId: string, usage: UsageResponse) {
    this.userId = userId
    this.roomId = roomId
    this.chatId = chatId
    this.messageId = messageId
    if (usage) {
      this.promptTokens = usage.prompt_tokens
      this.completionTokens = usage.completion_tokens
      this.totalTokens = usage.total_tokens
      this.estimated = usage.estimated
    }
    this.dateTime = new Date().getTime()
  }
}

export class Config {
  constructor(
    public _id: ObjectId,
    public timeoutMs: number,
    public apiKey?: string,
    public apiDisableDebug?: boolean,
    public accessToken?: string,
    public apiBaseUrl?: string,
    public apiModel?: APIMODEL,
    public reverseProxy?: string,
    public socksProxy?: string,
    public socksAuth?: string,
    public httpsProxy?: string,
    public siteConfig?: SiteConfig,
    public mailConfig?: MailConfig,
    public auditConfig?: AuditConfig,
  ) { }
}

export class SiteConfig {
  constructor(
    public siteTitle?: string,
    public loginEnabled?: boolean,
    public loginSalt?: string,
    public registerEnabled?: boolean,
    public registerReview?: boolean,
    public registerMails?: string,
    public siteDomain?: string,
  ) { }
}

export class MailConfig {
  constructor(
    public smtpHost: string,
    public smtpPort: number,
    public smtpTsl: boolean,
    public smtpUserName: string,
    public smtpPassword: string,
  ) { }
}

export class AuditConfig {
  constructor(
    public enabled: boolean,
    public provider: TextAuditServiceProvider,
    public options: TextAuditServiceOptions,
    public textType: TextAudioType,
    public customizeEnabled: boolean,
    public sensitiveWords: string,
  ) { }
}

export enum TextAudioType {
  None = 0,
  Request = 1 << 0, // 二进制 01
  Response = 1 << 1, // 二进制 10
  All = Request | Response, // 二进制 11
}

export class KeyConfig {
  _id: ObjectId
  key: string
  keyModel: APIMODEL
  chatModels: CHATMODEL[]
  userRoles: UserRole[]
  status: Status
  remark: string
  constructor(key: string, keyModel: APIMODEL, chatModels: CHATMODEL[], userRoles: UserRole[], remark: string) {
    this.key = key
    this.keyModel = keyModel
    this.chatModels = chatModels
    this.userRoles = userRoles
    this.status = Status.Normal
    this.remark = remark
  }
}

export type APIMODEL = 'ChatGPTAPI'

export class VerificationCode {
  _id: ObjectId
  phoneNumber: string
  code: string
  createdAt: Date
  updatedAt: Date
  constructor(phoneNumber: string, code: string) {
    this.phoneNumber = phoneNumber
    this.code = code
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
