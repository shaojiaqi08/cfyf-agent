<template>
  <div class="menu">
    <el-scrollbar class="menu-list scrollbar">
      <div v-for="item in routers"
           :key="item.label">
        <div class="menu-header">
          <i class="mr8 iconfont" :class="[item.icon]"></i>
          {{ item.label }}
        </div>
        <div class="normal-transition menu-item"
             :class="{ actived: $route.name === nav.name }"
             v-for="nav in filterRoutes(item.children)"
             :key="nav.name"
             @click="jump(nav.name)">
          {{ nav.meta.title }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { routers } from '@/router/routes'
export default {
  data() {
    return {
      routers: []
    }
  },
  mounted() {
    this.menuInit()
  },
  methods: {
    filterRoutes(routes) {
      return routes.filter(i => i.meta.show)
    },
    menuInit() {
      this.routers = routers
    },
    jump(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  top: 40px;
  left: 0;
  width: 180px;
  height: 1000px;
  .menu-list {
    padding: 14px 0 20px 20px;
    height: 96vh;
    .menu-header {
      margin-top: 24px;
      margin-bottom: 8px;
      padding: 3px 8px;
      width: 140px;
      color: #4D4D4D;
      font-size: 16px;
      &:first-child {
        // margin-top: 0;
      }
    }
    .menu-item {
      padding: 10px 0 10px 36px;
      width: 140px;
      height: 40px;
      color: #999999;
      font-size: 14px;
      line-height: 22px;
      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &.actived {
        color: #FF9000;
        &:hover {
          background-color: #F0F0F0;
        }
      }
      &:hover {
        background-color: #E6E6E6;
      }
    }
  }
}
</style>
