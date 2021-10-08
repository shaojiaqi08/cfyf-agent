<template>
  <div :class="['filter-item',visible ? 'active' : '', idArray.length ? 'has-value' : '']">
    <el-popover
      placement="bottom"
      width="220"
      trigger="click"
      v-model="visible">
      <span slot="reference">
        <span style="vertical-align: middle;">保险类型</span>
        <template v-if="idArray.length > 1">
          <span class="select-count">{{ idArray.length }}</span>
        </template>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-select clearable
                 ref="selector"
                 class="inline-block"
                 :loading="loading"
                 @change="changeSelect"
                 @clear="clear"
                 v-model="idArray"
                 multiple
                 filterable>
        <el-option
          v-for="item in list"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
      </el-select>
    </el-popover>
    <span class="close-btn" @click="clear">
        <i class="iconfont iconxiao_yuanxingguanbi"></i>
    </span>
  </div>
</template>

<script>
  import { getInsuranceList } from '@/apis/modules/proposal'

  export default {
    data() {
      return {
        idArray: [],
        visible: false,
        list: [],
        loading: false
      }
    },
    watch: {
      visible(v) {
        if (v) {
          this.getInsuranceList()
          this.$nextTick(() => {
            this.$refs.selector.focus()
          })
        }
      }
    },
    methods: {
      clear() {
        this.idArray = []
        this.changeSelect([])
      },
      changeSelect(item) {
        this.$emit('search', { first_product_category_ids: item })
      },
      getInsuranceList() {
        this.loading = true
        getInsuranceList().then(res => {
          this.list = res
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
@import url(./index.scss);
</style>
