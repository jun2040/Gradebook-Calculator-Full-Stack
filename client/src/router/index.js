import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/public/Home.vue'
import Login from '../views/public/Login.vue'
import Register from '../views/public/Register.vue'

import Dashboard from '../views/Dashboard.vue'
import Group from '../views/Group.vue'
import Task from '../views/Task.vue'
import Student from '../views/Student.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { auth: true }
  },
  {
    path: '/group/:group_id',
    name: 'Group',
    component: Group,
    meta: { auth: true }
  },
  {
    path: '/task/:group_id/:task_id',
    name: 'Task',
    component: Task,
    meta: { auth: true }
  },
  {
    path: '/student/:group_id/:student_id',
    name: 'Student',
    component: Student,
    meta: { auth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const loggedIn = localStorage.getItem('user');

  if (to.meta.auth && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
