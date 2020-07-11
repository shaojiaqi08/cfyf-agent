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
      title: '登录',
      header: false,
      menu: false
    },
    component: getView('login')
  },
  {
    path: '/user-info',
    name: 'userInfo',
    meta: {
      title: '个人信息',
      header: true,
      menu: true
    },
    component: getView('user-info')
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
      title: '订单',
      header: true,
      menu: true
    },
    component: () => import('@/views/achievement/order')
  },
  {
    path: '/order/detail/:id',
    name: 'Order-Detail',
    meta: {
      title: '订单详情',
      header: true,
      menu: false
    },
    component: () => import('@/views/achievement/order/detail')
  },
  {
    path: '/rate',
    name: 'rate',
    meta: {
      title: '费率管理',
      header: true,
      menu: true
    },
    component: () => import('@/views/good-manage/rate')
  },
  {
    path: '/shelves',
    name: 'Shelves',
    meta: {
      title: '商品上下架',
      header: true,
      menu: true
    },
    component: () => import('@/views/good-manage/shelves')
  },
  {
    path: '/company',
    name: 'Company',
    meta: {
      title: 'B端公司',
      header: true,
      menu: true
    },
    component: () => import('views/user-manage/b-client-company')
  },
  {
    path: '/company/edit/:id',
    name: 'Company-Edit',
    meta: {
      title: '修改公司信息'
    },
    component: () => import('views/user-manage/b-client-company/edit')
  },
  {
    path: '/company/add',
    name: 'Company-Add',
    meta: {
      title: '新增B端公司'
    },
    component: () => import('views/user-manage/b-client-company/edit')
  },
  {
    path: '/manager',
    name: 'Manager',
    meta: {
      title: '内部管理员',
      header: true,
      menu: true
    },
    component: () => import('@/views/user-manage/manager')
  },
  {
    // 样式规范
    path: "/design",
    name: "design",
    meta: {
      title: 'about',
      header: true,
      menu: true
    },
    component: () =>
        import(/* webpackChunkName: "about" */ "@/views/DesignSpec.vue")
  }
]