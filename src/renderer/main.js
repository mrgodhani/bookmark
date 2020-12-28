import Vue from 'vue'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import axios from 'axios'

import App from './App'
import store from './store'
import Register from './components/registerComponents'
import Database from './db'
const db = new Database().db

Vue.use(Vuetify)
Vue.use(VueFire)
Register.registerComponents()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$db = db
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
