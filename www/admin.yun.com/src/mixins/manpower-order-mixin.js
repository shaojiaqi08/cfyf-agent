import { policyStatus } from '@/enums/common'

export default {
  methods: {
    rowStyleFormat({row}) {
      if (row.policy_manpower_underwriting && row.policy_manpower_underwriting.status == 0) {
        return { color: `#09ba08` }
      } else {
        switch (row.policy_status) {
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
    }
  }
}
