import browserType from './browserType'

export default function (self) {
  const browser = browserType()
  console.log(browser, 'browserbrowserbrowser')
  if (browser.platform === 'desktop' && browser.supporter !== 'chrome' && !localStorage.getItem('isAdviseBrowser')) {
    self.$notify({
      title: '温馨提示',
      duration: 0,
      dangerouslyUseHTMLString: true,
      message: `
        <div class="mt4">
          如需获取最好的体验效果，请下载最新谷歌内核浏览器进行操作
          <strong style="color: #339AFF;">
            <a href="https://www.microsoft.com/zh-cn/edge" target="_blank">点击下载</a>
          </strong>
        </div> 
      `,
      onClose() {
        localStorage.setItem('isAdviseBrowser', true)
      }
    });
  }
}