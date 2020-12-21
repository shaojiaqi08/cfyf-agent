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
        },
        cellFormatter(row, column, cellValue, index) { // eslint-disable-line
            return (cellValue || cellValue === 0) ? cellValue : '-'
        }
    },
    directives: {
        focus: {
            inserted(el) {
                el.getElementsByTagName('input')[0].focus()
            }
        }
    },
}
