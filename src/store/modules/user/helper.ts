import { UserConfig } from '@/views/Setting/model'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  username: string
  nickname: string
  avatar: string
  description: string
  phone: string
  root: boolean
  config: UserConfig
  createTime?: string
  expiredTime?: string
  updateTime?: string
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      username: '',
      nickname: '未设置',
      avatar: '',
      description: '',
      phone: '',
      root: false,
      createTime: '',
      expiredTime: '',
      updateTime: '',
      config: { chatModel: 'gpt-3.5-turbo' },
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  if (localSetting != null && localSetting.userInfo != null && localSetting.userInfo.config == null)
    localSetting.userInfo.config = new UserConfig()
    // localSetting.userInfo.config.chatModel = 'gpt-3.5-turbo'

  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
