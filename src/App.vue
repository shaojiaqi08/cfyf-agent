<template>
  <div id="app">
    <Header v-if="$route.meta.header"></Header>
    <Menu v-if="$route.meta.menu"></Menu>
    <el-scrollbar class="cover scrollbar"
                  :style="coverStyle">
      <transition name="page-fade" mode="out-in">
        <router-view  />
      </transition>
    </el-scrollbar>
  </div>
</template>

<script>
import Header from '@/components/header'
import Menu from '@/components/menu'
export default {
  components: {
    Header,
    Menu
  },
  data() {
    return {
      a: true
    };
  },
  computed: {
    coverStyle() {
      const hasMenu = this.$route.meta.menu
      const hasHeader = this.$route.meta.header
      return {
        top: hasHeader ? `40px` : `0`,
        left: hasMenu ? `160px` : `0`
      }
    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 40px;
  left: 180px;
  right: 0;
  bottom: 0;
  min-width: 1050px;
  background-color: #e6e4e1;
  & > ::v-deep .el-scrollbar__wrap > .el-scrollbar__view{
    height: 100%;
    & > div{
      height: 100%
    }
  }
}
.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity .3s ease;
}
.page-fade-enter, .page-fade-leave-to {
  transition: opacity .3s ease;
  opacity: 0;
}
</style>
