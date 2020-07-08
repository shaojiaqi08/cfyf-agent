// const getComponent = (name) => () => import(`@/components/${name}/index.vue`)
const getView = (name) => () => import(`@/views/${name}/index.vue`)

export default [
  {
    path: "/",
    name: "Home",
    meta: {
      title: 'home'
    },
    component: getView('home')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: getView('login')
  },
  {
    path: "/about",
    name: "About",
    meta: {
      title: 'about'
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: '/order',
    name: 'Order',
    meta: {
      title: '订单'
    },
    component: () => import('views/achievement/order')
  },
  {
    path: '/order/detail/:id',
    name: 'Order-Detail',
    meta: {
      title: '订单详情'
    },
    component: () => import('views/achievement/order/detail')
  },
  {
    path: '/rate',
    name: 'rate',
    meta: {
      title: '费率管理'
    },
    component: () => import('views/good-manage/rate')
  },
  {
    path: '/manager',
    name: 'Manager',
    meta: {
      title: '内部管理员'
    },
    component: () => import('views/user-manage/manager')
  },
  {
    // 样式规范
    path: "/design",
    name: "design",
    meta: {
      title: 'about'
    },
    component: () =>
        import(/* webpackChunkName: "about" */ "views/DesignSpec.vue")
  }
]