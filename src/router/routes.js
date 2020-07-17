// const getComponent = (name) => () => import(`@/components/${name}/index.vue`)
const getView = (name) => () => import(`@/views/${name}/index.vue`)

export default [
  {
    path: "/",
    name: "Home",
    meta: {
      title: 'home',
      header: true,
      menu: true
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
    path: '/sale',
    name: 'Sale',
    meta: {
      title: '用户管理-销售',
      header: true,
      menu: true
    },
    component: () => import('views/user-manage/saler')
  },
  {
    path: '/proposal',
    name: 'Proposal',
    meta: {
      title: '计划书',
      header: true,
      menu: true
    },
    component: () => import('views/merchandising/proposal')
  },
  {
    path: '/proposal/proposal-operate',
    name: 'Proposal-operate',
    meta: {
      title: '计划书编辑',
    },
    component: () => import('views/merchandising/proposal/proposal-operate')
  },
  {
    path: '/underwrite-health-notice',
    name: 'Underwrite-health-notice',
    meta: {
      title: '核保健告',
      header: true,
      menu: true
    },
    component: () => import('views/merchandising/underwrite-health-notice')
  },
  {
    path: '/product-compare',
    name: 'Product-compare',
    meta: {
      title: '产品对比',
      header: true,
      menu: true
    },
    component: () => import('views/merchandising/product-compare')
  },
  {
    path: '/product-compare-lab',
    name: 'Product-compare-lab',
    meta: {
      title: '产品对比',
      header: true,
      menu: true
    },
    component: () => import('views/merchandising/product-compare/product-compare-lab')
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