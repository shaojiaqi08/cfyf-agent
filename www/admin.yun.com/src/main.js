import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './utils/directives';
import Element from 'element-ui';
import VueClipboard from 'vue-clipboard2'
import './element-variables.scss';
import './assets/scss/iconfont/iconfont.css'
import './assets/scss/index.scss';

if (process.env.NODE_ENV === 'development') {
  Vue.config.productionTip = true;
}

Vue.use(Element, {size: 'medium', zIndex: 3000});
Vue.use(VueClipboard)

// 全局判断权限方法
Vue.prototype.$checkAuth = function(data) {
  const permissions = this.$store.state.users.userInfo.permissions
  if (!permissions) return false
  if (typeof data === 'string') {
    return permissions.includes(data)
  }else if (Array.isArray(data) && data.length > 0 ) {
    return !!~data.findIndex(i => permissions.includes(i))
  }
  return false
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
