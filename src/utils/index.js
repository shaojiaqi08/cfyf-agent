export const a = { a: "ddd" };

/**
 * 防抖函数 flag为true 立即执行
 * @param event
 * @param time
 * @param flag
 * @returns {Function}
 */
export const debounce = (event, time, flag) => {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        if (flag && !timer) {
            event.apply(this, args)
        }
        timer = setTimeout(() => {
            event.apply(this, args)
        }, time)
    }
}