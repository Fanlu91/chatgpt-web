import { defineStore } from 'pinia'
import { fetchUpdateUserInfo } from '../../../api/'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

export const useUserStore = defineStore('user-store', {
  // (): UserState 表示这个函数没有参数，并且返回一个 UserState 类型的值。
  // 不使用箭头函数这么写
  // state: function(): UserState {
  //   return getLocalState();
  // }
  state: (): UserState => getLocalState(),
  actions: {
    //  Partial<>，这是 TypeScript 的一个实用类型。
    // 当你有一个已经定义好的类型，但是你想让所有的属性都变成可选的，那么可以使用 Partial
    async updateUserInfo(update: boolean, userInfo: Partial<UserInfo>) {
      // 对象展开语法，意思是合并 this.userInfo 和 userInfo
      // 如果它们有相同的属性，那么 userInfo 的属性值会覆盖 this.userInfo 中的相同属性。
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
      if (update)
        await fetchUpdateUserInfo(userInfo.name ?? '', userInfo.avatar ?? '', userInfo.description ?? '')
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
