<template>
  <div v-if="options && options.length !== 0">
    <select v-model="field.option">
      <option
        v-for="option in options"
        :value="option.routes.add"
      >
        {{ option.name }}
      </option>
    </select>
    <button @click="add" :disabled="isLoading" class="addButton">Add Value</button>
    <p v-if="v.option.$error">{{ v.option.$errors[0].$message }}</p>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'

import useVuelidate from "@vuelidate/core"
import { required, helpers } from "@vuelidate/validators"

import axios from 'axios'
import { authHeader } from '../../utilities/authHeader'

export default {
  name: 'AddRow',
  props: {
    options: {
      type: Object
    }
  },
  emits: [
    'fetch'
  ],
  setup(props, { emit }) {
    const isLoading = ref(false)
    const field = ref({
      option: null
    })

    const rules = computed(() => {
      return {
        option: {
          required: helpers.withMessage(
            'Choose an option',
            required
          )
        }
      }
    })

    const v = useVuelidate(rules, field)

    async function add() {
      isLoading.value = true

      v.value.$validate()

      if (!v.value.$error) {
        await axios.put(field.value.option, {}, { headers: authHeader() })
          .then((res) => {
            field.value.option = null
            v.value.$reset()
            emit('fetch')
          })
          .catch((err) => {
            router.push('/404')
            console.log(err)
          })
      }

      isLoading.value = false
    }

    return {
      field,
      v,
      isLoading,
      add
    }
  }
}
</script>

<style>

</style>