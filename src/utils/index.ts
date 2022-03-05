import axios from './axios'

export const get = axios.get

export const post = axios.post
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
