<template>
  <div class="center_wrapper">
    <h1>{{ data.name }} in {{ data.group }}</h1>
    <div class="profile">
      <p>Name: {{ data.name }}</p>
      <p>Email: {{ data.email }}</p>
      <p>Class: {{ data.group }}</p>
      <p>Average Percent: {{ data.percent_avg }}</p>
      <p>Average Letter: {{ data.letter_avg }}</p>
      <p>Assignmnets: {{ data.task_num }}</p>
    </div>
    <TableEdit :load="`/student/get/${route.params.group_id}/${route.params.student_id}`" @reload="loadProfile" />
  </div>
</template>

<script>
import TableEdit from '../components/Tables/TableEdit.vue'

import { useRoute } from 'vue-router'
import axios from 'axios'
import { authHeader } from '../utilities/authHeader'
import { ref } from '@vue/reactivity'

export default {
  name: 'Student',
  components: {
    TableEdit
  },
  setup() {
    const route = useRoute()
    const data = ref({})

    function loadProfile() {
      axios.get('/student/profile/' + route.params.group_id + '/' + route.params.student_id, { headers: authHeader() })
        .then((res) => {
          data.value = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }

    loadProfile()

    return {
      route,
      data,
      loadProfile
    }
  }
}
</script>

<style>

</style>