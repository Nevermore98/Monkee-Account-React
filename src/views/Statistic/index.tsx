import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Progress } from 'react-vant'
import cx from 'classnames'
import dayjs from 'dayjs'
import { get, typeMap } from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import s from './style.module.less'
import { ReqMonthCategoryData, TypeMap } from '@/api/bill'

const Statistic = () => {
  const [curType, setCurType] = useState('expense') // 收入或支出类型
  const [curMonth, setCurMonth] = useState(dayjs().format('YYYY-MM')) // 当前日期：年月
  const [totalExpense, setTotalExpense] = useState(0) // 总支出
  const [totalIncome, setTotalIncome] = useState(0) // 总收入
  const [expenseList, setExpenseList] = useState([]) // 支出数据
  const [incomeList, setIncomeList] = useState([]) // 收入数据
  const dateRef = useRef(null)

  useEffect(() => {
    getMouthBillData()
  }, [curMonth, curType])

  // useEffect(() => {
  //   const set = async () => setPieChart('expense')
  //   set()
  // useEffect(() => {
  //   setPieChart('expense')

  //   changeCurType('expense')
  // }, [])

  // 获取月度账单数据
  const getMouthBillData = async () => {
    try {
      const { data } = await get(`/api/bill/data?date=${curMonth}`)
      setTotalExpense(data.total_expense)
      setTotalIncome(data.total_income)
      // 过滤支出和收入
      const expenseList = data.total_data
        .filter((item: ReqMonthCategoryData) => item.pay_type === 1)
        .sort((a, b) => b.number - a.number)
      const incomeList = data.total_data
        .filter((item: ReqMonthCategoryData) => item.pay_type === 2)
        .sort((a, b) => b.number - a.number)
      setExpenseList(expenseList)
      setIncomeList(incomeList)
    } catch (e) {
      console.log(e)
    } finally {
      setTimeout(() => {
        setPieChart('expense')
        console.log(expenseList)
      }, 1000)
    }

    // changeCurType('expense')
  }

  const selectMonth = (value: any) => {
    setCurMonth(value)
  }
  // 计算属性：当前收支类型对应的总金额（用于控制是否显示收支构成或去记账按钮）
  const curTotal = useMemo(
    () => (curType === 'expense' ? totalExpense : totalIncome),
    [curType]
  )
  console.log(curTotal)

  const changeCurType = (type: 'expense' | 'income') => {
    if (type === 'expense') {
      setCurType('expense')
      setPieChart('expense')
    } else {
      setCurType('income')
      setPieChart('income')
    }
  }

  const setPieChart = async (type: 'expense' | 'income') => {
    // if (curTotal === 0) {
    //   return
    // }
    const pieChart = echarts.init(document.getElementById('pie-chart'))

    const _data = type === 'expense' ? expenseList : incomeList
    console.log(_data)
    setTimeout(() => console.log(_data), 3000)

    const chartData = _data.map((item: ReqMonthCategoryData) => {
      return {
        value: item.number,
        name: item.type_name
      }
    })
    console.log(chartData)

    pieChart.setOption({
      visualMap: {
        show: false,
        min: Math.min(
          ..._data.map((item: ReqMonthCategoryData) => item.number)
        ),
        max: Math.max(
          ..._data.map((item: ReqMonthCategoryData) => item.number)
        ),
        inRange: {
          colorLightness: [0.8, 0.5]
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '65%'],
          itemStyle: {
            color: type === 'expense' ? '#39be77' : '#ecbe25',
            borderColor: '#fff',
            borderWidth: 2
          },
          data: chartData,
          label: {
            color: '#ccc',
            position: 'outside',
            formatter: '{b} {d}%',
            fontWeight: 500
          },
          labelLine: {
            lineStyle: {
              color: '#ccc'
            },
            showAbove: true,
            length: 20,
            length2: 5
          }
        }
      ]
    })
    console.log(
      _data.map((item: ReqMonthCategoryData) => {
        return {
          value: item.number,
          name: item.type_name
        }
      })
    )
  }

  return (
    <>
      {/* 头部 */}
      <div
        className={cx({
          [s.header]: true,
          [s.expenseBackground]: curType === 'expense',
          [s.incomeBackground]: curType === 'income'
        })}
      >
        {/* 筛选日期收支类型 */}
        <div className={s.filterWrap}>
          <Button className={s.date} onClick={() => dateRef.current!.show()}>
            {dayjs(curMonth).format('YYYY年MM月')}
            <CustomIcon name="icon-calendar" />
          </Button>
          <span className={s.typeTab}>
            <span
              className={cx({
                [s.expense]: true,
                [s.active]: curType === 'expense'
              })}
              onClick={() => changeCurType('expense')}
            >
              支出
            </span>
            <span
              className={cx({
                [s.income]: true,
                [s.active]: curType === 'income'
              })}
              onClick={() => changeCurType('income')}
            >
              收入
            </span>
          </span>
        </div>
        {/* 总收支展示 */}
        <div className={s.totalWrap}>
          <div className={s.title}>
            {curType === 'expense' ? '总支出' : '总收入'}
          </div>
          <div className={s.totalAmount}>
            ￥{curType === 'expense' ? totalExpense : totalIncome}
          </div>
        </div>
      </div>
      {/* 收支构成图表明细 */}
      <div className={s.structure}>
        <div className={s.title}>
          {curType === 'expense' ? '支出构成' : '收入构成'}
        </div>

        {/* 账单占比饼图 */}
        <div id="pie-chart" style={{ width: '100%', height: '200px' }}></div>

        {/* 账单占比条形图 */}
        <div className={s.proportionBar}>
          {(curType === 'expense' ? expenseList : incomeList).map(
            (item: ReqMonthCategoryData) => (
              <div key={item.type_id} className={s.billItem}>
                {/* 类型图标和名字 */}
                <div className={s.typeItem}>
                  <span
                    className={cx(s.iconWrap, {
                      [s.expense]: curType === 'expense',
                      [s.income]: curType === 'income'
                    })}
                  >
                    <CustomIcon
                      name={(typeMap as TypeMap)[item.type_id].icon}
                    />
                  </span>
                  <span className={s.iconName}>{item.type_name}</span>
                </div>
                {/* 条形图 */}
                <span className={s.progress}>
                  <Progress
                    percentage={Number(
                      (item.number /
                        Number(
                          curType == 'expense' ? totalExpense : totalIncome
                        )) *
                        100
                    )}
                    strokeWidth="6px"
                    showPivot={false}
                    trackColor="#fff"
                    color={curType === 'expense' ? '#39be77' : '#ecbe25'}
                  />
                </span>
                <span className={s.amount}>
                  ￥{Number(item.number).toFixed(2) || 0}
                </span>
              </div>
            )
          )}
        </div>
      </div>
      <PopupDate ref={dateRef} onSelect={selectMonth} />
    </>
  )
}

export default Statistic
