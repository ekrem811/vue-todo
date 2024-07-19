<script setup>
import { ref, watch, defineProps, registerRuntimeCompiler } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const props = defineProps(['task'])
const reactiveTask = ref(props.task)
const overlay = ref(false);
const statuses = ref([]);
const authToken = localStorage.getItem("token")
const users = ref([]);
const emit = defineEmits(['delete'])
const router = useRouter()
function deepCopy(task) {
    return {
        name: task.name,
        statusId: task.status ? task.status.id : null,
        assigneeId: task.assignee ? task.assignee.id : null,
    }
}

const taskCopy = ref()
watch(reactiveTask, () => {
    taskCopy.value = deepCopy(reactiveTask.value)
})
watch(overlay, () => {
    loadStatuses(statuses)
    loadUsers(users)

    taskCopy.value = deepCopy(reactiveTask.value)
})

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

const editError = ref(false)
function deleteTask() {
    URL = "http://localhost:8080/api/task" + "/" + reactiveTask.value.id
    axios.delete(URL, { headers: { Authorization: "Bearer " + authToken } }).then((response) => {
        reactiveTask.value = response.data
        overlay.value = !overlay.value
        emit("delete")
    }).catch((error) => {
        editError.value = error.response.data
    })
}
function updateTask() {
    URL = "http://localhost:8080/api/task" + "/" + reactiveTask.value.id
    axios.put(URL, {
        name: taskCopy.value.name,
        statusId: taskCopy.value.statusId,
        assigneeId: taskCopy.value.assigneeId
    }, { headers: { Authorization: "Bearer " + authToken } }).then((response) => {
        reactiveTask.value = response.data
        overlay.value = !overlay.value
    }).catch((error) => {
        editError.value = error.response.data
    })
}
</script>
<template>
    <v-row no-gutters class="task" @click="overlay = !overlay">
        <v-col cols="6">
            <v-sheet class="pa-2 sheet">{{ reactiveTask.name }}</v-sheet>
        </v-col>
        <v-col>
            <v-sheet class="pa-2 sheet">{{ reactiveTask.status ? reactiveTask.status.name : '' }}</v-sheet>
        </v-col>
        <v-col>
            <v-sheet class="pa-2 sheet">{{ reactiveTask.reporter ? reactiveTask.reporter.username : '' }}</v-sheet>
        </v-col>
        <v-col>
            <v-sheet class="pa-2 sheet">{{ reactiveTask.assignee ? reactiveTask.assignee.username : '' }}</v-sheet>
        </v-col>
    </v-row>
    <v-overlay v-model="overlay" class="align-center justify-center">
        <v-card title="Edit Task" class="task_edit pa-20">
            <v-card-text>
                <v-text-field v-model="taskCopy.name" label="Task Name" variant="outlined"></v-text-field>
                <v-select clearable v-model="taskCopy.statusId" label="Status" :items="statuses" item-title="name"
                    item-value="id" variant="outlined"></v-select>
                <v-select clearable v-model="taskCopy.assigneeId" label="Assignee" :items="users" item-title="username"
                    item-value="id" variant="outlined"></v-select>
            </v-card-text>

            <v-card-text v-if="editError">{{ editError }}</v-card-text>
            <v-card-actions>
                <v-btn text="Close" @click="overlay = false"></v-btn>
                <v-spacer></v-spacer>
                <v-btn text="Delete" @click="deleteTask()"></v-btn>
                <v-btn text="Update" @click="updateTask()"></v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>

</template>
<style scoped>
.sheet {
    height: 100%;
}

.task:hover .sheet {
    cursor: pointer;
    background-color: antiquewhite;
}

.container {
    width: 100%;
    height: 100%;
}

.task_edit {
    width: 500px;
}
</style>