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
  document.title = to.meta.title + '-' + '创富云服' || '创富云服'
  const userInfo = store.state.users.userInfo
  if (!userInfo.token && to.name !== 'login' ) {
    return next('/login')
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
