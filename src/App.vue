<template>
  <div id="app">
    <Header v-if="$route.meta.header"></Header>
    <Menu v-if="$route.meta.menu"></Menu>
    <router-view class="cover"
                 :class="{ 'full-page': !$route.meta.menu && !$route.meta.header }" />
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
  &.full-page {
    top: 0;
    left: 0;
  }
}
</style>
