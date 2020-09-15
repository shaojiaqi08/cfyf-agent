export default {
    methods: {
        // dir 0: 左 1: 右
        scrollTo(dir) {
            const { scrollTranslateX: oldTranX } = this;
            const el = this.$refs.dataRow;
            const { offsetWidth } = el;
            const { offsetWidth: warpWidth } = el.querySelector(".scroll-wrap");
            let newTranX = oldTranX + (dir ? -100 : 100);
            if (dir) {
                const limitX = offsetWidth - warpWidth;
                newTranX = Math.max(newTranX, limitX);
                this.scrol2Rvisible = newTranX !== limitX;
                this.scrol2Lvisible = true;
            } else {
                newTranX = Math.min(0, newTranX);
                this.scrol2Lvisible = !!newTranX;
                this.scrol2Rvisible = true;
            }
            this.scrollTranslateX = newTranX;
        },
        // 检测数据栏是否需要滚动
        checkNeedScroll() {
            const { offsetWidth } = this.$refs.dataRow;
            const { offsetWidth: warpWidth } = this.$refs.dataRow.querySelector(
                '.scroll-wrap'
            );
            if (warpWidth - 16 > offsetWidth) {
                this.scrol2Lvisible = false;
                this.scrol2Rvisible = true;
                this.scrollTranslateX = 0;
            } else {
                this.scrol2Lvisible = false;
                this.scrol2Rvisible = false;
                this.scrollTranslateX = 0;
            }
        }
    },
    mounted() {
        this.checkNeedScroll();
        window.addEventListener("resize", this.checkNeedScroll);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.checkNeedScroll);
    }
}