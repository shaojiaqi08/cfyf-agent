// const getComponent = (name) => () => import(`@/components/${name}/index.vue`)
const getView = (name) => () => import(`@/views/${name}/index.vue`)

export const routers = [
  {
    label: '首页',
    icon: 'iconcebiandaohang20_shangpin',
    children: [
      {
        path: '/index',
        name: 'index',
        meta: {
          title: '首页',
          header: true,
          menu: true,
          show: true,
          permission: '/home_page/manage'
        },
        component: getView('home')
      },
      {
        path: '/announcement',
        name: 'announcement',
        meta: {
          title: '公告',
          header: true,
          menu: true,
          show: false,
          permission: '/home_page/manage'
        },
        component: getView('announcement/index')
      },
      {
        path: '/announcement-detail',
        name: 'announcement-detail',
        meta: {
          title: '公告详情',
          header: true,
          menu: false,
          show: false,
          permission: '/home_page/manage'
        },
        component: getView('announcement/detail')
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
        path: '/renewal-company/detail/:id',
        name: 'renewal-company-detail',
        meta: {
          title: '公司保单详情',
          header: true,
          menu: false,
          show: false,
          permission: '/company_renewal/policy_detail'
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
        path: '/renewal-team/detail/:id',
        name: 'renewal-team-detail',
        meta: {
          title: '团队保单详情',
          header: true,
          menu: false,
          show: false,
          permission: '/team_renewal/policy_detail'
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
      },
      {
        path: '/renewal-self/detail/:id',
        name: 'renewal-self-detail',
        meta: {
          title: '个人保单详情',
          header: true,
          menu: false,
          show: false,
          permission: '/sales_renewal/policy_detail'
        },
        component: getView('achievement/order-detail')
      },
      {
        path: '/manpower-order',
        name: 'manpower-order',
        meta: {
          title: '人核订单',
          header: true,
          menu: true,
          show: true,
          permission: ['manpower-order-company', 'manpower-order-team', 'manpower-order-sales']
        },
        component: getView('achievement/manpower-order')
      },
      {
        path: '/manpower-order-company-detail/:id',
        name: 'manpower-order-company-detail',
        meta: {
          title: '公司人核订单详情',
          header: true,
          menu: false,
          show: false,
          permission: 'manpower-order-company-detail'
        },
        component: getView('achievement/manpower-order-detail')
      },
      {
        path: '/manpower-order-team-detail/:id',
        name: 'manpower-order-team-detail',
        meta: {
          title: '团队人核订单详情',
          header: true,
          menu: false,
          show: false,
          permission: 'manpower-order-team-detail'
        },
        component: getView('achievement/manpower-order-detail')
      },
      {
        path: '/manpower-order-sales-detail/:id',
        name: 'manpower-order-sales-detail',
        meta: {
          title: '我的人核订单详情',
          header: true,
          menu: false,
          show: false,
          permission: 'manpower-order-sales-detail'
        },
        component: getView('achievement/manpower-order-detail')
      },
    ]
  },
  {
    label: '续保续期',
    icon: 'icona-cebiandaohang20_xubaoxuqi',
    children: [
      {
        path: '/renewal-order/my',
        name: 'RenewalOrder',
        meta: {
          title: '我的续保续期',
          header: true,
          menu: true,
          show: true,
          permission: 'sales_policy_renewal_list'
        },
        component: getView('renewal-order/renewal')
      },
      {
        path: '/renewal-order/team',
        name: 'renewalTeam',
        meta: {
          title: '团队续保续期',
          header: true,
          menu: true,
          show: true,
          permission: 'team_policy_renewal_list'
        },
        component: getView('renewal-order/renewal')
      },
      {
        path: '/renewal-order/company',
        name: 'renewalCompany',
        meta: {
          title: '公司续保续期',
          header: true,
          menu: true,
          show: true,
          permission: 'company_policy_renewal_list'
        },
        component: getView('renewal-order/renewal')
      },
      {
        path: '/renewal-order-trace/my/:version',
        name: 'RenewalOrderTraceMy',
        meta: {
          title: '跟踪续保续期详情',
          header: false,
          menu: false,
          show: false,
          permission: '/policy_renewal/sales_follow'
        },
        component: getView('renewal-order/policy-holder-detail')
      },
      {
        path: '/renewal-order-trace/team/:version',
        name: 'RenewalOrderTraceTeam',
        meta: {
          title: '跟踪续保续期详情',
          header: false,
          menu: false,
          show: false,
          permission: '/policy_renewal/team_follow'
        },
        component: getView('renewal-order/policy-holder-detail')
      },
      {
        path: '/renewal-order-trace/company/:version',
        name: 'RenewalOrderTraceCompany',
        meta: {
          title: '跟踪续保续期详情',
          header: false,
          menu: false,
          show: false,
          permission: '/policy_renewal/company_follow'
        },
        component: getView('renewal-order/policy-holder-detail')
      },
      {
        path: '/renewal-order-view/my/:version',
        name: 'RenewalOrderViewMy',
        meta: {
          title: '查看续保续期详情',
          header: false,
          menu: false,
          show: false,
          permission: '/policy_renewal/detail_for_sales'
        },
        component: getView('renewal-order/policy-holder-detail')
      },
      {
        path: '/renewal-order-view/team/:version',
        name: 'RenewalOrderViewMyTeam',
        meta: {
          title: '查看续保续期详情',
          header: false,
          menu: false,
          show: false,
          permission: '/policy_renewal/detail_for_team'
        },
        component: getView('renewal-order/policy-holder-detail')
      },
      {
        path: '/renewal-order-view/company/:version',
        name: 'RenewalOrderViewMyCompany',
        meta: {
          title: '查看续保续期详情',
          header: false,
          menu: false,
          show: false,
          permission: '/policy_renewal/detail_for_company'
        },
        component: getView('renewal-order/policy-holder-detail')
      },
      //销售员通知客户设置
      {
        path: '/renewal-notify',
        name: 'RenewalNotify',
        meta: {
          title: '销售通知客户',
          header: true,
          menu: true,
          show: true,
          permission: '/policy_renewal/notify_sales_setting'
        },
        component: getView('renewal-order/notify/sales')
      },
      //管理员通知客户设置
      {
        path: '/renewal-admin-notify',
        name: 'RenewalAdminNotify',
        meta: {
          title: '公司通知客户',
          header: true,
          menu: true,
          show: true,
          permission: '/policy_renewal/notify_admin_setting'
        },
        component: getView('renewal-order/notify/admin')
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
          permission: ['/proposal', '/deposit-proposal/list-with-page',"/proposal/team_list_with_page","/deposit-proposal/team-list-with-pag","/proposal/all_list_with_page","/deposit-proposal/all-list-with-page"]
        },
        component: () => import('views/merchandising/prospectus')
      },
      {
        path: '/proposal/proposal-operate',
        name: 'Proposal-operate',
        meta: {
          title: '保障计划书编辑',
          show: false,
          permission: '/proposal/proposal-operate/update'
        },
        component: () => import('views/merchandising/proposal/proposal-operate')
      },
      {
        path: '/proposal/proposal-operate-deposit',
        name: 'Proposal-operate-deposit',
        meta: {
          title: '储蓄计划书编辑',
          show: false,
          permission: '/deposit-proposal/update'
        },
        component: () => import('views/merchandising/proposal/proposal-operate-deposit')
      },
      {
        path: '/underwrite-health-notice',
        name: 'Underwrite-health-notice',
        meta: {
          title: '助销支持',
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
    redirect: '/index'
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
