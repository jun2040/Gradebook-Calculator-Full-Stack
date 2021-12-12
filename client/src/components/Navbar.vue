<template>
  <nav>
    <button v-if="!store.state.initialState.status.loggedIn" @click="register">Register</button>
    <button v-if="!store.state.initialState.status.loggedIn" @click="login">Login</button>
    <button v-if="store.state.initialState.status.loggedIn" @click="logout">Logout</button>
  </nav>
</template>

<script>
import router from '../router'
import store from '../store'

export default {
  name: 'Navbar',
  setup() {
    function login() {
      router.push('/login')
    }

    function register() {
      router.push('/register')
    }

    function logout() {
      store.dispatch('logout')
      router.push('/login')
    }

    return {
      store,
      login,
      register,
      logout
    }
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  height: 40px;
  align-content: right;
  background: gray;
}

button {
  width: 80px;
  height: 40px;
  float: right;
  background: white;
  border: 0;
}
</style>