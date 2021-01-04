import { policyStatus } from '@/enums/common'
import { debounce } from '@/utils'

export default {
  methods: {
    rowStyleFormat(value) {
      switch (value.row.policy_status) {
        case policyStatus.UNPAID:
          return { color: `#1F78FF` }
        case policyStatus.INVALID:
        case policyStatus.CANCELED:
          return { color: `#999999` }
        case policyStatus.SURRENDERED:
          return { color: `#FF4C4C` }
        default:
          return { color: `#000` }
      }
    },
    calcTableHeight: debounce(function() {
      const bodyHeight = document.body.clientHeight
      const { top } = this.$refs.table.$el.getBoundingClientRect()
      this.tableMaxHeight = bodyHeight - top - 10
    }, 300)
  },
  mounted() {
    window.addEventListener('resize', this.calcTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcTableHeight)
  }
}
