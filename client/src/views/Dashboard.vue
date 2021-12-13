<template>
  <div class="center_wrapper">
    <h1>Dashboard</h1>
    <div class="profile">
      <p>Name: {{ data.name }}</p>
      <p>Email: {{ data.email }}</p>
      <p>Classes: {{ data.class_num }}</p>
    </div>
    <TableCreate load="/users/get" v-if="store.state.initialState.user.role === 'teacher'" @reload="loadProfile" />
    <TableView load="/users/get_student" v-else-if="store.state.initialState.user.role === 'student'" />
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import axios from 'axios'
import store from '../store/index'

import TableCreate from '../components/Tables/TableCreate.vue'
import TableView from '../components/Tables/TableView.vue'

import { authHeader } from '../utilities/authHeader'

export default {
  name: 'Dashboard',
  components: {
    TableCreate,
    TableView
  },
  setup() {
    const data = ref({})

    function loadProfile() {
      axios.get('/users/profile', { headers: authHeader() })
        .then((res) => {
          data.value = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }

    loadProfile()

    return {
      store,
      data,
      loadProfile
    }
  }
}
</script>

<style>

</style>