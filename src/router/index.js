import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Canvas from '../components/Canvas.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/project/:projectId',
    name: 'Project',
    component: Canvas,
    props: true
  },
  {
    path: '/new-project',
    name: 'NewProject',
    component: Canvas,
    props: { newProject: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router