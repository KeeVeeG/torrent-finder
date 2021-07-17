import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store/store.js'
import localize from '@/filters/localize'

Vue.config.productionTip = false

Vue.filter('localize',localize)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
