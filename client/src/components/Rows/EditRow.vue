<template>
  <tr>
    <td v-for="header in headers">
      <Input
        :def="data"
        :data="header"
        :vuelidate="v"
        v-model="fields[header.id]"
      />
    </td>
    <td class="btn3">
      <button @click="edit(fields)" :disabled="isLoading" class="save">Save</button>
      <button @click="del" class="delete">Delete</button>
      <button @click="toggle" class="cancel">Cancel</button>
    </td>
  </tr>
</template>

<script>
import { ref, computed } from '@vue/reactivity'
import axios from 'axios'

import useVuelidate from "@vuelidate/core";
import { required, helpers, maxValue } from "@vuelidate/validators";

import Input from '../Inputs/Input.vue'
import { authHeader } from '../../utilities/authHeader';

export default {
  name: 'EditRow',
  components: {
    Input
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
    getRules: {
      type: Function,
      default: function(headers, data) {
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

            if (header.id === 'grade') {
              config[header.id] = {
                required: helpers.withMessage(
                  header.name + 'is required',
                  required
                ),
                maxValue: helpers.withMessage(
                  'Grade cannot exceed ' + data.max_grade,
                  maxValue(data.max_grade)
                )
              }
            }
          }

          return config
        })

        return rules
      }
    }
  },
  emits: [
    'toggle',
    'fetch'
  ],
  setup(props, { emit }) {
    const fields = ref({})
    const isLoading = ref(false)

    for (const header of props.headers) {
      fields.value[header.id] = props.data[header.id]
    }

    const v = useVuelidate(props.getRules(props.headers, props.data), fields)

    function toggle() {
      emit('toggle')
    }

    async function edit(fields) {
      isLoading.value = true

      v.value.$validate()

      if (!v.value.$error) {
        await axios.put(props.data.routes.edit, fields, { headers: authHeader() })
          .then((res) => {
            toggle()
            emit('fetch')
          })
          .catch((err) => {
            console.log(err)
          })
      }

      isLoading.value = false
    }

    async function del() {
      isLoading.value = true

      await axios.delete(props.data.routes.delete, { headers: authHeader() })
        .then((res) => {
          toggle()
          emit('fetch')
        })
        .catch((err) => {
          console.log(err)
        })
      
      isLoading.value = false
    }

    return {
      fields,
      v,
      isLoading,
      toggle,
      edit,
      del
    }
  }
}
</script>

<style>

</style>