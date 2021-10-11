import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import './assets/css/global.css'
// 引入elementUI
import './plugins/elementui.js'
//  引入插件
import TableTree from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
// 注册为全局组件
Vue.component('table-tree', TableTree)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
