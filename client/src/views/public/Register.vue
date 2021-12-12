<template>
  <h1>Register</h1>
  <div class="center">
    <form @submit.prevent="submit">
      <div class="credential_input">
        <input type="text" placeholder="First Name" v-model="fields.first_name">
        <p class="error" v-if="v.first_name.$error">{{ v.first_name.$errors[0].$message }}</p>
      </div>
      <div class="credential_input">
        <input type="text" placeholder="Last Name" v-model="fields.last_name">
        <p class="error" v-if="v.last_name.$error">{{ v.last_name.$errors[0].$message }}</p>
      </div>
      <div class="credential_input">
        <input type="email" placeholder="Email" v-model="fields.email">
        <p class="error" v-if="v.email.$error">{{ v.email.$errors[0].$message }}</p>
      </div>
      <div class="credential_input">
        <select v-model="fields.role">
          <option value="" disabled selected>Role</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <p class="error" v-if="v.role.$error">{{ v.role.$errors[0].$message }}</p>
      </div>
      <div class="credential_input">
        <input type="password" placeholder="Password" v-model="fields.password">
        <p class="error" v-if="v.password.$error">{{ v.password.$errors[0].$message }}</p>
      </div>
      <div class="credential_input">
        <input type="password" placeholder="Confirm Password" v-model="fields.confirm">
        <p class="error" v-if="v.confirm.$error">{{ v.confirm.$errors[0].$message }}</p>
      </div>
      <p v-if="error">{{ error_msg }}</p>
      <button type="submit" :disabled="isLoading">Register</button>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </div>
</template>

<script>
import { ref, computed } from '@vue/reactivity'

import useVuelidate from '@vuelidate/core'
import { helpers, required, minLength, sameAs } from '@vuelidate/validators'

import axios from 'axios'

import router from '../../router'
import store from '../../store'

export default {
  name: 'Register',
  setup() {
    const error = ref(false)
    const error_msg = ref('')
    const isLoading = ref(false)
    const fields = ref({
      first_name: '',
      last_name: '',
      email: '',
      role: '',
      password: '',
      confirm: ''
    })

    const rules = computed(() => {
      return {
        first_name: {
          required: helpers.withMessage(
            'First name is required',
            required
          )
        },
        last_name: {
          required: helpers.withMessage(
            'Last name is required',
            required
          )
        },
        email: {
          required: helpers.withMessage(
            'Email is required',
            required
          )
        },
        role: {
          required: helpers.withMessage(
            'Role is required',
            required
          )
        },
        password: {
          required: helpers.withMessage(
            'Password is required',
            required
          ),
          minLength: helpers.withMessage(
            'Password needs to be at least 6 characters long',
            minLength(6)
          )
        },
        confirm: {
          required: helpers.withMessage(
            'Confirm password',
            required
          ),
          sameAs: helpers.withMessage(
            'Password must match',
            sameAs(fields.value.password)
          )
        }
      }
    })

    const v = useVuelidate(rules, fields)

    function submit() {
      isLoading.value = true

      v.value.$validate()

      if (!v.value.$error) {
        axios.post('/auth/register', fields.value)
          .then((res) => {
            store.dispatch('register')
            router.push('/login')
            console.log(store.state)
            console.log(res)
          })
          .catch((err) => {
            store.dispatch('register')
            error.value = true
            error_msg.value = err.response.data.message
            console.log(err)
          })
      }

      isLoading.value = false
    }

    return {
      isLoading,
      fields,
      v,
      error,
      error_msg,
      submit
    }
  }
}
</script>

<style scoped>

h1 {
  text-align: center;
}

.center {
  text-align: center;
}

input {
  width: 280px;
  margin: 10px;
  padding: 10px;
  text-align: left;
}

select {
  width: 300px;
  height: 30px;
  margin: 10px;
  padding: 5px;
  text-align: left;
}

button {
  width: 300px;
  height: 30px;
  border-radius: 10px;
  border: 0;
  margin: 10px;
}

</style>