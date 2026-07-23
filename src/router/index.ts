import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/payment/return',
      name: 'payment-return',
      redirect: (to) => ({ path: '/', query: to.query }),
    },
    {
      path: '/notify',
      redirect: '/',
    },
    {
      path: '/about',
      redirect: '/',
    },
  ],
})

export default router
