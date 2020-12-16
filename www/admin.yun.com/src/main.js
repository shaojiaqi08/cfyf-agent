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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
