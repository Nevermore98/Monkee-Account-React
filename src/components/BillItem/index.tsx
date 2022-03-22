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
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  }
  // 添加账单时，bill.bills 长度变化，触发当日收支总和计算。
  useEffect(() => {
    // 初始化传入的 bill 内的 bills 数组内数据项，过滤出支出和收入。
    const _expense = bill.bills
      .filter((i) => i.pay_type === 1)
      .reduce((curr, item) => {
        curr += Number(item.amount)
        return curr
      }, 0)
    setExpense(_expense)

    const _income = bill.bills
      .filter((i) => i.pay_type === 2)
      .reduce((curr, item) => {
        curr += Number(item.amount)
        return curr
      }, 0)
    setIncome(_income)
  }, [bill.bills])

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
      {bill.bills
        .sort((a, b) => Number(b.date) - Number(a.date))
        .map((item: DayBillItem) => (
          <Cell
            className={s.billItem}
            center
            key={item.id}
            onClick={() => goToDetail(item)}
            title={item.type_name}
            label={`${dayjs(Number(item.date)).format('HH:mm')}${
              item.remark ? ' | ' + item.remark : ''
            }`}
            icon={
              //  只有再包裹一层 <></>，初始的类名 rv-cell__left-icon 才变为自定义的类名
              <>
                <div
                  className={cx({
                    [s.iconWrap]: true,
                    [s.expenseIcon]: item.pay_type === 1,
                    [s.incomeIcon]: item.pay_type === 2
                  })}
                >
                  <CustomIcon name={(typeMap as TypeMap)[item.type_id!].icon} />
                </div>
              </>
            }
          >
            <span
              className={cx(item.pay_type === 1 ? s.expenseText : s.incomeText)}
            >
              {`${item.pay_type === 1 ? '-' : '+'}${Number(
                item.amount!
              ).toFixed(2)}`}
            </span>
          </Cell>
        ))}
    </div>
  )
}

export default BillItem
