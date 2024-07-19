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

onMounted(() => {

  const router = useRouter()
  if (!authToken) router.push('login') 

  let URL = "http://localhost:8080/api/tasks"
  axios.get(URL, {
    headers: { "Authorization": "Bearer " + authToken }
  }).then((response) => {
    tasks.value = response.data
  }).catch((error)=>{
    if (error.response.status == 401) router.push('login')
    if (error.response.status == 403) router.push('login')
  })
})
function loadStatuses(statuses) {
  
  URL = "http://localhost:8080/api/statuses"
  axios.get(URL,
    { headers: {"Authorization": "Bearer " + authToken } }
  ).then((response) => {
    statuses.value = response.data
  }).catch((error)=>{
    if (error.response.status == 401) router.push('login')
    if (error.response.status == 403) router.push('login')
  })
}
function loadUsers(users) {
  URL = "http://localhost:8080/api/users"
  axios.get(URL,
    { headers: {"Authorization": "Bearer " + authToken } }
  ).then((response) => {
    console.log(response.data)
    users.value = response.data
    console.log(users)
  }).catch((error)=>{
    if (error.response.status == 401) router.push('login')
    if (error.response.status == 403) router.push('login')
  })
}
watch(isActive,()=>{
  if (isActive.value){
    loadStatuses(statuses);
    loadUsers(users)
  } 
})
const taskName = ref()
const statusId = ref()
const assigneeId = ref()
function createTask() {
  URL = "http://localhost:8080/api/task"
  axios.post(URL, {
    name:taskName.value,
    statusId: statusId.value,
    assigneeId:assigneeId.value
  }, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  }).then((response)=>{
    tasks.value.push(response.data)
  }).catch((error)=>{
  })

  isActive.value = false
  taskName.value = null
  statusId.value = null
  assigneeId.value = null
}



</script>
<template>
  <v-container class="container">
    <v-row no-gutters>
      <v-col cols="6">
        <v-sheet class="pa-2">Name</v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2">Status</v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2">Reporter</v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2">Assignee</v-sheet>
      </v-col>
    </v-row>
    <Task v-for="task in tasks" :task="task"></Task>
    <v-row class="create">
      <v-col>
            <v-sheet @click="isActive = true" class="pa-2 sheet">new task</v-sheet>
      </v-col>
    </v-row>
  </v-container>
 <v-overlay v-model="isActive" class="align-center justify-center">
        <v-card title="New Task" class="task_edit pa-20">
         <v-card-text>
                <v-text-field v-model="taskName" label="Task Name" variant="outlined" ></v-text-field>
                <v-select v-model="statusId" label="Status" :items="statuses" item-title="name" item-value="id" variant="outlined"></v-select>
                <v-select v-model="assigneeId" label="Assignee" :items="users" item-title="username" item-value="id" variant="outlined"></v-select>
              </v-card-text>

              <v-card-actions>
                <v-btn text="Close" @click="isActive = false"></v-btn>
                <v-spacer></v-spacer>
                <v-btn text="Create" @click="createTask()"></v-btn>
              </v-card-actions>
        </v-card>
    </v-overlay>

</template>
<style scoped>
.container {
  width: 1000px;
  border: 1px solid grey;
  border-radius: 5px;
}

.create:hover .sheet {
  cursor: pointer;
  background-color: antiquewhite;
}
.task_edit {
    width:500px;
}
</style>