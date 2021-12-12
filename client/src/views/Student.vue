<template>
  <div class="center_wrapper">
    <h1>Student Grades</h1>
    <TableEdit :load="`/student/get/${route.params.group_id}/${route.params.student_id}`" />
  </div>
</template>

<script>
import TableEdit from '../components/Tables/TableEdit.vue'

import { useRoute } from 'vue-router'

export default {
  name: 'Student',
  components: {
    TableEdit
  },
  setup() {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>

<style>

</style>