<template>
  <div>
    <div class="dev-interface-container" v-loading="loading">
      <div class="header">
        开发对接信息
      </div>
      <div class="body">
        <div class="item">
          <div class="label">机构 ACCESS KEY</div>
          <div class="value">
            <text-hidden-ellipsis width="380px" :popoverTip="data.access_key"></text-hidden-ellipsis>
          </div>
        </div>
        <div class="item">
          <div class="label">机构 ACCESS SECRET</div>
          <div class="value" v-if="data.access_secret">
            <text-hidden-ellipsis width="380px" :popoverTip="data.access_secret"></text-hidden-ellipsis>
            <el-popconfirm title="是否刷新？" @confirm="refreshSecret">
              <el-button
                slot="reference"
                type="text"
                :disabled="loadingSecret"
                icon="iconfont iconxiao16_shuaxin ml8"></el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="item">
          <div class="label">机构DES秘钥</div>
          <div class="value" v-if="data.des_sign_key">
            <text-hidden-ellipsis width="380px" :popoverTip="data.des_sign_key"></text-hidden-ellipsis>
            <el-popconfirm title="是否刷新？" @confirm="refreshDes">
              <el-button
                slot="reference"
                type="text"
                :disabled="loadingDes"
                icon="iconfont iconxiao16_shuaxin ml8"></el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="item">
          <div class="label">机构接收订单URL</div>
          <div class="value">
            <el-input
              placeholder="请输入机构订单URL"
              size="small"
              @input="save"
              v-model.trim="data.notify_url"></el-input>
          </div>
        </div>
        <div class="item textarea-item">
          <div class="label">白名单IP</div>
          <div class="value">
            <el-input
              v-model="data.allow_ip"
              @input="save"
              resize="none"
              :autosize="{minRows: 1, maxRows: 5}"
              placeholder="多个IP地址用回车隔开"
              size="small"
              type="textarea"
              clearable
              style="min-height: 32px"></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDetail, refreshSecret, refreshDes, saveConfig } from '@/apis/modules/dev-interface'
  import { debounce } from '@/utils'
  import TextHiddenEllipsis from '@/components/text-hidden-ellipsis'
  let requestId = 0
  export default {
    name: 'dev-interface',
    components: { TextHiddenEllipsis },
    data() {
      return {
        loading: false,
        loadingSecret: false,
        loadingDes: false,
        data: {}
      }
    },
    methods: {
      getData() {
        this.loading = true
        getDetail().then(res => {
          res.allow_ip = res.allow_ip.join('\n')
          this.data = res
        }).finally(() => {
          this.loading = false
        })
      },
      refreshSecret() {
        this.loadingSecret = true
        refreshSecret().then(res => {
          this.data.access_secret = res.access_secret
        }).finally(() => {
          this.loadingSecret = false
        })
      },
      refreshDes() {
        this.loadingDes = true
        refreshDes().then(res => {
          this.data.des_sign_key = res.des_sign_key
        }).finally(() => {
          this.loadingDes = false
        })
      },
      save: debounce(function() {
        let { allow_ip, notify_url } = this.data
        allow_ip = allow_ip || ''
        notify_url = notify_url || ''
        const reqId = requestId += 1
        saveConfig({
          allow_ip: this.formatIpList(allow_ip),
          notify_url
        }).then(() => {
          reqId === requestId && this.$message.success('配置保存成功!')
        })
      }, 2000),
      formatIpList(ipStr) {
        return ipStr.split(/\n/).map(i => i.trim())
      }
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
        padding: 0 16px 16px 16px;
        font-weight: 400;
        .label {
          color: #999999;
        }
        .value {
          color: #1A1A1A;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          justify-content: flex-end;
          display: flex;
          align-items: center;
          flex: 1;
          & .iconfont {
            color: #1F78FF;
            font-size: 16px;
          }
          .el-input, .el-textarea {
            width: 320px;
          }
        }
        &.textarea-item{
          min-height: 52px;
          height: initial;
          align-items: flex-start;
          & .label {
            line-height: 32px;
          }
          ::v-deep textarea {
            &::-webkit-scrollbar {
              width: 12px;
            }
            &::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, .1);
              border-radius: 6px;
              border: 3px solid #fff;
            }
          }
        }
      }
    }
  }
</style>
