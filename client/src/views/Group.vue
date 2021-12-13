<template>
  <div class="center_wrapper">
    <h1>Class</h1>
    <div class="profile">
      <p>Name: {{ data.name }}</p>
      <p>Block: {{ data.block }}</p>
      <p v-if="data.start_time">Start Time: {{ data.start_time }}</p>
      <p v-if="data.end_time">End Time: {{ data.end_time }}</p>
      <p v-if="data.student_num">Students: {{ data.student_num }}</p>
      <p>Assignments: {{ data.task_num }}</p>
    </div>
    <TableAdd v-if="store.state.initialState.user.role === 'teacher'" :load="'/group/get_students/' + route.params.group_id" :key="students_key" @reload="reloadTasks" />
    <TableCreate v-if="store.state.initialState.user.role === 'teacher'" :load="'/group/get_tasks/' + route.params.group_id" :key="tasks_key" @reload="reloadStudents" />
    <TableView v-if="store.state.initialState.user.role === 'student'" :load="'/group/get_tasks_student/' + route.params.group_id" />
  </div>
</template>

<script>
import TableAdd from '../components/Tables/TableAdd.vue'
import TableCreate from '../components/Tables/TableCreate.vue'
import TableView from '../components/Tables/TableView.vue'

import { ref } from '@vue/reactivity'
import store from '../store/index'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { authHeader } from '../utilities/authHeader'

export default {
  name: 'Group',
  components: {
    TableAdd,
    TableCreate,
    TableView
  },
  setup() {
    const data = ref({})
    const route = useRoute()
    const tasks_key = ref(0)
    const students_key = ref(0)

    function loadProfile() {
      if (store.state.initialState.user.role === 'teacher') {
        axios.get('/group/profile/' + route.params.group_id, { headers: authHeader() })
          .then((res) => {
            data.value = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (store.state.initialState.user.role === 'student') {
        axios.get('/group/profile_student/' + route.params.group_id, { headers: authHeader() })
          .then((res) => {
            data.value = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }

    loadProfile()

    function reloadTasks() {
      tasks_key.value += 1
      loadProfile()
    }

    function reloadStudents() {
      students_key.value += 1
      loadProfile()
    }

    return {
      data,
      students_key,
      tasks_key,
      route,
      store,
      reloadStudents,
      reloadTasks,
      loadProfile
    }
  }
}
</script>

<style>

</style>