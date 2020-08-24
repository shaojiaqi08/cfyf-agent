import Vue from "vue";
import VueRouter from "vue-router";
import routes from './routes'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'
import { getPermission } from '@/apis/modules'

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
  new Promise(resolve => {
    // 刷新和登录跳转时获取权限
    if ((to.name !== 'login' && from.fullPath === '/') || from.name === 'login') {
      getPermission().then(res => {
        store.dispatch('users/updateUserInfo', {
          ...userInfo,
          permissions: res
        })
        resolve(res)
      })
    } else {
      resolve(userInfo.permissions)
    }
  }).then((permissions) => {
    // 判断页面权限防止手动输入访问
    if (meta.permission && !permissions.includes(meta.permission)) {
      return next('/user-info')
    } else {
      Nprogress.start()
      setTimeout(next, 300)
    }
  })
})

router.afterEach(() => {
  window.scrollTo(0, 0)
  Nprogress.done()
})

export default router;
