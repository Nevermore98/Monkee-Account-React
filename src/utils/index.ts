import axios from './axios'
import { baseUrl } from '@/config'
const MODE = import.meta.env.MODE // 环境变量

export const get = axios.get
export const post = axios.post
export const patch = axios.patch
export const put = axios.put
// export const delete = axios.delete 严格模式无法使用 delete

// 直接操作 DOM 实现切换数字键盘确认键颜色
export const changeConfirmButtonColor = (type: string) => {
  const button: HTMLElement | null = document.querySelector('.rv-key--blue')
  if (button) {
    if (type === 'expense') {
      button.style.background = '#39be77'
    } else {
      button.style.background = '#ecbe25'
    }
  }
}

export const imgUrlTrans = (url: string) => {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = `${
      MODE == 'development'
        ? 'https://monkee.online/account-react-server'
        : baseUrl
    }${url}`
    return url
  }
}

// 收支种类与图片的映射
export const typeMap = {
  1: {
    icon: 'icon-food'
  },
  2: {
    icon: 'icon-clothes'
  },
  3: {
    icon: 'icon-traffic'
  },
  4: {
    icon: 'icon-daily-consumption'
  },
  5: {
    icon: 'icon-shopping'
  },
  6: {
    icon: 'icon-education'
  },
  7: {
    icon: 'icon-medication'
  },
  8: {
    icon: 'icon-travel'
  },
  9: {
    icon: 'icon-interpersonal'
  },
  10: {
    icon: 'icon-other-expense'
  },
  11: {
    icon: 'icon-salary'
  },
  12: {
    icon: 'icon-bonus'
  },
  13: {
    icon: 'icon-transfer'
  },
  14: {
    icon: 'icon-financial'
  },
  15: {
    icon: 'icon-refund'
  },
  16: {
    icon: 'icon-other-income'
  }
}

export const REFRESH_STATE = {
  normal: 0, // 普通
  pull: 1, // 下拉刷新（未满足刷新条件）
  drop: 2, // 释放立即刷新（满足刷新条件）
  loading: 3, // 加载中
  success: 4, // 加载成功
  failure: 5 // 加载失败
}

export const LOAD_STATE = {
  normal: 0, // 普通
  abort: 1, // 中止
  loading: 2, // 加载中
  success: 3, // 加载成功
  failure: 4, // 加载失败
  complete: 5 // 加载完成（无新数据）
}
