<script setup lang="ts">
import { defineComponent, h } from 'vue'
import {
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification,
} from 'naive-ui'

// The useDialog, useLoadingBar, useMessage, and useNotification hooks are also imported from the naive-ui library are used to get instances of the global components.
function registerNaiveTools() {
  // window 对象表示浏览器窗口，是客户端 JavaScript 中的全局对象。
  window.$loadingBar = useLoadingBar()
  window.$dialog = useDialog()
  window.$message = useMessage()
  window.$notification = useNotification()
  // window 对象提供了很多用于处理窗口、事件、计时器、导航和历史记录、执行 AJAX 请求、处理 Web Storage 等任务的方法和属性。
  // 对于浏览器环境下的 JavaScript，window 是最顶层的全局对象，所有的全局作用域中的变量和函数都是它的属性和方法。
}

// defineComponent 用来定义一个名为 NaiveProviderContent 的组件。在这个组件的 setup 方法中，调用了 registerNaiveTools 函数，这个函数的主要目的是初始化一些全局的 naive-ui 组件
// 包括 $loadingBar、$dialog、$message 和 $notification。这四个组件都是 naive-ui 中的全局组件，用来在任何地方展示加载条、对话框、消息和通知。
// 它们都被注册到了 window 对象上，所以可以在全局任何地方使用。
const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  setup() {
    registerNaiveTools()
  },
  // 在 Vue 3 中，render 函数用于定义组件的输出。在这里，我们返回了一个空的 div 元素。
  // This is because the defineComponent function requires a render function to be defined, even if it is not used.
  render() {
    return h('div')
  },
})
</script>

<template>
  <!-- Provider 组件，它们通常用于在全局范围内提供一些功能或服务。 -->
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <slot />
          <NaiveProviderContent />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>

<!-- 这个嵌套的写法确实可能在第一眼看上去有些奇怪，但实际上这是 React 和 Vue 等现代前端框架中常见的一种模式，被称为 "Context Provider" 或 "Service Provider"。
  这种模式允许你在组件树的顶部提供一些全局的状态或服务，然后在下层的任何组件中都可以获取和使用这些状态或服务。

  通常来说，这些 Provider 之间是独立的，没有依赖关系，所以改变它们的顺序应该不会影响代码的运行。然而，如果其中某个 Provider 依赖于另一个 Provider 提供的服务，那么顺序就会变得很重要了。在你给出的这段代码中，我没有看到明显的依赖关系，所以我认为改变顺序应该不会有影响。

  至于可读性，确实，这种嵌套的写法在一开始可能会让人感到困惑，特别是对于不熟悉这种模式的人来说。然而，一旦你理解了这种模式的目的和工作方式，你就会发现它其实是一种非常强大和灵活的方式来提供全局状态和服务。

  最后，关于 `NaiveProviderContent` 组件的作用，它的主要目的是在 `setup` 方法中注册全局服务的实例到 `window` 对象上。这样做的好处是，这些服务可以在全局的任何地方被访问和使用，而不需要在每个需要使用它们的组件中单独导入和初始化。

  这是一种通用的实践，特别是在大型应用中，全局服务的注册通常会在应用的入口文件或某个特定的 "setup" 或 "bootstrap" 文件中进行。 -->
