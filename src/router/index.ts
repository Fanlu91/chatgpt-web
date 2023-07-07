import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { useAuthStore } from '@/store'
import { ChatLayout } from '@/views/chat/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/home',
  },
  {
    path: '/c',
    name: 'chat',
    component: ChatLayout,
    children: [
      {
        path: '/c/:uuid?',
        name: 'child',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/chat/layout/Layout.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/u',
    name: 'userinfo',
    component: () => import('@/views/userinfo/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // Check if the user is authenticated
  if (!authStore.isAuthenticated && to.path !== '/home') {
    // If the user is not authenticated and not trying to access home, redirect to home
    next('/home')
  }
  else {
    // Otherwise continue to the destination route
    next()
  }
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
