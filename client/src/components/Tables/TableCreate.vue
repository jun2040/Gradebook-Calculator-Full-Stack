<template>
  <h2>{{ data.title }}</h2>
  <table>
    <thead>
      <th v-for="header in data.headers">{{ header.name }}</th>
      <th>Manage</th>
    </thead>
    <tbody>
      <Row 
        :headers="data.headers" 
        v-for="content in data.contents" 
        :data="content"
        type="edit"
        @fetch="loadData"
      />
      <CreateRow
        v-if="data.headers"
        :headers="data.headers"
        :routes="data.routes"
        @fetch="loadData"
      />
    </tbody>
  </table>
</template>

<script>
import { ref } from '@vue/reactivity'
import axios from 'axios'

import Row from '../Rows/Row.vue'
import CreateRow from '../Rows/CreateRow.vue'

import router from '../../router'
import { authHeader } from '../../utilities/authHeader'

export default {
  name: 'TableCreate',
  props: {
    load: {
      type: String,
      default: '/users/get'
    }
  },
  components: {
    Row,
    CreateRow
  },
  setup(props, { emit }) {
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

    return {
      data,
      loadData
    }
  }
}
</script>

<style>

</style>