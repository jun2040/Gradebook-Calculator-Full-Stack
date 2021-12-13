<template>
  <h1>Login</h1>
  <div class="center">
    <form @submit.prevent="submit(fields)">
      <div class="credential_input">
        <input type="email" placeholder="Email" v-model="fields.email">
        <p class="error" v-if="v.email.$error">{{ v.email.$errors[0].$message }}</p>
      </div>
      <div class="credential_input">
        <input type="password" placeholder="Password" v-model="fields.password">
        <p class="error" v-if="v.password.$error">{{ v.password.$errors[0].$message }}</p>
      </div>
      <p class="error" v-if="error">{{ error_msg }}</p>
      <button type="submit">Login</button>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'

import useVuelidate from '@vuelidate/core'
import { helpers, required, minLength } from '@vuelidate/validators'

import { authHeader } from '../../utilities/auth'

import router from '../../router'
import store from '../../store'
import axios from 'axios'

export default {
  name: 'Login',
  setup() {
    const isLoading = ref(false)
    const error = ref(false)
    const error_msg = ref('')

    const fields = ref({
      email: '',
      password: ''
    })

    const rules = computed(() => {
      return {
        email: {
          required: helpers.withMessage(
            'Email is required',
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
        }
      }
    })

    const v = useVuelidate(rules, fields)

    function submit(fields) {
      isLoading.value = true

      v.value.$validate()

      if (!v.value.$error) {
        axios.post('/auth/login', fields)
          .then((res) => {
            console.log(res.data)
            if (res.data.accessToken) {
              localStorage.setItem('user', JSON.stringify(res.data))
              store.dispatch('loginSuccess', res.data)
              router.push('/dashboard')
            }
          })
          .catch((err) => {
            store.dispatch('loginFailure')
            console.log(err)
            error.value = true
            error_msg.value = err.response.data.message
          })
      }
    }

    if (store.state.initialState.status.loggedIn) {
      router.push('/dashboard')
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