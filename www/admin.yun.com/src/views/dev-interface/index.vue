<template>
  <div>
    <div class="dev-interface-container" v-loading="loading">
      <div class="header">
        开发对接信息
      </div>
      <div class="body">
        <div class="item">
          <div class="label">机构 ACCESS KEY</div>
          <div class="value"></div>
        </div>
        <div class="item">
          <div class="label">机构 ACCESS SECRET</div>
          <div class="value">
            <el-popconfirm title="是否刷新？">
              <i slot="reference" class="iconfont iconxiao16_shuaxin"></i>
            </el-popconfirm>
          </div>
        </div>
        <div class="item">
          <div class="label">机构DES秘钥</div>
          <div class="value">
            <el-popconfirm title="是否刷新？">
              <i slot="reference" class="iconfont iconxiao16_shuaxin"></i>
            </el-popconfirm>
          </div>
        </div>
        <div class="item">
          <div class="label">机构接收订单URL</div>
          <div class="value">
            <el-input placeholder="请输入机构订单URL" size="small"></el-input>
          </div>
        </div>
        <div class="item textarea-item">
          <div class="label">白名单IP</div>
          <div class="value">
            <el-input placeholder="请输入白名单IP" size="small" type="textarea" :rows="1" style="min-height: 32px"></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {} from '@/apis/modules'
  export default {
    name: 'dev-interface',
    data() {
      return {
        loading: false,
        data: {}
      }
    },
    methods: {
      getData() {}
    },
    created() {
      this.getData()
    }
  }
</script>

<style lang="scss" scoped>
  .dev-interface-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 600px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    .header {
      padding: 16px;
      width: 100%;
      background-color: #F5F5F5;
      color: #1A1A1A;
      font-size: 18px;
      line-height: 1.6;
      font-weight: bold;
      border-bottom: 1px solid #e6e6e6;
      box-sizing: border-box;
      border-radius: 4px 4px 0px 0px;
    }
    .body {
      background-color: #fff;
      border-radius: 0px 0px 4px 4px;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 52px;
        padding: 0 16px 8px 16px;
        font-weight: 400;
        .label {
          color: #999999;
        }
        .value {
          color: #1A1A1A;
          width: 320px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          justify-content: flex-end;
          display: flex;
          align-items: center;
          & .iconfont {
            color: #1F78FF;
            cursor: pointer;
            font-size: 16px;
          }
        }
        &.textarea-item{
          min-height: 52px;
          height: initial;
          align-items: flex-start;
          & .label {
            line-height: 32px;
          }
        }
      }
    }
  }
</style>
