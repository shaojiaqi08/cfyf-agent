<template>
  <div class="new-layout-common-header">
    <div class="flex-between header-title">
      计划书编辑
    </div>
    <div class="flex-between">
<!--      <pro-sale-guest-remind iconClass="white" v-if="checkAuth('subordinate-reception-time') && !checkAuth('allocation-of-progress-and-quantity')"></pro-sale-guest-remind>-->
<!--      <sale-guest-remind iconClass="white" v-if="checkAuth('my-reception-time') && !checkAuth('subordinate-reception-time') && !checkAuth('allocation-of-progress-and-quantity')"></sale-guest-remind>-->
<!--      <admin-sale-guest-remind iconClass="white" v-if="checkAuth('allocation-of-progress-and-quantity')"></admin-sale-guest-remind>-->
<!--      <birth-remind iconClass="white" v-if="checkAuth('coustomer-birth-remind') && !isAdmin"></birth-remind>-->
<!--      <order-badge iconClass="white" v-if="checkAuth('order-badge-tip')"></order-badge>-->
<!--      <user-bar class="white"></user-bar>-->
    </div>
  </div>
</template>

<script>
  // import UserBar from '@/components/user-bar'
  // import OrderBadge from '@/components/order-badge'
  // import BirthRemind from '@/components/birth-remind'
  // import saleGuestRemind from '@/components/guest-remind/sale-guest-remind'
  // import proSaleGuestRemind from '@/components/pro-sale-guest-remind'
  // import adminSaleGuestRemind from '@/components/admin-sale-guest-remind'
  import {mapGetters} from 'vuex'

  export default {
    name: 'header-content',
    components: {
      // UserBar,
      // OrderBadge,
      // BirthRemind,
      // saleGuestRemind,
      // proSaleGuestRemind,
      // adminSaleGuestRemind
    },
    data() {
      return {
        searchModel: {
          tab_status: 0,
          keyword: '',
          keyword_type: ''
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      isAdmin() {
        return this.userInfo && (this.userInfo.is_admin === 1)
      }
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
      checkAuth(value) {
        if (this.userInfo && this.userInfo.permissions) {
          return this.userInfo && this.userInfo.permissions.includes(value)
        } else {
          return false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.header-title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}
</style>
