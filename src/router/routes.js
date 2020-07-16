// const getComponent = (name) => () => import(`@/components/${name}/index.vue`)
const getView = (name) => () => import(`@/views/${name}/index.vue`)

export const routers = [
  { 
    label: '业绩',
    icon: 'iconcebiandaohang20_yeji',
    children: [
      {
        path: '/order',
        name: 'order',
        meta: {
          title: '订单',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('achievement/order')
      },
      {
        path: '/order/detail/:id',
        name: 'order-detail',
        meta: {
          title: '订单详情',
          header: true,
          menu: false,
          show: false,
          permission: 'a'
        },
        component: getView('achievement/order/detail')
      }
    ]
  },
  {
    label: '商品管理',
    icon: 'iconcebiandaohang20_shangpin',
    children: [
      {
        path: '/rate',
        name: 'rate',
        meta: {
          title: '费率管理',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('good-manage/rate')
      },
      {
        path: '/shelves',
        name: 'shelves',
        meta: {
          title: '商品上下架',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('good-manage/shelves')
      }
    ]
  },
  {
    label: '用户管理',
    icon: 'iconcebiandaohang20_yonghuguanli',
    children: [
      {
        path: '/company',
        name: 'company',
        meta: {
          title: 'B端公司',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('user-manage/b-client-company')
      },
      {
        path: '/manager',
        name: 'manager',
        meta: {
          title: '内部管理员',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('user-manage/manager')
      }
    ]
  }
]

const necessaryRoutes = [
  // TODO 404 403 ...
  {
    path: "/",
    name: "Home",
    meta: {
      title: 'home'
    },
    component: getView('home')
  },
  {
    path: '/user-info',
    name: 'userInfo',
    meta: {
      title: '用户设置',
      header: true,
      menu: true
    },
    component: getView('user-info')
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
    // 样式规范
    path: "/design",
    name: "design",
    meta: {
      title: 'about',
      header: false,
      menu: false
    },
    component: () =>
        import("@/views/DesignSpec.vue")
  }
]


export default routers.reduce((prev, curr) => {
  return prev.concat(curr.children)
}, []).concat(necessaryRoutes)
