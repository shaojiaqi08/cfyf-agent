import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './utils/directives';
import Element from 'element-ui';
import VueClipboard from 'vue-clipboard2'
import './element-variables.scss';
// import './assets/scss/iconfont/iconfont.css'
import './assets/scss/index.scss';
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable)
if (process.env.NODE_ENV === 'development') {
  Vue.config.productionTip = true;
}

Vue.use(Element, {size: 'medium', zIndex: 3000});
Vue.use(VueClipboard)

// 全局判断权限方法
Vue.prototype.$checkAuth = function(data) {
  const permissions = this.$store.state.users.userInfo.permissions
  if (!permissions) return false
  // 已读取过的权限
  const reads = this.$store.state.users.readPermission
  if (data in reads) return reads[data]
  let res = false
  if (typeof data === 'string') {
    res =  permissions.includes(data)
  } else if (Array.isArray(data) && data.length > 0 ) {
    res = !!~data.findIndex(i => permissions.includes(i))
  }
  this.$store.dispatch('users/setReadPermission', { key: data, value: res})
  return res
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
