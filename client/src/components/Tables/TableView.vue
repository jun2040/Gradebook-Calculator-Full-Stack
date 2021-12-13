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
        type="a"
      />
    </tbody>
  </table>
</template>

<script>
import { ref } from '@vue/reactivity'
import axios from 'axios'

import { authHeader } from '../../utilities/authHeader'

import Row from '../Rows/Row.vue'

export default {
  name: 'TableView',
  props: {
    load: {
      type: String
    }
  },
  components: {
    Row
  },
  setup(props) {
    const data = ref({})

    function loadData() {
      axios.get(props.load, { headers: authHeader() })
        .then((res) => {
          data.value = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }
    
    loadData()

    function reload() {
      emit('reload')
      loadData()
    }

    return {
      data,
      loadData,
      reload
    }
  }
}
</script>

<style>

</style>