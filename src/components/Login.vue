<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const password = ref('');
const loginState = ref(true)
const warning = ref();
const router = useRouter();

watch(loginState, ()=>{
  username.value=''
  password.value=''
  warning.value=''
})
const login = () => {
    const URL = "http://localhost:8080/api/auth"
    if (loginState.value) {
        axios.post(URL + "/authenticate", {
          username: username.value,
          password:password.value
        }).then((response) => {
          if (response.status == 403) {
            warning.value = "Username or Password is wrong"
          } else if(response.status == 200 && response.data.token) {
            localStorage.setItem("token", response.data.token)
            router.push("/tasks")
          }
        }).catch((response)=>{
            warning.value = "Username or Password is wrong"
        })
    } else {

        axios.post(URL + "/registration", {
          username: username.value,
          password:password.value
        }).then((response) => {
          if (response.status == 400) {
            warning.value = response.data
          } else if(response.status == 200 && response.data.token) {
            localStorage.setItem("token", response.data.token)
            router.push("/tasks")
          }
        }).catch(()=>{
        })
    }
};
</script>
<template>
  <v-container class="fill-height d-flex align-center justify-center" style="background-image: url('https://source.unsplash.com/1600x900/?food'); background-size: cover;">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center"> {{ loginState ? "Login" : "Create an account" }} </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="Username"
            required
            type="username"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            required
            type="password"
            variant="outlined"
          ></v-text-field>
          <v-card-subtitle v-if="warning" color="error">
            {{ warning }}
          </v-card-subtitle>
          <v-btn type="submit" color="primary" block>{{ loginState ? "login" : "create"}}</v-btn>
        </v-form>
      </v-card-text>
      <v-card-subtitle class="subtitle" @click="()=>loginState = !loginState">
        {{  
            loginState ? "create a new account" : "already have an account?"

        }}
      </v-card-subtitle>
    </v-card>
  </v-container>
</template>


<style scoped>
.v-container {
  height: 100vh;
  padding: 0;
}
.v-card-title {
  font-size: 24px;
  font-weight: bold;
}
.subtitle{
    text-decoration: underline
}
.subtitle:hover {
    cursor: pointer
}
</style>
