import { policyStatus } from '@/enums/common'

export default {
  methods: {
    rowStyleFormat(value) {
      switch (value.row.policy_status) {
        case policyStatus.UNPAID:
          return { color: `#1F78FF` }
        case policyStatus.INVALID || policyStatus.CANCELED:
          return { color: `#999999` }
        case policyStatus.SURRENDERED:
          return { color: `#FF4C4C` }
        default:
          return { color: `#000` }
      }
    }
  },
}