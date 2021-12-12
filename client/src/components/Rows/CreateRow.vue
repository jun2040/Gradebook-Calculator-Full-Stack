<template>
  <tr v-if="isCreating" class="create_row">
    <td v-for="header in headers">
      <Input
        :data="header"
        :vuelidate="v"
        v-model="fields[header.id]"
      />
    </td>
    <td class="btn2">
      <button @click="create()" :disabled="isLoading" class="confirm_create">Create</button>
      <button @click="toggle" class="cancel_create">Cancel</button>
    </td>
  </tr>
  <tr v-if="!isCreating">
    <td :colspan="headers.length + 1">
      <button @click="toggle">Create</button>
    </td>
  </tr>
</template>

<script>
import { ref, computed } from '@vue/reactivity'

import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import Input from '../Inputs/Input.vue'

import axios from 'axios'

import { authHeader } from '../../utilities/authHeader'

export default {
  name: 'CreateRow',
  components: {
    Input
  },
  props: {
    headers: {
      type: Object,
      default: []
    },
    getRules: {
      type: Function,
      default: function(headers) {
        const rules = computed(() => {
          let config = {}

          for (const header of headers) {
            if (header.required) {
              config[header.id] = {
                required: helpers.withMessage(
                  header.name + ' is required',
                  required
                )
              }
            } else {
              config[header.id] = {}
            }
          }

          return config
        })

        return rules
      }
    },
    routes: {
      type: Object
    }
  },
  emits: [
    'fetch'
  ],
  setup(props, { emit }) {
    // Initialize variables
    const fields = ref({})
    const isCreating = ref(false)
    const isLoading = ref(false)

    // Initialize input fields
    for (const header of props.headers) {
      if (header.isEditable) {
        fields.value[header.id] = ''
      }
    }

    // Initialize Vuelidate
    const v = useVuelidate(props.getRules(props.headers), fields)

    // Toggle create
    function toggle() {
      isCreating.value = !isCreating.value

      v.value.$reset()

      for (const header of props.headers) {
        if (header.isEditable) {
          fields.value[header.id] = ''
        }
      }
    }

    // Create
    async function create() {
      isLoading.value = true
      console.log(fields)

      v.value.$validate()

      if (!v.value.$error) {
        console.log(props.routes.create)
        await axios.post(props.routes.create, fields.value, { headers: authHeader() })
          .then((res) => {
            toggle()
            emit('fetch')
          })
      }

      isLoading.value = false
    }

    return {
      // Variables
      fields,
      v,
      isCreating,
      isLoading,
      // Functions
      toggle,
      create
    }
  }
}
</script>

<style>

</style>