<template>
  <el-dialog
      :visible="visible"
      title="短信通知"
      width="400px"
      @close="handleClose">
    <p class="title">将会发送以下短信给客户（投保人）</p>
    <span class="letter-content">
      【保单管理助手】尊敬的张三：您去年投保的“复星联合康乐一生重大疾病保险B款”，保单号8001005186于2020年08月08日保险到期。为使您未来一年得到相应的保障，请您及时完成续保。<span class="high-light">https://www.baidu.com/s?ie=ut</span>如有疑问请致电您的规划师李四<span class="high-light">1595554569</span>。如已续保请忽略本短信。
    </span>
    <template #footer>
      <el-button @click="handleClose" class="mr20">取消</el-button>
      <el-button v-if="!isEdit" type="primary" @click="handleEnter">确认发送</el-button>
      <el-button v-else type="primary" @click="handleEnter">修改昵称、手机</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'letter-dialog',
  props: {
    visible: Boolean,
    isEdit: Boolean,
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleEnter() {
      this.emit('handleSuccess')
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .el-dialog__body {
    text-align: center;
    .title {
      font-size: 16px;
      color: #333;
      line-height: 16px;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .letter-content {
      color: #1A1A1A;
      text-align: justify;
      .high-light {
        color: #1F78FF;
      }
    }
  }
  ::v-deep .el-dialog__footer .el-button {
    width: 114px;
  }
</style>
