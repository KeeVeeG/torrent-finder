import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store/store.js'
import localize from '@/filters/localize'
import autofocus from '@/directives/autofocus'
import center from '@/directives/center'

Vue.config.productionTip = false

Vue.filter('localize', localize)
Vue.directive('autofocus', autofocus)
Vue.directive('center', center)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
