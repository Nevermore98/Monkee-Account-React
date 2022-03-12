import { useEffect, useState } from 'react'
import { Toast } from 'react-vant'

const useInput = () => {
  const [amount, setAmount] = useState('') // 账单金额
  const handleInput = (inputValue: '.' | string) => {
    // 处理数字
    if (inputValue !== '.') {
      // 处理0
      if (inputValue === '0') {
        // 首位为 0，且不包含小数点，则重复输入 0 返回原值不变
        if (amount.substring(0, 1) === '0' && amount.indexOf('.') === -1) {
          setAmount(amount)
          return
        }
      }
      // 处理非零数字
      if (inputValue !== '0') {
        if (amount.substring(0, 1) === '0' && amount.indexOf('.') === -1) {
          setAmount(inputValue.toString())
          return
        }
      }
      // 保留小数点前六位
      if (amount.length >= 6 && amount.indexOf('.') === -1) {
        Toast({
          message: '金额不能大于1,000,000',
          position: 'bottom'
        })
        setAmount(amount)
        return
      }
      // 保留小数点后两位
      if (amount.includes('.') && amount.split('.')[1].length >= 2) {
        Toast({
          message: '仅保留小数点后两位',
          position: 'bottom'
        })
        setAmount(amount)
        return
      }
      setAmount(amount + inputValue)
      return
      // return (amount += inputValue)
    }
    // 处理小数点
    if (inputValue === '.') {
      // 首位输入小数点，返回 '0.'
      if (amount.substring(0, 1) === '') {
        setAmount('0.')
        return
        // return (amount = '0.')
      }
      // 已存在小数点，则重复输入小数点返回原值不变
      if (amount.includes('.')) {
        setAmount(amount)
        return
      }
      setAmount(amount + '.')
      return
    }
  }

  const handleDelete = () => {
    const _amount = amount.slice(0, amount.length - 1)
    setAmount(_amount)
  }

  return { amount, setAmount, handleInput, handleDelete }
}
export default useInput
