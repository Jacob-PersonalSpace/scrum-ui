import Vue from 'vue'
import iview from 'iview'
import 'iview/dist/styles/iview.css'

import App from './App.vue'
import router from './router/index'

Vue.config.productionTip = false

Vue.use(iview)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
