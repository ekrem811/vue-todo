import { createMemoryHistory, createRouter } from "vue-router";

import TaskList from "./components/TaskList.vue";
import Login from "./components/Login.vue"

const routes = [
  {path: '/', component: TaskList},
  { path: '/login', component: Login},
  { path: '/tasks', component: TaskList },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router