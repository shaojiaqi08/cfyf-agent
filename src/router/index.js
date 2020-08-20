import Vue from "vue";
import VueRouter from "vue-router";
import routes from './routes'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const { meta } = to
  document.title = meta.title + '-' + '创富云服' || '创富云服'
  const userInfo = store.state.users.userInfo
  if (!userInfo.token && to.name !== 'login' ) {
    return next('/login')
  }
  // 判断页面权限防止手动输入访问
  if (meta.permission && !userInfo.permissions.includes(meta.permission)) {
    return next('/user-info')
  }
  Nprogress.start()
  setTimeout(next, 300)
  // next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
  Nprogress.done()
})

export default router;
