/**
 * 不足十位补零
 * @param m
 * @returns {string}
 */
function add0(m) {
  return m < 10 ? '0' + m : m
}

/**
 * mm:ss
 * @param duration
 * @returns {string}
 */
const formatMediaTime = duration => {
  let min = Math.floor(duration / 60)
  let second = duration - min * 60
  min = add0(min)
  second = add0(second)
  return min + ':' + second
}
/**
 * hh:mm:ss
 * @param timestamp
 * @returns {string}
 */
const timeTohhmmss = timestamp => {
  let time = timestamp ? new Date(timestamp) : new Date()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return add0(h) + ':' + add0(mm) + ':' + add0(s)
}
/**
 * hh:mm
 * @param timestamp
 * @returns {string}
 */
const timeTohhmm = timestamp => {
  let time = timestamp ? new Date(timestamp) : new Date()
  let h = time.getHours()
  let mm = time.getMinutes()
  return add0(h) + ':' + add0(mm)
}

/**
 * yy年mm月dd日 星期xx
 * @returns {string}
 */
const getTodayDate = () => {
  let now = new Date()
  let yy = now.getFullYear()
  let mm = now.getMonth() + 1
  let dd = now.getDate()
  let day = []
  day[0] = '星期日'
  day[1] = '星期一'
  day[2] = '星期二'
  day[3] = '星期三'
  day[4] = '星期四'
  day[5] = '星期五'
  day[6] = '星期六'
  return (yy + '年' + mm + '月' + dd + '日 ' + day[now.getDay()])
}
/**
 * mm月dd日
 * @returns {string}
 */
const getMonthDay = (timestamp) => {
  let now = timestamp ? new Date(timestamp) : new Date()
  let mm = now.getMonth() + 1
  let dd = now.getDate()
  return (mm + '月' + add0(dd) + '日')
}
/**
 * mm-dd
 * @returns {string}
 */
const formatMonthDay = (timestamp, separator = '-') => {
  let now = timestamp ? new Date(timestamp) : new Date()
  let mm = now.getMonth() + 1
  let dd = now.getDate()
  return [mm, dd].map(add0).join(separator)
}
/**
 * y-m-d h:mm:s
 * @param timestamp
 * @returns {string}
 */
const timestampToCommonDate = timestamp => {
  let time = new Date(timestamp)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}
/**
 * yy/mm/dd hh:mm:ss
 * @param date
 * @returns {string}
 */
const formatTime = (date, separator = '/') => {
  let time = new Date(date)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  const t1 = [year, month, day].map(add0).join(separator)
  const t2 = [hour, minute, second].map(add0).join(':')
  return `${t1} ${t2}`
}
/**
 * yy/mm/dd
 * @param date
 * @returns {string}
 */
const formatYYMMDD = (date, separator = '') => {
  let time = date ? new Date(date) : new Date()
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const t1 = [year, month, day].map(add0).join(separator)
  return `${t1}`
}
/**
 * yy-mm-dd hh:mm:ss
 * @param date
 * @returns {string}
 */
const formatTimeTwo = date => {
  let time = date ? new Date(date) : new Date()
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  const t1 = [year, month, day].map(add0).join('-')
  const t2 = [hour, minute, second].map(add0).join(':')
  return `${t1} ${t2}`
}

const dateFormatTimestamp = DATE => {
  return new Date(DATE).setHours(0, 0, 0, 0)
}
/**
 * 获取时间个性
 * @param str
 * @returns {string}
 */
const getTimeInfo = str => {
  if (!str) return ''
  const date = new Date(str)
  const time = new Date().getTime() - date.getTime()
  if (time < 0) {
    return '现在'
  } else if (time / 1000 < 60) {
    return '刚刚'
  } else if ((time / 60000) < 60) {
    return parseInt((time / 60000)) + '分钟前'
  } else if ((time / 3600000) < 24) {
    return parseInt(time / 3600000) + '小时前'
  } else if ((time / 86400000) < 31) {
    return parseInt(time / 86400000) + '天前'
  } else if ((time / 2592000000) < 12) {
    return parseInt(time / 2592000000) + '月前'
  } else {
    return parseInt(time / 31536000000) + '年前'
  }
}

const seckillCountdown = timer => {
  let deadLine = timer
  let newData = new Date().getTime()
  let rightTime = deadLine - newData
  let dd = '00'
  let hh = '00'
  let mm = '00'
  let ss = '00'
  if (rightTime > 0) {
    dd = Math.floor(rightTime / 1000 / 60 / 60 / 24)
    hh = Math.floor((rightTime / 1000 / 60 / 60) % 24)
    mm = Math.floor((rightTime / 1000 / 60) % 60)
    ss = Math.floor((rightTime / 1000) % 60)
    hh = add0(parseInt(hh))
    mm = add0(parseInt(mm))
    ss = add0(parseInt(ss))
  }
  let secKill = dd + '天' + hh + '小时' + mm + '分' + ss + '秒'
  return Object.assign({}, {
    dd,
    hh,
    mm,
    ss,
    secKill
  })
}
const yesterdayDate = currentDate => {
  return new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
}
const tomorrowDate = currentDate => {
  return new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
}

const nDayAgo = (t, n) => {
  return new Date(t - n * 24 * 60 * 60 * 1000)
}

const nDayLater = (t, n) => {
  return new Date(t + n * 24 * 60 * 60 * 1000)
}

/**
 * @description: 获取上一个月从一号开始
 */
const getCurTimePrevMonth = (timestamp = Date.now(), seperator = '-') => {
  let curDate = new Date(timestamp)
  let curMonth = curDate.getMonth() + 1
  let curYear = curDate.getFullYear()
  let year = ''
  let month = ''
  if (curMonth === 1) {
    year = curYear - 1
    month = 12
  } else {
    year = curYear
    month = curMonth - 1
  }
  let prevTimeStamp = new Date(`${year}${seperator}${month}${seperator}01`).getTime()
  return prevTimeStamp
}

/**
 * y?m?d
 * @param timestamp
 * @returns {string}
 */
const formatYMD = (timestamp, seperator = '-') => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = add0(date.getMonth() + 1)
  const day = add0(date.getDate())
  return `${year}${seperator}${month}${seperator}${day}`
}

/**
 * 解析时间戳
 * @param date
 * @returns {string}
 */
const parseTimeStamp = date => {
  let time = date ? new Date(date) : new Date()
  const year = time.getFullYear()
  const month = add0(time.getMonth() + 1)
  const day = add0(time.getDate())
  const hour = add0(time.getHours())
  const minute = add0(time.getMinutes())
  const second = add0(time.getSeconds())
  return {
    year, month, day, hour, minute, second
  }
}

const getMonthStartAndEnd = (month = 1) => {
  const year = new Date().getFullYear()
  const endDate = new Date(year, month, 0).getDate()
  const start = `${String(month).padStart(2, 0)}01`
  const end = `${String(month).padStart(2, 0)}${endDate}`
  return [start, end]
}

// 解析日期字符串 eg: 20200426 || 2020-04-26 12:13:14 返回 ymd hms 解析对象
export const parseDateStr = (str, separator = '') => {
  if (!str) {
    return {}
  }
  const patt = /(\d{4})\D?(\d{2})\D?(\d{2})\D?(\d{2})?\D?(\d{2})?\D?(\d{2})?/.exec(str)
  let result = {
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null,
    ymdStr: null
  }
  if (patt) {
    for (let key in patt) {
      if (!isNaN(key)) {
        switch (key) {
          case '1': {
            result['year'] = patt[key]
            break
          }
          case '2': {
            result['month'] = patt[key]
            break
          }
          case '3': {
            result['day'] = patt[key]
            break
          }
          case '4': {
            result['hour'] = patt[key]
            break
          }
          case '5': {
            result['minute'] = patt[key]
            break
          }
          case '6': {
            result['second'] = patt[key]
            break
          }
        }
      }
    }
  }
  let { year, month, day } = result
  if (year && month && day) {
    result['ymdStr'] = `${year}${separator}${month}${separator}${day}`
  }
  return result
}
/**
 * 日期格式化
 * @method formateDate
 * @param {Date|String|Number} d Date实例,日期字符,时间戳
 * @param {String} format 格式
 *  格式说明:
 *  y+: 年
 *  M+: 月
 *  d+: 日
 *  h+: 小时(24小时制)
 *  H+: 小时(12小时制)
 *  m+: 分
 *  s+: 秒
 * @param {String} 日期格式化字符
 * */
function formatDate (d, format) {
  if (!(d instanceof Date)) {
    d = new Date(d)
  }
  // 无效date实例
  if (Number.isNaN(d.getTime())) {
    return ''
  }
  const o = {
    'y+': '' + d.getFullYear(),
    'M+': '0' + (d.getMonth() + 1),
    'd+': '0' + d.getDate(),
    'h+': '0' + d.getHours(),
    'H+': '0' + d.getHours() > 12 ? 12 - d.getHours() : d.getHours(),
    'm+': '0' + d.getMinutes(),
    's+': '0' + d.getSeconds()
  }
  Object.keys(o).forEach(exp => {
    const reg = new RegExp(exp)
    format = format.replace(reg, (matchStr) => {
      const curVal = o[exp]
      return curVal.slice(-Math.max(exp === 'y+' ? 0 : curVal.length - 1, matchStr.length))
    })
  })
  return format
}

export {
  formatDate,
  parseTimeStamp,
  getMonthDay,
  getCurTimePrevMonth,
  formatMediaTime,
  timeTohhmmss,
  timeTohhmm,
  getTodayDate,
  formatTime,
  getTimeInfo,
  seckillCountdown,
  formatYMD,
  dateFormatTimestamp,
  yesterdayDate,
  tomorrowDate,
  nDayAgo,
  nDayLater,
  timestampToCommonDate,
  formatTimeTwo,
  formatMonthDay,
  formatYYMMDD,
  getMonthStartAndEnd
}
