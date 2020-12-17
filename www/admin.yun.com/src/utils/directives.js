import Vue from 'vue';
import store from '@/store';
import { debounce } from '@/utils';

// 权限隐藏
Vue.directive('allowed', {
  insert(el, binding) {
    let permissions = store.state.userInfo.permissions
    // 判断权限
    if (Array.isArray(permissions) && permissions.length > 0) {
      let allow = binding.value.some(item => {
        return permissions.includes(item)
      })
      if (!allow) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
})

// 全局隐私隐藏
Vue.directive('privacy', {
  inserted: function (el) {
    let permissions = store.state.userInfo.permissions
    if (!permissions.includes('check-privacy')) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})

// 数字保留位数格式
// eg: v-toFixed:[2]="num" // 保留两位数
Vue.directive('toFixed', {
  inserted(el, binding) {
    let dotNum = binding.arg
    if (!binding.value) {
      el.innerHTML = ''
    } else {
      el.innerHTML = parseFloat(parseFloat(binding.value).toFixed(dotNum))
      // console.log(parseFloat(parseFloat(binding.value).toFixed(dotNum)))
    }
  }
})

Vue.directive('phone-hidden', {
  inserted: function (el, binding) {
    let str = `${binding.value}`
    if (str && str.length === 11) {
      str = `${str.substr(0, 3)}****${str.substr(7)}`
    }
    el.innerHTML = str
  }
})

Vue.directive('table-infinite-scroll', {
  inserted(el, binding) {
    const scrollWrap = el.querySelector('.el-table__body-wrapper')
    const scrollHandle = debounce(() => {
      const {scrollHeight, scrollTop, offsetHeight} = scrollWrap
      if (scrollHeight > offsetHeight && offsetHeight + scrollTop >= scrollHeight) {
        binding.value(binding.arg)
      }
    }, 300)
    scrollWrap.addEventListener('scroll', scrollHandle)
  }
})
