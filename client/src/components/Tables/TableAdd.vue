<template>
  <h2>{{ data.title }}</h2>
  <AddRow :options="data.options" @fetch="reload" />
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
        type="add"
        @fetch="reload"
      />
    </tbody>
  </table>
</template>

<script>
import { ref } from '@vue/reactivity'
import axios from 'axios'

import Row from '../Rows/Row.vue'
import AddRow from '../Rows/AddRow.vue'

import { authHeader } from '../../utilities/authHeader'
import router from '../../router'

export default {
  name: 'TableAdd',
  components: {
    Row,
    AddRow
  },
  props: {
    load: {
      type: String,
    }
  },
  emits: [
    'reload'
  ],
  setup(props, { emit }) {
    const data = ref({})

    function loadData() {
      axios.get(props.load, { headers: authHeader() })
        .then((res) => {
          data.value = res.data
        })
        .catch((err) => {
          router.push('/404')
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