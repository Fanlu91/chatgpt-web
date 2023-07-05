// a debounce function that is used to limit the frequency of function calls 防抖
// The function takes a callback function and a wait time as parameters and returns a new function that can be called with the same arguments as the original function.
// The returned function will only call the original function once after the specified wait time has elapsed since the last call.
type CallbackFunc<T extends unknown[]> = (...args: T) => void

export function debounce<T extends unknown[]>(
  func: CallbackFunc<T>,
  wait: number,
): (...args: T) => void {
  // 定义了一个变量用来存放定时器的ID
  // ReturnType<typeof setTimeout>是获取setTimeout函数返回值的类型（也就是定时器ID的类型）
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: T) => {
    const later = () => {
      // 当一个定时器的回调函数（这里就是later函数）被执行的时候，定时器已经自动被清除了，
      // 所以这里的clearTimeout(timeoutId)对于功能来说并不是必要的，
      // 但是它可以确保timeoutId的值在定时器执行后被设置为undefined。
      clearTimeout(timeoutId)
      func(...args)
    }

    clearTimeout(timeoutId)
    timeoutId = setTimeout(later, wait)
  }
}
