<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Task from './Task.vue'
import axios from 'axios';
const authToken = localStorage.getItem("token")
const tasks = ref([])
const statuses = ref([]);
const users = ref([])
const isActive = ref(false)
const isAddStatusActive = ref(false)

const router = useRouter()
onMounted(() => {

  if (!authToken) router.push('login')
  loadTasks(tasks)

})
function loadTasks(tasks, searchParam) {
  let URL = "http://localhost:8080/api/tasks"
  if (searchParam != undefined && searchParam != '')
    URL = URL + "?search="  + searchParam

  axios.get(URL, {
    headers: { "Authorization": "Bearer " + authToken }
  }).then((response) => {
    tasks.value = response.data
  }).catch((error) => {
    if (error.response.status == 401) router.push('login')
    if (error.response.status == 403) router.push('login')
  })
}
function loadStatuses(statuses) {

  URL = "http://localhost:8080/api/statuses"
  axios.get(URL,
    { headers: { "Authorization": "Bearer " + authToken } }
  ).then((response) => {
    statuses.value = response.data
  }).catch((error) => {
    if (error.response.status == 401) router.push('login')
    if (error.response.status == 403) router.push('login')
  })
}
function loadUsers(users) {
  URL = "http://localhost:8080/api/users"
  axios.get(URL,
    { headers: { "Authorization": "Bearer " + authToken } }
  ).then((response) => {
    users.value = response.data
  }).catch((error) => {
    if (error.response.status == 401) router.push('login')
    if (error.response.status == 403) router.push('login')
  })
}
const taskName = ref()
const statusId = ref()
const assigneeId = ref()
watch(isActive, () => {
  if (isActive.value) {
    loadStatuses(statuses);
    loadUsers(users)
  } else {

    assigneeId.value = null
    statusId.value = null
    taskName.value = null
  }
})
function createTask() {
  URL = "http://localhost:8080/api/task"
  axios.post(URL, {
    name: taskName.value,
    statusId: statusId.value,
    assigneeId: assigneeId.value
  }, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  }).then((response) => {
    tasks.value.push(response.data)
  }).catch((error) => {
  })

  isActive.value = false
  taskName.value = null
  statusId.value = null
  assigneeId.value = null
}
function logOut() {
  localStorage.removeItem("token")
  router.push('login')
}
const statusName = ref()
function createStatus() {
  URL = "http://localhost:8080/api/status"
  axios.post(URL, {
    name: statusName.value
  }, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  }).then((response) => {
  }).catch((error) => {
  })
  isAddStatusActive.value = false
  statusName.value = null
}


const search = ref()
function searchFilter() {
 loadTasks(tasks, search.value)
}


</script>
<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="To Do" class="px-10">
      <v-spacer></v-spacer>
      <v-btn @click="logOut()" color="error">Log Out</v-btn>
    </v-app-bar>

    <!-- <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-container class="container">
      <v-row>
        <v-col>
          <v-text-field clearable v-model="search" variant="outlined" density="compact" label="Search" @click:clear="searchFilter()"></v-text-field>
        </v-col>
        <v-col>
          <v-btn variant="outlined" @click="searchFilter()" >
            search
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="6">
          <v-sheet class="pa-2 col-title">Name</v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="pa-2 col-title">
            Status
            <v-icon icon="mdi-plus" color="primary" @click="isAddStatusActive = true"></v-icon>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="pa-2 col-title">Reporter</v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="pa-2 col-title">Assignee</v-sheet>
        </v-col>
      </v-row>
      <Task v-for="task in tasks" :key="task.id" :task="task" @delete="(n) => tasks.filter((item) => item.id == n)"></Task>
      <v-row class="create">
        <v-col>
          <v-sheet @click="isActive = true" class="pa-2 sheet">
            <v-icon icon="mdi-plus" color="primary"></v-icon>

            new task
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay v-model="isActive" class="align-center justify-center">
      <v-card title="New Task" class="task_edit pa-20">
        <v-card-text>
          <v-text-field v-model="taskName" label="Task Name" variant="outlined"></v-text-field>
          <v-select clearable v-model="statusId" label="Status" :items="statuses" item-title="name" item-value="id"
            variant="outlined"></v-select>
          <v-select clearable v-model="assigneeId" label="Assignee" :items="users" item-title="username" item-value="id"
            variant="outlined"></v-select>
        </v-card-text>

        <v-card-actions>
          <v-btn text="Close" @click="isActive = false"></v-btn>
          <v-spacer></v-spacer>
          <v-btn text="Create" @click="createTask()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <v-overlay v-model="isAddStatusActive" class="align-center justify-center">
      <v-card title="New Status" class="task_edit pa-20">
        <v-card-text>
          <v-text-field v-model="statusName" label="Task Name" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text="Close" @click="isAddStatusActive = false"></v-btn>
          <v-spacer></v-spacer>
          <v-btn text="Create" @click="createStatus()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-layout>

</template>
<style scoped>
.container {
  width: 1000px;
  border: 1px solid grey;
  border-radius: 5px;
}

.create:hover .sheet {
  cursor: pointer;
  background-color: rgb(212, 212, 212);
}

.sheet {
  border: 1px solid grey;
  border-radius: 5px;
}

.task_edit {
  width: 500px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #E8EAF6;
  width: 100%;
  height: 10%;
  border-bottom: 1px solid gray;
}

@media (max-width: 1024px) {
  .container {
    margin-top: 80px;
  }
}
</style>