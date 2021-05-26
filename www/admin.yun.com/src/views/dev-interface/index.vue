<template>
  <div>
    <div class="dev-interface-container" v-loading="loading">
      <div class="header">
        开发对接信息
      </div>
      <div class="body">
        <div class="item" style="padding-bottom: 0">
          <div class="label">创富云服技术对接文档</div>
          <div class="value">
            <el-link
                icon="iconfont iconxiao16_lianjie mr4"
                type="primary"
                class="mr16"
                :underline="false"
                target="_blank"
                href="https://www.yuque.com/books/share/bbf1a392-e32d-4162-8572-24971e1c7be5?#">对接文档</el-link>
            <span>
              密码：dokh<i
                title="点击复制密码"
                class="iconfont iconxiao16_fuzhi ml4"
                style="cursor: pointer"
                @click="copyDocPwd"></i></span>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="item">
          <div class="label">机构 ACCESS KEY</div>
          <div class="value">
            <text-hidden-ellipsis align="right" width="380px" :popoverTip="data.access_key"></text-hidden-ellipsis>
          </div>
        </div>
        <div class="item">
          <div class="label">机构 ACCESS SECRET</div>
          <div class="value" v-if="data.access_secret">
            <text-hidden-ellipsis align="right" width="380px" :popoverTip="data.access_secret"></text-hidden-ellipsis>
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
            <text-hidden-ellipsis align="right" width="380px" :popoverTip="data.des_sign_key"></text-hidden-ellipsis>
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
          <div class="label">推送开关</div>
          <el-switch @change="save" v-model="data.is_enable_notify" :active-value="1" :inactive-value="0"></el-switch>
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
      copyDocPwd() {
        this.$copyText('dokh').then(() => {
          this.$message.success('技术文档密码已复制到粘贴板。')
        })
      },
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
        let { allow_ip, notify_url, is_enable_notify } = this.data
        allow_ip = allow_ip || ''
        notify_url = notify_url || ''
        const reqId = requestId += 1
        const ips = this.formatIpList(allow_ip)
        saveConfig({
          allow_ip: ips,
          notify_url,
          is_enable_notify
        }).then(() => {
          if (reqId === requestId) {
            this.$message.success('配置保存成功!')
            // 重置ip框格式
            this.data.allow_ip = ips.join('\n')
          }
        })
      }, 2000),
      formatIpList(ipStr) {
        return ipStr.split(/\n/).map(i => i.trim()).filter(i => i)
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
      ::v-deep .el-divider {
        margin: 0 0 16px 0;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
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
