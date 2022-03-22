import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import {
  Button,
  Popup,
  Calendar,
  Field,
  NumberKeyboard,
  Toast,
  ConfigProvider
} from 'react-vant'
import type { CalendarInstance } from 'react-vant'
import { Cross } from '@react-vant/icons'
import s from './style.module.less'
import CustomIcon from '../CustomIcon'
import dayjs from 'dayjs'
import { changeConfirmButtonColor, get, post, typeMap } from '@/utils'
import {
  BillType,
  CategoryIcon,
  DayBillItem,
  ReqDetail,
  TypeMap
} from '@/api/bill'
import useInput from '@/hooks/useInput'

interface Props {
  detail?: ReqDetail
  onReload?: () => void
}

const PopupAddBill = forwardRef((props: Props, ref: any) => {
  const { amount, setAmount, handleInput, handleDelete } = useInput()
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('expense')
  const [calendarVisible, setCalendarVisible] = useState(false)
  // CalendarValue 类型是 Date[]，属实给整不会了
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const formattedDate = useMemo(
    () => dayjs(selectedDate).format('MM-DD'),
    [selectedDate]
  )
  const maxDate = new Date()
  const minDate = new Date(new Date().setFullYear(maxDate.getFullYear() - 2))
  const calendarRef = useRef<CalendarInstance>(null)
  // const minDate = new Date(2021, 5, 1)
  // const maxDate = new Date()

  const [remark, setRemark] = useState('')
  const [expense, setExpense] = useState([]) // 支出类型数组
  const [income, setIncome] = useState([]) // 收入类型数组
  const [selectedCategory, setSelectedCategory] = useState<CategoryIcon>({
    id: 0,
    name: ''
  })
  const { detail } = props
  const detailId = detail && detail.id // 外部传进来的账单详情 id

  // 初始化添加账单弹出层
  const initAddBill = () => {
    setVisible(false)
    // 添加账单时，数字键盘确认键颜色默认为支出颜色
    changeConfirmButtonColor('expense')
    // 关闭后不会自动重新渲染，需要自己手动设置
    setType('expense')
    setSelectedDate(dayjs())
    setAmount('')
    setSelectedCategory({ id: 0, name: '' })
    setRemark('')
  }
  // 初始化编辑账单弹出层
  const initEditBill = () => {
    setType(detail?.pay_type === 1 ? 'expense' : 'income')
    setSelectedCategory({ id: detail?.type_id!, name: detail?.type_name! })
    setRemark(detail?.remark!)
    setAmount(detail?.amount!)
    // @ts-ignore
    setSelectedDate(dayjs(Number(detail?.date)).$d)

    changeConfirmButtonColor(detail?.pay_type === 1 ? 'expense' : 'income')
  }
  // 编辑账单副作用
  useEffect(() => {
    if (detailId) {
      // 进入编辑账单页，设置日历的选中为该账单的记账日期
      // @ts-ignore
      calendarRef.current?.reset(dayjs(Number(detail?.date)).$d)
      initEditBill()
    }
  }, [detail])

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
    // // 没有 id 的情况下，说明是新建账单。
    // if (!detail.id) {
    //   setCurrentType(_expense[0])
    // }
  }, [])

  const closePopAdd = () => {
    if (detailId) {
      // 编辑账单页，不保存直接关闭弹出层，重设日历选中日期为记账日期
      // @ts-ignore
      calendarRef.current?.reset(dayjs(Number(detail?.date)).$d)
      initEditBill()
    } else {
      initAddBill()
      // 不为编辑账单时，重设日历选中日期为今日日期
      calendarRef.current?.reset()
    }
    setVisible(false)
  }

  const changeType = (type: string) => {
    setType(type)
    setSelectedCategory({ id: 0, name: '' })
    changeConfirmButtonColor(type)
  }

  const chooseDate = (value: any) => {
    setSelectedDate(value)
    setCalendarVisible(false)
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
    const params: DayBillItem = {
      amount: Number(amount).toFixed(2),
      type_id: selectedCategory.id,
      type_name: selectedCategory.name,
      date: String(dayjs(selectedDate).unix() * 1000),
      pay_type: type == 'expense' ? 1 : 2,
      remark: remark || ''
    }
    if (detailId) {
      params.id = detailId
      // 如果有 id 即是在编辑账单详情，需要调用详情更新接口
      const result = await post('/api/bill/update', params)
      Toast.success('修改成功')
    } else {
      const result = await post('/api/bill/add', params)
      setAmount('')
      setType('expense')
      setSelectedCategory({ id: 0, name: '' })
      setSelectedDate(dayjs())
      setRemark('')
      Toast.info('添加成功')
    }
    setVisible(false)
    // 修改完成后重新加载
    if (props.onReload) props.onReload()
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

  // const calendarVars = {
  //   calendarPopupHeight: '62%',
  //   calendarSelectedDayBackgroundColor: '#39be77'
  //   // calendarHeaderTitleHeight: '40px'
  // }

  return (
    <Popup
      visible={visible}
      round
      position="bottom"
      onClose={() => closePopAdd()}
      onClickOverlay={() => closePopAdd()}
    >
      <div className={s.addWrap}>
        {/* 添加账单头部 */}
        <header className={s.header}>
          <div className={s.closeWrap}>
            <Cross onClick={() => setVisible(false)} />
          </div>
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
              收入
            </span>
          </div>
          <Button className={s.date} onClick={() => setCalendarVisible(true)}>
            <span>{formattedDate}</span>
            <CustomIcon name="icon-sort-down" />
          </Button>
        </div>
        {/* 日历弹出层 */}
        {/* <ConfigProvider themeVars={calendarVars}> */}
        {/* 滑动到底部，会出现无法滑动的 bug： https://www.cnblogs.com/xiahj/p/8036419.html */}
        <Calendar
          ref={calendarRef}
          color="#39be77"
          showConfirm={false}
          visible={calendarVisible}
          onClose={() => setCalendarVisible(false)}
          onConfirm={(v) => chooseDate(v)}
          minDate={minDate}
          maxDate={maxDate}
        />

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
                  key={item.id}
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
