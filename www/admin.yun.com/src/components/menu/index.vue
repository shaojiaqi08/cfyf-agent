<template>
  <div class="menu">
    <el-scrollbar class="menu-list scrollbar">
      <div v-for="item in routers"
           :key="item.label"
           class="mb24">
        <div class="menu-header">
          <i class="mr8 iconfont" :class="[item.icon]"></i>
          {{ item.label }}
        </div>
        <div class="normal-transition menu-item"
             :class="{ actived: $route.name === nav.name }"
             v-for="nav in item.children"
             :key="nav.name"
             v-allowed="[$route.meta.permission]"
             @click="jump(nav.name)">
          <el-badge
            is-dot
            v-if="nav.dotkey && checkIsShowDot(nav.dotkey)"
            class="mr8"></el-badge>{{ nav.meta.title }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import { routers } from '@/router/routes'
  import { getDotsData } from '@/apis/modules'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        routers: []
      }
    },
    computed: {
      ...mapState('users', ['userInfo']),
      ...mapState('dotManage', ['dots']),
      permission() {
        return this.userInfo.permissions || []
      }
    },
    mounted() {
      // 获取全局红点
      this.getDotsData()
      this.menuInit()
    },
    methods: {
      getDotsData() {
        getDotsData().then(res => {
          this.$store.dispatch('dotManage/updateDots', res)
        })
      },
      checkIsShowDot(dots) {
        return Array.isArray(dots) ? dots.some(key => this.dots[key] > 0) : this.dots[dots] > 0
      },
      filterRoutes(routes) {
        return routes.filter(i => i.meta.show)
      },
      menuInit() {
        this.routers = routers.reduce((prev, next) => {
          const hasPermissionChildren = this.filterRoutes(next.children).filter(i => {
            const curPermission = i.meta.permission
            return Array.isArray(curPermission) ? this.permission.some(i => curPermission.includes(i)) : this.permission.includes(curPermission)
          })
          if (hasPermissionChildren.length) {
            return prev.concat({...next, children: hasPermissionChildren})
          } else {
            return prev
          }
        }, [])
      },
      jump(name) {
        if (this.$route.name === name) return
        this.$router.push({ name })
      }
    },
    watch: {
      permission() {
        this.menuInit()
      }
    }
  }
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  top: 60px;
  left: 0;
  width: 160px;
  bottom: 15px;
  background-color: #e1e3e6;
  .menu-list {
    padding: 0 0 20px 20px;
    height: 96vh;
    .mb24 {
      margin-bottom: 24px;
    }
    .menu-header {
      margin-bottom: 8px;
      padding: 3px 8px;
      width: 140px;
      color: #4D4D4D;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      &:first-child {
        // margin-top: 0;
      }
      .iconfont{
        font-size: 20px;
        font-weight: normal;
      }
    }
    .menu-item {
      padding: 10px 0 10px 36px;
      width: 140px;
      height: 40px;
      color: #4d4d4d;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      display: flex;
      align-items: center;
      &.actived {
        color: #1F78FF;
        font-weight: bold;
        &:hover {
          background-color: rgba(0, 0, 0, .1);
        }
      }
      &:hover{
        background-color: rgba(0, 0, 0, .1);
      }
      ::v-deep .el-badge sup {
        top: 0;
      }
    }
  }
}
</style>
