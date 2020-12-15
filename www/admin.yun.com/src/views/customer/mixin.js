export default {
    methods: {
        tableSpan({ row, columnIndex }) {
            if (columnIndex === 0) {
                if (row.rowSpan) {
                    return {
                        rowspan: row.rowSpan,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        }
    }
}
