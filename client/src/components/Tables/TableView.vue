<template>
  <h2>{{ data.title }}</h2>
  <table>
    <thead>
      <th v-for="header in data.headers">{{ header.name }}</th>
    </thead>
    <tbody>
      <Row 
        :headers="data.headers" 
        v-for="content in data.contents" 
        :data="content"
        type="view"
      />
    </tbody>
  </table>
</template>

<script>
import Row from '../Rows/Row.vue'

export default {
  name: 'TableView',
  props: {
    data: {
      type: Object
    }
  },
  components: {
    Row
  },
  setup(props) {
    //
  }
}
</script>

<style>

</style>