<template>
  <div class="center_wrapper">
    <h1>Group</h1>
    <TableAdd :load="'/group/get_students/' + route.params.group_id" />
    <TableCreate :load="'/group/get_tasks/' + route.params.group_id" />
  </div>
</template>

<script>
import TableAdd from '../components/Tables/TableAdd.vue'
import TableCreate from '../components/Tables/TableCreate.vue'

import { ref } from '@vue/reactivity'
import { useRoute } from 'vue-router'

export default {
  name: 'Group',
  components: {
    TableAdd,
    TableCreate
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