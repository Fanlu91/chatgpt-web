import type { ChatMessage, FetchFn } from 'chatgpt'
import type { ChatRoom, UserInfo } from 'src/types/model'

export interface RequestOptions {
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
  temperature?: number
  top_p?: number
  user: UserInfo
  messageId: string
  tryCount: number
  room: ChatRoom
}

export interface BalanceResponse {
  total_usage: number
}

export interface RequestProps {
  roomId: number
  uuid: number
  regenerate: boolean
  prompt: string
  options?: ChatContext
  systemMessage: string
  temperature?: number
  top_p?: number
}

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string
  apiReverseProxyUrl?: string
  model?: string
  debug?: boolean
  headers?: Record<string, string>
  fetch?: FetchFn
}

export interface ModelConfig {
  apiModel?: APIMODEL
  reverseProxy?: string
  timeoutMs?: number
  socksProxy?: string
  socksAuth?: string
  httpsProxy?: string
  allowRegister?: boolean
  balance?: string
  accessTokenExpiredTime?: string
}

export type APIMODEL = 'ChatGPTAPI' | undefined

export interface JWT {
  'https://api.openai.com/profile': {
    'email': string
    'email_verified': boolean
  }
  'https://api.openai.com/auth': {
    'user_id': string
  }
  'iss': string
  'sub': string
  'aud': []
  'iat': number
  'exp': number
  'azp': string
  'scope': string
}
