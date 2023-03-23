import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import functions from '@/scripts/functions.js'
Vue.use(functions)

// import defaultUI from '@/css/default.scss'
// import waatUI from '@/css/waat.scss'
// Vue.use(defaultUI)
// Vue.use(waatUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
