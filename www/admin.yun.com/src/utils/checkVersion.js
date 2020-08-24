import { checkVersion } from '@/apis/modules'
export default function (cb, self) {
  checkVersion()
  .then(res => {
    const systemVersion = res.latest_version
    const localSystemVersion = self.version || (self.version = window.localStorage.getItem('systemVersion'))
    if (!localSystemVersion) {
      window.localStorage.setItem('systemVersion', systemVersion)
      cb()
    } else {
      if (systemVersion !== localSystemVersion) {
        self.$confirm('检查到有新的系统版本, 是否刷新?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.localStorage.setItem('systemVersion', systemVersion)
          window.location.reload()
        }).catch(() => {
          cb()
          console.log('取消刷新')
        })
      } else {
        cb()
      }
    }
  })
  .catch(err => console.log(err))
}