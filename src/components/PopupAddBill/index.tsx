import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import {
  Button,
  Popup,
  Calendar,
  Field,
  NumberKeyboard,
  Toast
} from 'react-vant'
import { Cross } from '@react-vant/icons'
import s from './style.module.less'
import CustomIcon from '../CustomIcon'
import dayjs from 'dayjs'
import { CalendarValue } from 'react-vant/es/calendar/PropsType'
import { get, post, typeMap } from '@/utils'
import { BillType, CategoryIcon, TypeMap } from '@/api/bill'
import useInput from '@/hooks/useInput'

const PopupAddBill = forwardRef((props, ref: any) => {
  const { amount, setAmount, handleInput, handleDelete } = useInput()
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('expense')
  const [calendarVisible, setCalendarVisible] = useState(false)
  // CalendarValue 类型是 Date[]，属实给整不会了
  const [selectedDate, setSelectedDate] = useState(new Date() as CalendarValue)
  const formattedDate = useMemo(
    () => dayjs(selectedDate as Date).format('MM-DD'),
    [selectedDate]
  )
  // const maxDate = new Date()
  const [maxDate, setMaxDate] = useState(new Date())
  const minDate = new Date(new Date().setFullYear(maxDate.getFullYear() - 10))
  const [billAmount, setBillAmount] = useState('')
  const [remark, setRemark] = useState('')
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [incomeCategories, setIncomeCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<CategoryIcon>({
    id: 0,
    name: ''
  })

  // 直接操作 DOM 实现切换确认键颜色
  const changeConfirmButtonColor = (type: string) => {
    const button: HTMLElement = document.querySelector('.rv-key--blue')! // 一定存在该节点
    if (type === 'expense') {
      button.style.background = '#39be77'
    } else {
      button.style.background = '#ecbe25'
    }
  }
  // changeConfirmButtonColor('expense')
  /**
   * useEffect async 函数
   * https://zhuanlan.zhihu.com/p/65773322
   */
  useEffect(() => {
    const fetchCategoryData = async () => {
      const {
        data: { list }
      } = await get('/api/type/list')
      const expense = list.filter((i: BillType) => i.type === '1') // 支出类型
      const income = list.filter((i: BillType) => i.type === '2') // 收入类型
      setExpense(expense)
      setIncome(income)
    }
    fetchCategoryData()
  }, [])

  const closePopAdd = () => {
    setVisible(false)
    changeConfirmButtonColor('expense')
    // 关闭后不会自动重新渲染，需要自己手动设置
    setType('expense')
    setSelectedDate(new Date())
    setAmount('')
    setSelectedCategory({ id: 0, name: '' })
    setRemark('')
  }

  const changeType = (type: string) => {
    setType(type)
    setSelectedCategory({ id: 0, name: '' })
    changeConfirmButtonColor(type)
  }

  const chooseDate = (value: CalendarValue) => {
    setCalendarVisible(false)
    setSelectedDate(value)
    console.log(selectedDate)
  }

  const chooseCategory = (item: CategoryIcon) => {
    setSelectedCategory(item)
  }

  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.info('请输入具体金额')
      return
    }
    if (selectedCategory.id === 0) {
      Toast.info('请选择收支类型')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: selectedCategory.id,
      type_name: selectedCategory.name,
      date: (dayjs(selectedDate as Date).unix() * 1000).toString(),
      pay_type: type == 'expense' ? 1 : 2,
      remark: remark || ''
    }
    const result = await post('/api/bill/add', params)
    setAmount('')
    setType('expense')
    setSelectedCategory({ id: 0, name: '' })
    setSelectedDate(new Date())
    setRemark('')
    Toast.info('添加成功')
    setVisible(false)
    // if (props.onReload) props.onReload()
  }

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

  return (
    <Popup
      visible={visible}
      round
      position="bottom"
      onClose={() => closePopAdd()}
    >
      <div className={s.addWrap}>
        {/* 添加账单头部 */}
        <header className={s.header}>
          <span className={s.closeWrap}>
            <Cross onClick={() => setVisible(false)} />
          </span>
        </header>
        {/* 筛选类型和日期 */}
        <div className={s.filterWrap}>
          <div className={s.type}>
            <span
              onClick={() => changeType('expense')}
              className={cx(s.expense, { [s.active]: type === 'expense' })}
            >
              支出
            </span>
            <span
              onClick={() => changeType('income')}
              className={cx(s.income, { [s.active]: type === 'income' })}
            >
              支出
            </span>
          </div>
          <Button className={s.date} onClick={() => setCalendarVisible(true)}>
            <span>{formattedDate}</span>
            <CustomIcon name="icon-sort-down" />
          </Button>
        </div>
        {/* 日历弹出层 */}
        <Calendar
          showConfirm={false}
          visible={calendarVisible}
          onClose={() => setCalendarVisible(false)}
          // onConfirm 接受 CalendarValue 类型
          onConfirm={(v) => chooseDate(v)}
          minDate={minDate}
          maxDate={maxDate}
          lazyRender
          rowHeight={60}
        ></Calendar>
        {/* 金额显示框 */}
        <div className={s.numberPad}>
          <span className={s.prefix}>￥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        {/* 收支类型图标 */}
        <div className={s.typeWrap}>
          <div className={s.typeBody}>
            {(type === 'expense' ? expense : income).map(
              (item: CategoryIcon) => (
                <Button
                  className={s.typeItem}
                  onClick={() => chooseCategory(item)}
                >
                  <div
                    className={cx({
                      [s.iconWrap]: true,
                      [s.expense]: type === 'expense',
                      [s.income]: type === 'income',
                      [s.active]: selectedCategory.id === item.id
                    })}
                  >
                    <CustomIcon name={(typeMap as TypeMap)[item.id].icon} />
                  </div>
                  <div>{item.name}</div>
                </Button>
              )
            )}
          </div>
        </div>
        {/* 备注输入框 */}
        <div className={s.remark}>
          <Field
            value={remark}
            onChange={setRemark}
            label="备注"
            placeholder="添加记账备注"
            maxlength={15}
            clearable
            showWordLimit
          />
        </div>
        {/* 数字键盘 */}
        <NumberKeyboard
          theme="custom"
          visible={true}
          closeButtonText="确定"
          extraKey="."
          onInput={(v) => handleInput(v)}
          onDelete={handleDelete}
          onClose={addBill}
        />
      </div>
    </Popup>
  )
})

export default PopupAddBill
