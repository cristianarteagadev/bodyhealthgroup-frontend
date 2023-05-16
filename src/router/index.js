import { createRouter, createWebHistory } from 'vue-router'
import NewsView from '../views/NewsView.vue'

const routes = [
  {
    path: '/',
    name: 'noticias',
    component: NewsView
  },
  {
    path: '/crear-noticia',
    name: 'crear-noticia',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreatePost.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
