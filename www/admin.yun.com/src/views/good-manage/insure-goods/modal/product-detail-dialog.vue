<template>
    <el-dialog :visible="visible" custom-class="dialog" title="" :width="isMobileScreen ? '414px' : '1200px'" @close="closeDialog">
        <iframe :src="iframeSrc" frameborder="0"></iframe>
        <div slot="footer" class="flex-between" v-if="productObj.product_type === 'cps'">
            <div class="switch-wrap">
                <div :class="{ active: isMobileScreen }" @click="changeScreen(true)">
                    <i class="iconfont iconzhong20_shouji"></i>
                </div>
                <div  :class="{ active: !isMobileScreen }" @click="changeScreen(false)">
                    <i class="iconfont iconzhong20_diannao"></i>
                </div>
            </div>
            <div>
                <el-button
                        type="primary"
                        size="small"
                        v-clipboard:success="$emit('copy')"
                        v-clipboard:copy="productObj.share_link"
                        plain
                        @click="copy"><i class="iconfont iconxiao16_fuzhi mr4"></i>复制链接</el-button>
                <el-button
                        type="primary"
                        @click="$emit('share', productObj)"><i class="iconfont iconxiao16_fasong mr4"></i>转发客户</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'product-detail',
        props: {
            visible: Boolean,
            productObj: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            iframeSrc() {
                return this.productObj.share_link || this.productObj.web_url
            }
        },
        data() {
            return {
                isMobileScreen: true
            }
        },
        methods: {
            closeDialog() {
                this.$emit('update:visible', false)
                this.$emit('close')
                this.isMobileScreen = true
            },
            changeScreen(v) {
                this.isMobileScreen = v
            },
            copy() {
                this.$copyText(this.iframeSrc).then(() => {
                    this.$message.success('链接已经复制到剪贴板')
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .dialog {
        display: flex;
        height: 800px;
        flex-direction: column;
        transition: width ease .3s;
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body{
            max-height: 100vh !important;
            padding: 9px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .el-dialog__footer{
            margin-top: 11px;
            padding: 0 9px 19px 9px;
            .switch-wrap {
                width: 60px;
                height: 32px;
                background-color: #e6e6e6;
                border-radius: 4px;
                display: flex;
                padding: 0 4px;
                box-sizing: border-box;
                justify-content: space-between;
                align-items: center;
                & > div {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    &.active {
                        background-color: #fff;
                        border-radius: 2px;
                    }
                    &:hover {
                        color: #1F78FF;
                    }
                }
            }
        }
        iframe {
            width: 100%;
            flex: 1;
            background-color: #D8D8D8;
            border-radius: 2px;
        }
    }
</style>
