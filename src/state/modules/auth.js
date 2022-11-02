import axios from 'axios';
import router from '../../router'

const state = {
    authenticated:false,
    user:{}
};
const getters = {
    authenticated(state){
        return state.authenticated
    },
    user(state){
        return state.user
    }
};
const actions = {
    login({commit}, payload){
        commit('SET_USER', payload)
        commit('SET_AUTHENTICATED', true)
        router.push({name:'manufactures'})
    },
    logout({commit}){
        commit('SET_USER',{})
        commit('SET_AUTHENTICATED',false)
    }
};
const mutations = {
    SET_AUTHENTICATED (state, value) {
        state.authenticated = value
    },
    SET_USER (state, value) {
        state.user = value
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
