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
    path: "/design",
    name: "design",
    meta: {
      title: 'about'
    },
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/DesignSpec.vue")
  }
]