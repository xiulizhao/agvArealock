import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  selectedItem: null,
   num:999
  },
  getters: {
  
  },
  mutations: {
    // getDatas (state, value) {
		// 	// 同步修改state值代码
    //   console.log('home传过来的value', value)
    //   state.datajson = value
    //   console.log(state.datajson);
		// }
    setSelectedItem(state, value) {
      state.selectedItem = value;
      console.log(state.selectedItem);
    },
  },
  actions: {
    setSelectedItem(context, value) {
      context.selectedItem = value;
    }
  },
  modules: {
  }
  
})
