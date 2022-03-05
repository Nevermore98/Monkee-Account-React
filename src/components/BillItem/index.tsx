import type { DayBillItem, DayBillList, TypeMap } from '@/api/bill'
import { typeMap } from '@/utils'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cell } from 'react-vant'
import CustomIcon from '../CustomIcon'
import s from './style.module.less'
import cx from 'classnames'

type Props = {
  bill: DayBillList
}

const BillItem = (props: Props) => {
  const { bill } = props
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const navigate = useNavigate()

  enum Days {
    '星期一' = 0,
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日'
  }
  // 添加账单时，bill.daily_bill 长度变化，触发当日收支总和计算。
  useEffect(() => {
    // 初始化传入的 bill 内的 daily_bill 数组内数据项，过滤出支出和收入。
    const _expense = bill.daily_bill
      .filter((i) => i.type === 1)
      .reduce((curr, item) => {
        curr += Number(item.amount)
        return curr
      }, 0)
    setExpense(_expense)

    const _income = bill.daily_bill
      .filter((i) => i.type === 2)
      .reduce((curr, item) => {
        curr += Number(item.amount)
        return curr
      }, 0)
    setIncome(_income)

    // 直接操作 DOM 按照收支类型给图标添加不同的背景色
    const icon = document.querySelector('.rv-cell__left-icon') as HTMLElement
    bill.daily_bill.forEach((item) => {
      if (item.type === 1) {
        icon.style.backgroundColor = '#39be77'
      } else {
        icon.style.backgroundColor = '#ecbe25'
      }
    })
  }, [bill.daily_bill])

  // 前往账单详情
  const goToDetail = (item: DayBillItem) => {
    navigate(`/detail?id=${item.id}`)
  }

  return (
    <div className={s.itemWrap}>
      <div className={s.itemHeader}>
        <div>
          {dayjs(bill.date).format('M月D日')}&nbsp;
          {Days[dayjs(bill.date).day()]}
        </div>
        <div className={s.todayTotal}>
          <div>
            <div>出</div>
            {expense.toFixed(2)}
          </div>
          <div>
            <div>入</div>
            {income.toFixed(2)}
          </div>
        </div>
      </div>
      {bill.daily_bill.map((item: DayBillItem) => (
        <Cell
          className={s.billItem}
          center
          key={item.id}
          onClick={() => goToDetail(item)}
          title={item.category_name}
          label={`${dayjs(item.datetime).format('HH:mm')}${
            item.remark ? ' | ' + item.remark : ''
          }`}
          icon={
            /** 只有再包裹一层 div，rv-cell__left-icon 才添加在该 div 上，否则在 svg 上
             *  并且给这个 div 添加其他类名会直接加到 svg 上
             *  无法在 rv-cell__left-icon 额外添加类名？？
             *  */
            <div>
              <CustomIcon name={(typeMap as TypeMap)[item.category_id].icon} />
            </div>
          }
        >
          <span className={cx(item.type === 1 ? s.expenseText : s.incomeText)}>
            {`${item.type == 1 ? '-' : '+'}${item.amount?.toFixed(2)}`}
          </span>
        </Cell>
      ))}
    </div>
  )
}

export default BillItem
