<template>
    <el-tooltip :disabled="!textOverFlow"
                :content="tipsContent"
                placement="top"
                :open-delay="500"
                :enterable="false">
        <div class="side-filter-list-item" ref="listItem">
            <slot></slot>
        </div>
    </el-tooltip>
</template>

<script>
    export default {
        name: 'side-filter-list-item',
        props: {
            tipsContent: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                textOverFlow: false
            }
        },
        methods: {
            check() {
                const target = this.$refs.listItem
                const {offsetWidth, scrollWidth} = target
                this.textOverFlow = scrollWidth > offsetWidth
            }
        },
        mounted() {
            this.check()
            this.$refs.listItem.addEventListener('resize', () => {
                this.check()
            })
        }
    }
</script>

<style scoped lang="scss">
    .side-filter-list-item{
        width: 100%;
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>