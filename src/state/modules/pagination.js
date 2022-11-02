import axios from 'axios';

const state = {
    pagination_url: null,
    showEntries: [10, 25, 50, 75, 100],
    currentEntry: 10,
    havePagination: 0,
    showing: {
        form: null,
        to: null,
        total: null,
    },
    entries: [],
    currentPage: 1,
    lastPage: 1,
    keyword: '',
    sortField: '',
    sortOrder: '',
};
const getters = {
    current_page(state){
        return state.currentPage
    },
    last_page(state){
        return state.lastPage
    },
    current_entry(state){
        return state.currentEntry;
    },
    keyword(state){
        return state.keyword;
    },
    have_pagination(state){
        return state.havePagination;
    },
    showing_from(state){
        return state.showing.form;
    },
    showing_to(state){
        return state.showing.to;
    },
    showing_total(state){
        return state.showing.total;
    },
    entries(state){
        return state.entries;
    }
};
const actions = {
    url({commit}, payload){
        commit('SET_PAGINATION_URL', payload);
    },
    paginateEntries(){
        commit('SET_CURRENT_PAGE', 1);
    },
    search(){
        commit('SET_CURRENT_PAGE', 1);
    },
    paginate({commit}, payload){
        commit('SET_CURRENT_PAGE', payload);
    },
    next({commit, getters }){
        if(getters.current_page != getters.last_page){
            commit('SET_CURRENT_PAGE', getters.current_page+1);
        }
    },
    prev({commit, getters }){
        if(getters.current_page > 1){
            commit('SET_CURRENT_PAGE', getters.current_page-1);
        }
    },
    sort({commit, getters }, payload){
        commit('SET_SORT_FIELD', payload.field);
        commit('SET_SORT_ORDER', payload.order);
    },
    fetchData({commit, getters }){
        let get_url;
        if(getters.pagination_url.indexOf('?') === -1)
            get_url = getters.pagination_urll+"?page="+getters.currentPage+"&limit="+getters.currentEntry
        else
            get_url = this.url+"&page="+getters.currentPage+"&limit="+getters.currentEntry
        
        if(getters.keyword != '')
            get_url = get_url+'&search='+getters.keyword;
        if(this.sortField != '' && this.sortOrder != '')
            get_url = get_url+'&sort_field='+getters.sortField+'&sort_order='+getters.sortOrder;

        axios.get(get_url)
         .then((result) => {
            let data = result.data.data;
            commit('SET_CURRENT_PAGE', data.current_page);
            commit('SET_LAST_PAGE', data.last_page);
            if(data.last_page>1)
                commit('SET_HAVE_PAGINATION', 1);
            else
                commit('SET_HAVE_PAGINATION', 0);
            if(data.total>0)
            {
                commit('SET_SHOWING_FROM', data.from);
                commit('SET_SHOWING_TO', data.to);
                commit('SET_SHOWING_TOTAL', data.total);
            }
            commit('SET_ENTRIES', data.data);
         });   
    },
};
const mutations = {
    SET_PAGINATION_URL(state, value){
        state.pagination_url = value;
    },
    SET_CURRENT_PAGE(state, value){
        state.currentPage = value;
    },
    SET_LAST_PAGE(state, value){
        state.lastPage = value;
    },
    SET_SORT_FIELD(state, value){
        state.sortField = value;
    },
    SET_SORT_ORDER(state, value){
        state.sortOrder = value;
    },
    SET_CURRENT_ENTRY(state, value){
        state.currentEntry = value;
    },
    SET_KEYWORD(state, value){
        state.keyword = value;
    },
    SET_HAVE_PAGINATION(state, value){
        state.havePagination = value;
    },
    SET_SHOWING_FROM(state, value){
        state.showing.form = value;
    },
    SET_SHOWING_TO(state, value){
        state.showing.to = value;
    },
    SET_SHOWING_TOTAL(state, value){
        state.showing.total = value;
    },
    SET_ENTRIES(state, value){
        state.entries = value;
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
