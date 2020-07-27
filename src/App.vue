<template>
  <div id="app">
    <Header v-if="$route.meta.header"></Header>
    <Menu v-if="$route.meta.menu"></Menu>
    <transition name="page-fade" mode="out-in">
      <router-view class="cover"
                   :style="coverStyle" />
    </transition>
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
  min-width: 1300px;
  right: 0;
  bottom: 0;
  background-color: #e6e4e1;
}
.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity .3s ease;
}
.page-fade-enter, .page-fade-leave-to {
  transition: opacity .3s ease;
  opacity: 0;
}
</style>
