<template>
  <el-dialog :close-on-click-modal="false"
             :title="title"
             :visible="show"
             width="400px"
             @close="modalClose">
    <div class="p16 flex-between material-item">
      <div>
        <div class="title mb8">H5计划书版本</div>
        <div class="tip">请使用微信扫码打开</div>
        <div class="tip">打开后点击右上角按钮转发</div>
      </div>
      <div class="qrcode">
        <img :src="codeBase64" height="100%" width="100%">
      </div>
    </div>
    <div class="p16 flex-between material-item">
      <div>
        <div class="title">PDF版本计划书</div>
      </div>
      <div>
        <el-button size="mini" type="text" @click="check('view')">在线查看</el-button>
        <el-button type="primary" @click="check('download')">下载本地</el-button>
      </div>
    </div>
    <div class="p16 flex-between material-item">
      <div>
        <div class="title">图片版本计划书</div>
      </div>
      <div>
        <el-button size="mini" type="text" @click="checkImg('view')">在线查看</el-button>
        <el-button type="primary" @click="checkImg('download')"> 下载本地</el-button>
      </div>
    </div>
    <!--    <div class="p16 flex-between material-item" v-if="isDeposit">-->
    <!--      <div>-->
    <!--        <div class="title">表格版本计划书</div>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <el-button type="primary">下载本地</el-button>-->
    <!--      </div>-->
    <!--    </div>-->
  </el-dialog>
</template>

<script>
import QRCode from 'qrcode'

  export default {
    props: {
      show: {
        required: true,
        type: Boolean
      },
      proposalInfo: {
        required: true,
        type: Object
      },
      title: {
        type: String
      },
      // 是否储蓄计划书类型, 默认否
      isDeposit: {
        type: Boolean,
        default: false
      }
    },
    data() {
    return {
      codeBase64: ''
    }
  },
    mounted () {
    let that = this
    QRCode.toDataURL(this.proposalInfo.view_url).then(result => {
      that.codeBase64 = result
    })
  },
    methods: {
      check (type) {
        window.open(`${process.env.VUE_APP_API_URL}/agent/proxy/${this.isDeposit ? `deposit-proposal/pdf/${type}-by-pcode` : `proposal/file/${type}/pdf`}?pcode=${this.proposalInfo.pcode}`)
      },
      checkImg (type) {
        window.open(`${process.env.VUE_APP_API_URL}/agent/proxy/${this.isDeposit ? `deposit-proposal/image/${type}-by-pcode` : `proposal/file/${type}/image`}?pcode=${this.proposalInfo.pcode}`)
      },
      modalClose () {
        this.$emit('fresh')
        this.$emit('update:show', false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .material-item {
    margin-bottom: 8px;
    background-color: #F5F5F5;
    border-radius: 4px;

    .title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }

    .tip {
      font-size: 14px;
      color: #808080;
      line-height: 22px;
    }

    .qrcode {
      width: 128px;
      height: 128px;
    }
  }
</style>
