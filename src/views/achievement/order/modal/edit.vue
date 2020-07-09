<template>
  <el-dialog
      top="5vh"
      custom-class="belong-dialog"
      title="修改归属"
      width="480px"
      :close-on-click-modal="false"
      :visible="show">
      <div class="card">
        <el-row type="flex" justify="space-between">
          <el-col :span="15">光大永明嘉多保重大疾病保险</el-col>
          <el-col :span="9">
            <el-tag type="minor">投保日期：2020-05-21</el-tag>
          </el-col>
        </el-row>
        <el-row class="table">
          <el-col :span="6">
            投保人
            <span>张三</span>
          </el-col>
          <el-col :span="6">
            被保人
            <span>张三</span>
          </el-col>
          <el-col :span="6">
            保额
            <span>张三</span>
          </el-col>
          <el-col :span="6">
            保费
            <span>34244.44元</span>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            投保单号
            <span>213412312313</span>
          </el-col>
          <el-col :span="12">
            保单号
            <span>23123412343452345</span>
          </el-col>
        </el-row>
      </div>
      <el-form label-width="100px">
        <el-form-item label="归属B端公司">
          <el-select placeholder="请选择此订单归属的B端公司"></el-select>
        </el-form-item>
        <el-form-item label="归属成员">
          <el-select placeholder="请选择此订单归属的成员"></el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('update:show', false)
    }
  }
}
</script>