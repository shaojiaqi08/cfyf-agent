<template>
  <div id="app">
    <Header v-if="$route.meta.header"></Header>
    <Menu v-if="$route.meta.menu"></Menu>
    <router-view class="cover"
                 :style="coverStyle" />
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
        left: hasMenu ? `180px` : `0`
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
  background-color: #F0F0F0;
}
</style>
