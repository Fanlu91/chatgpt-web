import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import type { UserInfo } from '../user/helper'
import { getToken, removeToken, setToken } from './helper'
import { store, useChatStore, useUserStore } from '@/store'
import { fetchSession } from '@/api'
import { UserConfig } from '@/views/Setting/model'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI'
  allowRegister: boolean
  title: string
  chatModels: {
    label: string
    key: string
    value: string
  }[]
  allChatModels: {
    label: string
    key: string
    value: string
  }[]
}

export interface AuthState {
  token: string | undefined
  session: SessionResponse | null
  cooldown: number
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
    cooldown: 0,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
    // if state.token is undefined, null, or an empty string (""), !!state.token will be false. Otherwise, if there is a token present, !!state.token will be true.
    isAuthenticated(state): boolean {
      return !!state.token
    },
  },

  actions: {
    startCooldown() {
      this.cooldown = 60
      const timerId = setInterval(() => {
        if (this.cooldown > 0)
          this.cooldown--
        else
          clearInterval(timerId)
      }, 1000)
    },

    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    async setToken(token: string) {
      this.token = token
      const decoded = jwt_decode(token) as UserInfo
      const userStore = useUserStore()
      if (decoded.config === undefined || decoded.config === null) {
        decoded.config = new UserConfig()
        decoded.config.chatModel = 'gpt-3.5-turbo'
      }

      await userStore.updateUserInfo(false, {
        avatar: decoded.avatar,
        nickname: decoded.nickname,
        description: decoded.description,
        root: decoded.root,
        config: decoded.config,
      })
      setToken(token)
    },

    async removeToken() {
      this.token = undefined
      const userStore = useUserStore()
      userStore.resetUserInfo()
      const chatStore = useChatStore()
      await chatStore.clearLocalChat()
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
