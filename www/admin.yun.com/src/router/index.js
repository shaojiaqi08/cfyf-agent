import Vue from "vue";
import VueRouter from "vue-router";
import routes from './routes'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'
import { getPermission } from '@/apis/modules'
import { cancelAllPending } from '../apis/cancel-token-helper'

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const { meta } = to
  document.title = meta.title + '-' + '创富云服' || '创富云服'
  const userInfo = store.state.users.userInfo
  cancelAllPending()
  if (!userInfo.token && to.name !== 'login' ) {
    return next('/login')
  }
  // 刷新和登录跳转时获取权限
  if (userInfo.token && (from.path === '/' || from.name === 'login')) {
    getPermission().then(res => {
      store.dispatch('users/updateUserInfo', {
        ...userInfo,
        permissions: res
      }).then(() => {
        if (meta.permission && !res.includes(meta.permission)) {
          next('/user-info')
        }
      })
    })
  }
  // 判断当前页面权限
  if (meta.permission && userInfo.permissions && !userInfo.permissions.includes(meta.permission)) {
    return next('/user-info')
  } else {
    Nprogress.start()
    setTimeout(next, 300)
  }
})

router.afterEach(() => {
  window.scrollTo(0, 0)
  Nprogress.done()
})

export default router;
