// const getComponent = (name) => () => import(`@/components/${name}/index.vue`)
const getView = (name) => () => import(`@/views/${name}/index.vue`)

export const routers = [
  {
    label: '业绩',
    icon: 'iconcebiandaohang20_yeji1',
    children: [
      {
        path: '/achievement-company',
        name: 'achievement-company',
        meta: {
          title: '公司业绩',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('achievement/company')
      },
      {
        path: '/achievement-company/detail/:id',
        name: 'achievement-company-detail',
        meta: {
          title: '公司业绩详情',
          header: true,
          menu: false,
          show: false,
          permission: 'a'
        },
        component: getView('achievement/order/detail')
      },
      {
        path: '/achievement-team',
        name: 'achievement-team',
        meta: {
          title: '团队业绩',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('achievement/team')
      },
      {
        path: '/achievement-team/detail/:id',
        name: 'achievement-team-detail',
        meta: {
          title: '团队业绩详情',
          header: true,
          menu: false,
          show: false,
          permission: 'a'
        },
        component: getView('achievement/team/detail')
      },
      {
        path: '/achievement-self',
        name: 'achievement-self',
        meta: {
          title: '我的业绩',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('achievement/self')
      },
      {
        path: '/achievement-self/detail/:id',
        name: 'achievement-self-detail',
        meta: {
          title: '我的业绩详情',
          header: true,
          menu: false,
          show: false,
          permission: 'a'
        },
        component: getView('achievement/self/detail')
      }
    ]
  },
  {
    label: '商品管理',
    icon: 'iconcebiandaohang20_shangpin',
    children: [
      {
        path: '/insure-goods',
        name: 'insure-goods',
        meta: {
          title: '保险商品',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: getView('good-manage/insure-goods')
      },
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
      }
    ]
  },
  {
    label: '助销工具',
    icon: 'iconcebiandaohang20_zhuxiaogongju',
    children: [
      {
        path: '/proposal',
        name: 'Proposal',
        meta: {
          title: '计划书',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: () => import('views/merchandising/proposal')
      },
      {
        path: '/proposal/proposal-operate',
        name: 'Proposal-operate',
        meta: {
          title: '计划书编辑',
          show: false,
          permission: 'a'
        },
        component: () => import('views/merchandising/proposal/proposal-operate')
      },
      {
        path: '/underwrite-health-notice',
        name: 'Underwrite-health-notice',
        meta: {
          title: '核保健告',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: () => import('views/merchandising/underwrite-health-notice')
      },
      {
        path: '/interactive-logs',
        name: 'Interactive-logs',
        meta: {
          title: '互动记录',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: () => import('views/merchandising/interactive-logs')
      }
    ]
  },
  {
    label: '用户管理',
    icon: 'iconcebiandaohang20_yonghuguanli',
    children: [
      {
        path: '/sale',
        name: 'Sale',
        meta: {
          title: '销售',
          header: true,
          menu: true,
          show: true,
          permission: 'a'
        },
        component: () => import('views/user-manage/saler')
      },
      {
        path: '/manager',
        name: 'manager',
        meta: {
          title: '管理员',
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
    path: '/',
    name: 'Home',
    redirect: '/user-info'
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
    path: "/404",
    name: "404",
    meta: {
      title: '404'
    },
    component: getView('404')
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
  },
  {
    path: '*',
    redirect: '/404'
  }
]


export default routers.reduce((prev, curr) => {
  return prev.concat(curr.children)
}, []).concat(necessaryRoutes)