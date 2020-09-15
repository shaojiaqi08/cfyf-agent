<template>
  <div>
    <div class="error">
      <div class="error-image"></div>
      404
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.error {
  margin: 0 auto;
  margin-top: calc(30vh);
  width: 216px;
  height: 400px;
  font-size: 76px;
  font-weight: bold;
  text-align: center;
  .error-image {
    width: 216px;
    height: 216px;
    background: url(../../assets/images/error.png) no-repeat;
    background-size: cover;
  }
}
</style>
