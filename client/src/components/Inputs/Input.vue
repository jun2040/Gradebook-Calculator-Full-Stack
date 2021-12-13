<template>
  <div v-if="data.isEditable">
    <input
      :type="data.type"
      :placeholder="data.name"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <p v-if="vuelidate[data.id].$error && data.required" class="error">{{ vuelidate[data.id].$errors[0].$message }}</p>
    <p v-if="vuelidate[data.id].$error && data.id === 'grade'" class="error">{{ vuelidate[data.id].$errors[0].$message }}</p>
  </div>
  <div v-if="!data.isEditable">
    <p>{{ def[data.id] }}</p>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'

export default {
  name: 'Input',
  props: {
    def: {
      type: Object,
      default: {}
    },
    data: {
      type: Object
    },
    vuelidate: {},
    modelValue: {}
  },
  setup(props) {
    //
  }
}
</script>

<style>

</style>