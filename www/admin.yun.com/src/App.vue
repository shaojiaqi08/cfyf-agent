<template>
  <div id="app">
    <Header v-if="$route.meta.header"></Header>
    <Menu v-if="$route.meta.menu"></Menu>
    <div class="cover" :style="coverStyle">
      <transition name="page-fade"
                  mode="out-in">
        <router-view  />
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Header from '@/components/header'
import Menu from '@/components/menu'
import checkVersion from '@/utils/checkVersion'
export default {
  components: {
    Header,
    Menu
  },
  data() {
    return {
      delay: 1000 * 60
    };
  },
  computed: {
    ...mapState('users', ['userInfo']),
    coverStyle() {
      const hasMenu = this.$route.meta.menu
      const hasHeader = this.$route.meta.header
      return {
        top: hasHeader ? `60px` : `0`,
        left: hasMenu ? `160px` : `0`
      }
    }
  },
  methods: {
    ...mapActions('users', ['updateUserInfo', 'getNotification']),
    pollCheckVersion() {
      setTimeout(() => {
        checkVersion(() => {
          this.pollCheckVersion()
        }, this)
      }, this.delay)
    }
  },
  created() {
    // 版本检查
    checkVersion(() => {
      this.pollCheckVersion()
    }, this)
    this.getNotification()
  }
};
</script>
<style lang="scss" scoped>
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
}
.cover {
  position: absolute;
  top: 60px;
  left: 180px;
  right: 0;
  bottom: 0;
  min-width: 1280px;
  background-color: #e1e3e6;
}
.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity .3s ease;
}
.page-fade-enter, .page-fade-leave-to {
  transition: opacity .3s ease;
  opacity: 0;
}
</style>
