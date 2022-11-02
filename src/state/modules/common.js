const state = {
    current_lead_type: null,
};

const getters = {
    current_lead_type(state){
        return state.current_lead_type;
    }
}

const actions = {
    set_current_lead_type({commit}, value){
        commit('SET_CURRENT_LEAD_TYPE', value);
    }
}

const mutations = {
    SET_CURRENT_LEAD_TYPE(state, value){
        state.current_lead_type = value;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};