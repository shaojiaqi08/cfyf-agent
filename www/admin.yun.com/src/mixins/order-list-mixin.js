import { policyStatus } from '@/enums/common'
import { debounce } from '@/utils'

export default {
  methods: {
    rowStyleFormat(value) {
      if (value.row.policy_manpower_underwriting && value.row.policy_manpower_underwriting.status == 0) {
        return { color: `#09ba08` }
      } else {
        switch (value.row.policy_status) {
          case policyStatus.UNPAID:
            return { color: `#4497eb` }
          case policyStatus.INVALID:
          case policyStatus.CANCELED:
            return { color: `#999999` }
          case policyStatus.SURRENDERED:
            return { color: `#FF4C4C` }
          default:
            return { color: `#000` }
        }
      }
    },
    getBgColor(value) {
      console.log('---------', value)
      switch (value) {
        case 0:
          return { background: `#09ba08` }
        case policyStatus.UNPAID:
          return { background: `#4497eb` }
        case policyStatus.INVALID:
        case policyStatus.CANCELED:
          return { background: `#999999` }
        case policyStatus.SURRENDERED:
          return { background: `#FF4C4C` }
        default:
          return { background: `#000` }
      }
    },
    calcTableHeight: debounce(function() {
      const bodyHeight = document.body.clientHeight
      const { top } = this.$refs.table.$el.getBoundingClientRect()
      this.tableMaxHeight = bodyHeight - top - 65
    }, 300)
  },
  mounted() {
    window.addEventListener('resize', this.calcTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcTableHeight)
  }
}
