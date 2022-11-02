import { createStore } from 'vuex'
import auth from './modules/auth'
import common from './modules/common'

const store = createStore({
    
    modules:{
        auth:auth,
        common: common,
    }
})

export default store

