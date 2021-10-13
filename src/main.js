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

//  引入富文本插件 VueQuillEditor
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false
// 注册为全局组件
Vue.component('table-tree', TableTree)
Vue.use(VueQuillEditor)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
