<template>
  <tr v-if="!isEditing">
    <td v-for="header in headers" @click="redirect">{{ data[header.id] }}<span v-if="header.id === 'grade'">/{{data.max_grade}}</span></td>
    <td v-if="type === 'edit'">
      <button @click="toggleEdit">Edit</button>
    </td>
    <td v-if="type === 'add'">
      <button @click="remove" :disabled="isLoading">Remove</button>
    </td>
  </tr>
  <EditRow
    v-if="type === 'edit' && isEditing"
    :headers="headers"
    :data="data"
    @toggle="toggleEdit"
    @fetch="loadData()"
  />
</template>

<script>
import { ref } from '@vue/reactivity'

import EditRow from '../Rows/EditRow.vue'
import router from '../../router'
import axios from 'axios'
import { authHeader } from '../../utilities/authHeader'

export default {
  name: 'Row',
  components: {
    EditRow
  },
  props: {
    headers: {
      type: Object,
      default: []
    },
    data: {
      type: Object,
      default: []
    },
    type: {
      type: String,
      default: ''
    }
  },
  emits: [
    'fetch'
  ],
  setup(props, { emit }) {
    const isEditing = ref(false)
    const isLoading = ref(false)

    function toggleEdit() {
      isEditing.value = !isEditing.value
    }

    function redirect() {
      router.push(props.data.link)
    }

    function loadData() {
      emit('fetch')
    }

    async function remove() {
      isLoading.value = true

      await axios.put(props.data.routes.remove, {}, { headers: authHeader() })
        .then((res) => {
          emit('fetch')
        })
        .catch((err) => {
          console.log(err)
        })

      isLoading.value = false
    }

    return {
      isEditing,
      isLoading,
      toggleEdit,
      redirect,
      loadData,
      remove
    }
  }
}
</script>

<style>

</style>