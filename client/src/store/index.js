import { createStore } from 'vuex'
import auth from '../utilities/auth'

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export default createStore({
  state: {
    initialState
  },
  mutations: {
    loginSuccess(state, payload) {
      state.initialState.status.loggedIn = true;
      state.initialState.user = payload;
    },
    loginFailure(state) {
      state.initialState.status.loggedIn = false;
      state.initialState.user = null;
    },
    logout(state) {
      state.initialState.status.loggedIn = false;
      state.initialState.user = null;
    },
    register(state) {
      state.initialState.status.loggedIn = false;
    }
  },
  actions: {
    loginSuccess({ commit }, user) {
      commit('loginSuccess', user)
    },
    loginFailure({ commit }) {
      commit('loginFailure')
    },
    logout({ commit }) {
      localStorage.removeItem('user')
      commit('logout')
    },
    register({ commit }) {
      commit('register')
    }
  },
  modules: {
  },
  getters: {
  }
})
