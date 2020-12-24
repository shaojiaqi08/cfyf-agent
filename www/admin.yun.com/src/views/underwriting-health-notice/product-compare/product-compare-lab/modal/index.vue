<template>
  <el-dialog width="480px"
             :visible="show"
             @close="modalClose"
             title="产品对比图片">
    <img :src="imageUrl" alt="" width="440px">
    <div class="flex-between mt10" style="justify-content: center;">
      <!-- <el-link target="_blank" :href="imageUrl" :underline="false">
          <el-button type="primary" plain>预览图片</el-button>
      </el-link> -->
      <el-button type="primary" @click="preview" plain>预览图片</el-button>
      <el-button type="primary" class="mr20" @click="saveImage">保存图片</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String
    }
  },
  data() {
    return {}
  },
  methods: {
    preview() {
      let newTab = window.open()
      let newImage = new Image()
      newImage.src = this.imageUrl
      newTab.document.body.appendChild(newImage)
    },
    modalClose() {
      this.$emit('update:show', false)
    },
    downloadFileByBase64(base64, name) {
      let myBlob = this.dataURLtoBlob(base64)
      let myUrl = URL.createObjectURL(myBlob)
      this.downloadFile(myUrl, name)
    },
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    downloadFile(url, name) {
      let a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', name)
      a.setAttribute('target', '_blank')
      let clickEvent = document.createEvent('MouseEvents')
      clickEvent.initEvent('click', true, true)
      a.dispatchEvent(clickEvent)
    },
    saveImage() {
      this.downloadFileByBase64(this.imageUrl, '对比一览表')
    }
  }
}
</script>

<style lang="scss" scoped>
.compare-box {
  transform: scale(0.5, 0.5);
  .title {
    height: 62px;
    width: 400px;
    color: #131415;
    font-size: 20px;
    line-height: 62px;
    text-align: center;
    background-color: #FAFAFA;
  }
}

.mt10{
  padding-bottom: 20px;
}
</style>
