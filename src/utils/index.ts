import axios from './axios'
import { baseUrl } from '@/config'
const MODE = import.meta.env.MODE // 环境变量

export const get = axios.get

export const post = axios.post

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
      MODE == 'development' ? 'http://api.chennick.wang' : baseUrl
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
