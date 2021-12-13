<template>
  <nav>
    <div class="left">
      <button @click="backward">&lt;</button>
      <button @click="forward">></button>
    </div>
    <div class="right">
      <button v-if="!store.state.initialState.status.loggedIn" @click="register">Register</button>
      <button v-if="!store.state.initialState.status.loggedIn" @click="login">Login</button>
      <button v-if="store.state.initialState.status.loggedIn" @click="logout">Logout</button>
    </div>
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

    function forward() {
      router.go(1)
    }

    function backward() {
      router.go(-1)
    }

    return {
      store,
      login,
      register,
      logout,
      forward,
      backward
    }
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  height: 40px;
  align-content: right;
  background: none;
}

.left button {
  width: 40px;
  height: 40px;
  float: left;
  background: white;
  border: 0;
}

.right button {
  width: 80px;
  height: 40px;
  float: right;
  background: white;
  border: 0;
}

button:hover {
  background: #7a7a7a;
}
</style>