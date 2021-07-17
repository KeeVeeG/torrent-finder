import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store/store.js'
import localize from '@/filters/localize'
import autofocus from '@/directives/autofocus'

Vue.config.productionTip = false

Vue.filter('localize',localize)
Vue.directive('autofocus',autofocus)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
