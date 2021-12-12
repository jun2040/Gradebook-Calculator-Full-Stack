<template>
  <div class="center_wrapper">
    <h1>Dashboard</h1>
    <TableCreate load="/users/get" />
  </div>
</template>

<script>
// Import Vue tools

// Import components
import TableCreate from '../components/Tables/TableCreate.vue'

export default {
  name: 'Dashboard',
  components: {
    TableCreate
  },
  setup() {
    //
  }
}
</script>

<style>

</style>