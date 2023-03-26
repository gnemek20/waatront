import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/Landing.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/sign/Login.vue')
  },
  {
    path: '/workbench',
    name: 'workbench',
    component: () => import('@/views/work/Workbench.vue')
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('@/views/work/Workspace.vue')
  },
  {
    path: '/annotation',
    name: 'annotation',
    component: () => import('@/views/work/Annotation.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
