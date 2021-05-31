// const getComponent = (name) => () => import(`@/components/${name}/index.vue`)
const getView = (name) => () => import(`@/views/${name}/index.vue`)

export const routers = [
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
          permission: '/insure-goods',
          dotkey: {
            value: ['off_product_quantity', 'new_product_quantity'],
            permission: ['/insure-goods/new_product_notice', '/insure-goods/product_off_notice']
          }
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
          permission: '/rate'
        },
        component: getView('good-manage/rate')
      }
    ]
  },
  {
    label: '出单业绩',
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
          permission: '/achievement-company'
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
          permission: '/company_performance/detail'
        },
        component: getView('achievement/order-detail')
      },
      {
        path: '/achievement-team',
        name: 'achievement-team',
        meta: {
          title: '团队业绩',
          header: true,
          menu: true,
          show: true,
          permission: '/achievement-team'
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
          permission: '/team_performance/detail'
        },
        component: getView('achievement/order-detail')
      },
      {
        path: '/achievement-self',
        name: 'achievement-self',
        meta: {
          title: '我的业绩',
          header: true,
          menu: true,
          show: true,
          permission: '/achievement-self'
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
          permission: '/my_performance/detail'
        },
        component: getView('achievement/order-detail')
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
          permission: '/proposal'
        },
        component: () => import('views/merchandising/proposal')
      },
      {
        path: '/proposal/proposal-operate',
        name: 'Proposal-operate',
        meta: {
          title: '计划书编辑',
          show: false,
          permission: '/proposal/proposal-operate/update'
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
          permission: '/underwrite-health-notice'
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
          permission: '/interactive-logs'
        },
        component: () => import('views/merchandising/interactive-logs')
      },
      {
        path: '/product-compare',
        name: 'product-compare',
        component: () => import('views/underwriting-health-notice/product-compare'),
        meta: {
          permission: '/product_compare/entry',
          title: '产品对比',
          header: true,
          menu: true,
          show: true,
        }
      },
      {
        path: '/product-compare-lab',
        name: 'product-compare-lab',
        component: () => import('views/underwriting-health-notice/product-compare/product-compare-lab'),
        meta: {
          permission: '/product_compare/entry',
          title: '产品对比',
          header: false,
          menu: false,
          show: false,
        }
      }
    ]
  },
  {
    label: '客户',
    icon: 'iconcebiandaohang20_kehu',
    children: [
      {
        path: '/all-customer',
        name: 'all-customer',
        meta: {
          title: '全部客户',
          header: true,
          menu: true,
          show: true,
          permission: [
            '/customer/admin/customer_page_list',
            '/customer/admin/family_page_list'
          ]
        },
        component: () => import('views/customer/all-customer')
      },
      {
        path: '/customer-detail/:id',
        name: 'customer-detail',
        meta: {
          title: '客户详情',
          header: true,
          menu: false,
          show: false,
          permission: '/customer/admin/customer_detail'
        },
        component: () => import('views/customer/customer-detail')
      },
      {
        path: '/customer-family-detail/:id',
        name: 'customer-family-detail',
        meta: {
          title: '客户家庭详情',
          header: true,
          menu: false,
          show: false,
          permission: '/customer/admin/family_detail'
        },
        component: () => import('views/customer/family-detail')
      },
      {
        path: '/my-customer',
        name: 'my-customer',
        meta: {
          title: '我的客户',
          header: true,
          menu: true,
          show: true,
          permission: [
              '/customer/sales_customer/page_list',
              '/customer/sales/family_page_list'
          ]
        },
        component: () => import('views/customer/my-customer')
      },
      {
        path: '/my-customer-detail/:id',
        name: 'my-customer-detail',
        meta: {
          title: '我的客户详情',
          header: true,
          menu: false,
          show: false,
          permission: '/customer/sales_customer/detail'
        },
        component: () => import('views/customer/customer-detail')
      },
      {
        path: '/my-customer-family-detail/:id',
        name: 'my-customer-family-detail',
        meta: {
          title: '我的家庭详情',
          header: true,
          menu: false,
          show: false,
          permission: '/customer/sales/family_detail'
        },
        component: () => import('views/customer/family-detail')
      }
    ]
  },
  {
    label: '用户管理',
    icon: 'iconcebiandaohang20_yonghuguanli1',
    children: [
      {
        path: '/sale',
        name: 'Sale',
        meta: {
          title: '销售',
          header: true,
          menu: true,
          show: true,
          permission: '/sale'
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
          permission: '/manager'
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
    path: '/company',
    name: 'Company',
    meta: {
      title: '公司资料',
      header: true,
      menu: true,
      show: true
    },
    component: getView('company')
  },
  {
    path: '/group',
    name: 'Group',
    meta: {
      title: '团队成员',
      header: true,
      menu: true,
      show: true,
      permission: '/self_and_child_teams'
    },
    component: getView('group')
  },
  {
    path: '/dev-interface',
    name: 'devInterface',
    meta: {
      title: '开发对接',
      header: true,
      menu: true,
      show: true,
      permission: '/self_and_child_teams'
    },
    component: getView('dev-interface')
  },
  {
    path: "/404",
    name: "404",
    meta: {
      title: '404',
      header: true,
      menu: false
    },
    component: getView('404')
  },
  // {
  //   // 样式规范
  //   path: "/design",
  //   name: "design",
  //   meta: {
  //     title: 'about',
  //     header: false,
  //     menu: false
  //   },
  //   component: () =>
  //       import("@/views/DesignSpec.vue")
  // },
  {
    path: '*',
    redirect: '/404'
  }
]


export default routers.reduce((prev, curr) => {
  return prev.concat(curr.children)
}, []).concat(necessaryRoutes)
