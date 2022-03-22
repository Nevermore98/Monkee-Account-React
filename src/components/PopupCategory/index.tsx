import React, { FC, forwardRef, useEffect, useState } from 'react'
import { Popup } from 'react-vant'
import cx from 'classnames'
import { get } from '@/utils'

import s from './style.module.less'
import { BillType } from '@/api/bill'

interface Props {
  ref: any
  onSelect: (item: BillType) => void
}

const PopupCategory: FC<Props> = forwardRef(({ onSelect }, ref: any) => {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(0) // 0 代表全部
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])

  useEffect(() => {
    ;(async () => {
      // 请求标签接口放在弹窗内，这个弹窗可能会被复用，所以请求如果放在外面，会造成代码冗余。
      const {
        data: { list }
      } = await get('/api/type/list')
      // TODO type 修改为 1 | 2
      setExpense(list.filter((i: BillType) => i.type === '1'))
      setIncome(list.filter((i: BillType) => i.type === '2'))
    })()
  }, [])

  if (ref) {
    ref.current = {
      show: () => {
        setVisible(true)
      },
      close: () => {
        setVisible(false)
      }
    }
  }
  const selectType = (item: BillType) => {
    setActive(item.id)
    onSelect(item)
    setVisible(false)
  }

  return (
    <Popup
      visible={visible}
      round
      closeable
      position="bottom"
      title="请选择类型"
      closeIconPosition="top-left"
      onClose={() => {
        setVisible(false)
      }}
    >
      <div className={s.pop}>
        {/* <div className={s.header}></div> */}

        <div className={s.content}>
          <div
            className={cx({ [s.active]: active === 0 }, s.typeItem)}
            onClick={() => selectType({ id: 0 })}
          >
            全部类型
          </div>

          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item: BillType, index) => (
              <p
                key={index}
                onClick={() => selectType(item)}
                className={cx({ [s.active]: active === item.id }, s.typeItem)}
              >
                {item.name}
              </p>
            ))}
          </div>

          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item: BillType, index) => (
              <p
                key={index}
                onClick={() => selectType(item)}
                className={`${s.typeItem} ${cx({
                  [s.active]: active === item.id
                })}`}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  )
})
export default PopupCategory
