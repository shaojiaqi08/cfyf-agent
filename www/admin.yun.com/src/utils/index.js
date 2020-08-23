import store from "@/store";

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
/**
 * 节流函数
 * @param event
 * @param time
 * @returns {Function}
 */
export const throttle = (event, time) => {
    let pre = 0
    let timer = null
    return function (...args) {
        if (Date.now() - pre > time) {
            clearTimeout(timer)
            timer = null
            pre = Date.now()
            event.apply(this, args)
        } else if (!timer) {
            timer = setTimeout(() => {
                event.apply(this, args)
            }, time)
        }
    }
}
export function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object)
}

export const downloadFrameA = (url, filename, method = 'get') => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        const userInfo = store.state.users.userInfo
        xhr.setRequestHeader('Cfyf-Authorization', userInfo.token)
        xhr.setRequestHeader('Agent-Authorization', userInfo.agent_token)
        xhr.responseType = 'blob'
        xhr.onload = function (e) {
            if (this.status === 200) {
                let blob = this.response
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename)
                } else {
                    let a = document.createElement('a')
                    let url = createObjectURL(blob)
                    a.href = url
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(a)
                }
                resolve(this.response)
            } else {
                reject(e)
            }
        }
        xhr.onerror = function(e) {
            reject(e)
        }
        xhr.send()
    })
}