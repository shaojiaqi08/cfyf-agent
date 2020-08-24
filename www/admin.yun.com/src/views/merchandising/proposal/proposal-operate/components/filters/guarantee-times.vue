<template>
  <div :class="['filter-item',visible ? 'active' : '', hasValue && isSetValue ? 'has-value' : '']">
    <el-popover
      popper-class="proposal-filter-popper"
      placement="bottom"
      :width="popoverWidth"
      trigger="click"
      v-model="visible">
      <span slot="reference">
        <span>保障期限</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template v-if="obj.unit !== '6'">
        <el-input class="mini-count-input"
                  placeholder="最小"
                  type="number"
                  v-model="obj.min"></el-input>
        &nbsp;-&nbsp;
        <el-input class="mini-count-input"
                  placeholder="最大"
                  type="number"
                  v-model="obj.max"></el-input>
      </template>
      <el-select class="count-select"
                 v-model="obj.unit"
                 @change="changeSelect">
        <el-option v-for="item in guaranteeTimeTypes"
                   :key="item.value"
                   :value="item.value"
                   :label="item.label"></el-option>
      </el-select>
      <el-button type="primary"
                 class="block mt16"
                 @click="submit">确定</el-button>
    </el-popover>
    <span class="close-btn" @click="clear">
        <i class="iconfont iconxiao16_yuanxingchahao"></i>
    </span>
  </div>
</template>

<script>
import { guaranteeTimeTypes } from '../../config'
export default {
  data() {
    return {
      popoverWidth: 305,
      guaranteeTimeTypes,
      visible: false,
      isSetValue: false,
      obj: {
        min: '',
        max: '',
        unit: '1'
      }
    }
  },
  computed: {
    hasValue() {
      return (this.obj.unit && this.obj.min) || (this.obj.unit && this.obj.max) || this.obj.unit === '6'
    }
  },
  methods: {
    clear() {
      this.obj = { min: '', max: '', unit: '1' }
      this.popoverWidth = 305
      this.isSetValue = false
      this.submit()
    },
    changeSelect(item) {
      if (item === '6') {
        this.popoverWidth = 170
        this.obj.min = ''
        this.obj.max = ''
      } else {
        this.popoverWidth = 305
      }
    },
    submit() {
      if (this.hasValue) {
        this.isSetValue = true
      } else {
        this.isSetValue = false
      }
      this.$emit('search', { guarantee_period: this.obj })
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import url(./index.scss);
</style>
