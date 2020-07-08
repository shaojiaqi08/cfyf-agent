<template>
  <div id="app">
    <Header></Header>
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/header'
export default {
  components: {
    Header
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

<style lang="scss">
</style>
