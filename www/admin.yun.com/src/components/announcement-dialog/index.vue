<template>
    <el-dialog
        title="公告"
        :visible="visible"
        @close="closeDialog"
        class="announcement-dialog"
        width="600px"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        close-on-press-escape
        v-stop
        append-to-body
    >
        <div v-loading="loading" style="min-height: 110px">
            <div class="ann-title">
                <span>{{data.title}}</span>
            </div>
            <p class="date">{{getCreateDateStr(data.notice_at * 1000)}}</p>
            <div class="content" v-html="data.content"></div>
            <div class="imgs-container" v-if="data.image && data.image.length > 0">
                <el-image fit="cover" :preview-src-list="getPreviewList(item, data.image)" v-for="item in data.image" :key="item.id" :src="item.image_url"></el-image>
            </div>
            <div class="file-container" v-if="data.file_id">
                <el-button icon="el-icon-document" type="text">{{data.file_name}}</el-button>
                <el-link target="_blank" :href="data.file_url.replace('/show/', '/download/')" :underline="false">
                    <el-button type="primary" size="small"><i class="iconfont iconxiao16_xiazai"></i>&nbsp;下载</el-button>
                </el-link>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeDialog">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {timestampToCommonDate, formatTime} from '@/utils/formatTime'
    import { getAnnouncementDetail } from '@/apis/modules'
    export default {
        name: 'announcement-dialog',
        props: {
            id: {
                type: [String, Number],
                default: ''
            },
            visible: Boolean
        },
        data() {
            return {
                loading: false,
                data: {}
            }
        },
        directives: {
            stop: {
                // 给dialog添加阻止冒泡,以防点击了公告dialog消失
                inserted(el) {
                    el.addEventListener('click', e => { e.stopPropagation() })
                }
            }
        },
        methods: {
            getData() {
                this.loading = true
                getAnnouncementDetail({announcement_id: this.id}).then(res => {
                    this.data = res
                }).finally(() => {
                    this.loading = false
                })
            },
            closeDialog() {
                this.data = {}
                this.$emit('update:visible', false)
            },
            // 生成预览图片list
            getPreviewList(cur, data) {
                const arr = [cur.image_url]
                data.forEach(item => {
                    (item.id !== cur.id) && arr.push(item.image_url)
                })
                return arr
            },
            timestampToCommonDate,
            formatTime,
            getCreateDateStr(str) {
                if (!str) return
                const d = new Date(str)
                const curD = new Date()
                const timeGay = (curD - d) / 1000 / 3600 / 24
                const timeStr = timestampToCommonDate(str)
                if (timeGay > 3) {
                    return timeStr.slice(0, 16)
                } else if (timeGay > 2) {
                    return `前天 ${timeStr.slice(11, 16)}`
                } else if (timeGay > 1) {
                    return `昨天 ${timeStr.slice(11, 16)}`
                } else {
                    return `今天 ${timeStr.slice(11, 16)}`
                }
            },
        },
        watch: {
            visible(v) {
                v && this.id && this.getData()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .announcement-dialog {
        font-family:PingFang-SC-Bold,PingFang-SC;
        ::v-deep .el-dialog {
            top: 9vh;
            transform: translateY(0px);
            .el-dialog__header {
                background-color: #fff;
            }
        }
        .el-form .el-form-item{
            margin: 0 !important;
        }

        .el-dialog__body{
            .iconchaoxiao_xiazai_bai{
                font-size: 12px;
            }
            .ann-title{
                display: flex;
                justify-content: space-between;
                line-height: 24px;
                /*height: 24px;*/
                &>span:first-child{
                    font-size:18px;
                    font-family:PingFang-SC-Bold,PingFang-SC;
                    font-weight:bold;
                    color:rgba(51,51,51,1);
                }
                .read-status-block{
                    display: inline-block;
                    text-align: center;
                    line-height: 18px;
                    width:44px;
                    height:20px;
                    margin-right:4px;
                    font-size: 12px;
                    border-radius:4px;
                }
                .no-read{
                    background:rgba(255,237,237,1);
                    border:1px solid rgba(255,81,81,0.1);
                    color:#FF5151;
                }
                .readed{
                    background:rgba(245,245,245,1);
                    border:1px solid rgba(233,233,235,1);
                    color:#999;
                }
            }
            &>p{
                margin: 8px 0 0 0;
                line-height:20px;
            }
            .date{
                font-size:12px;
                font-weight:400;
                color:rgba(153,153,153,1);
            }
            .content{
                font-size:14px;
                font-weight:400;
                color:#333;
            }
            .imgs-container{
                display: flex;
                flex-wrap: wrap;
                margin-top:6px;
                .el-image{
                    height:81px;
                    border-radius:4px;
                    overflow: hidden;
                    background: #f5f5f5;
                    border: 1px solid #e6e6e6;
                    margin-right: 16px;
                    flex-basis: calc(25% - 16px);
                    cursor: pointer;
                    margin-top: 10px;
                }
            }
            .file-container{
                height:64px;
                background:rgba(245,245,245,1);
                border-radius:4px;
                border:1px solid #e6e6e6;
                margin: 16px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px;
                & > ::v-deep .el-button:first-child{
                    cursor: initial;
                    i{
                        color:#979797;
                    }
                    span{
                        color:#333;
                    }
                }
            }
            .customer-container{
                margin-top: 24px;
                &>div{
                    margin-bottom: 8px;
                    span:first-child{
                        font-size:16px;
                        font-weight:bold;
                        color:rgba(51,51,51,1);
                        line-height:24px;
                        margin-right: 8px;
                    }
                    span:last-child{
                        font-size:14px;
                        font-weight:400;
                        color:rgba(153,153,153,1);
                        line-height:20px;
                    }
                }
                .unite-num-container{
                    height: 60px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f5f5f5;
                    padding:0 16px;
                    border:1px solid #e6e6e6;
                    border-radius: 4px;
                    margin: 0 0 8px 0;
                    &>span{
                        font-weight:bold;
                        color:#333;
                        font-size: 14px;
                    }

                    .unite-btn{
                        width: 54px;
                        height: 28px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        span{
                            color:#fff;
                            margin: 0;
                        }
                    }
                }
                ul{
                    list-style: none;
                    background: #f5f5f5;
                    padding:0 16px;
                    border:1px solid #e6e6e6;
                    border-radius: 4px;
                    margin: 0;
                    li{
                        height: 60px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #e6e6e6;
                        &>span{
                            font-weight:bold;
                            color:#333;
                            font-size: 14px;
                        }
                    }
                    li:last-child{
                        border-bottom: none;
                    }
                }
            }
        }
        .dialog-footer{
            text-align: center;
        }
    }
    .hide-close-btn{
        .el-dialog__headerbtn{
            display: none;
        }
    }
</style>
