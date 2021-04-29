import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Functional',
    component:() => import('../views/Functional.vue')
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import('../views/Performance.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/Report.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/detail/:testID',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
