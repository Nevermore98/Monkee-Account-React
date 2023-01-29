import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Progress } from 'react-vant'
import cx from 'classnames'
import dayjs from 'dayjs'
import { get, typeMap } from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import s from './style.module.less'
import { ReqMonthCategoryData, TypeMap } from '@/api/bill'
import { useNavigate } from 'react-router-dom'

let pieChart: any = null

const Statistic = () => {
  const [curType, setCurType] = useState('expense') // 收入或支出类型
  const [curMonth, setCurMonth] = useState(dayjs().format('YYYY-MM')) // 当前日期：年月
  const [totalExpense, setTotalExpense] = useState('0') // 总支出
  const [totalIncome, setTotalIncome] = useState('0') // 总收入
  const [expenseData, setExpenseData] = useState([]) // 支出数据
  const [incomeData, setIncomeData] = useState([]) // 收入数据
  const popupDateRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    getMouthBillData()
    return () => {
      // useEffect return 组件卸载后的清除函数，释放图表实例
      pieChart?.dispose()
      pieChart?.clear()
      pieChart = null
    }
  }, [curMonth, curType]) // 解决初始化饼图的颜色对应问题，缺点是每次切换收支类型都要网络请求

  // 计算属性，当前收支类型对应的总金额，用以判断是否显示图表
  const curTotal = useMemo(
    () => (curType === 'expense' ? totalExpense : totalIncome),
    [curType, totalExpense, totalIncome]
  )

  // 获取月度账单数据
  const getMouthBillData = async () => {
    const { data } = await get(`/api/bill/statistics?datetime=${curMonth}`)
    console.log(data)

    setTotalExpense(data.total_expense)
    setTotalIncome(data.total_income)
    // 过滤支出和收入
    const expense_data = data.category_statistics
      .filter((item: ReqMonthCategoryData) => item.type === 1)
      .sort(
        (a: ReqMonthCategoryData, b: ReqMonthCategoryData) =>
          b.total_category_amount - a.total_category_amount
      )
    const income_data = data.category_statistics
      .filter((item: ReqMonthCategoryData) => item.type === 2)
      .sort(
        (a: ReqMonthCategoryData, b: ReqMonthCategoryData) =>
          b.total_category_amount - a.total_category_amount
      )
    setExpenseData(expense_data)
    setIncomeData(income_data)
    setPieChart(curType === 'expense' ? expense_data : income_data)
  }

  // 选择年月
  const selectMonth = (value: any) => {
    setCurMonth(dayjs(value).format('YYYY-MM'))
  }

  // 切换收支类型
  const changeCurType = (type: 'expense' | 'income') => {
    setCurType(type)
    // 切换收支类型后，绘制饼图的颜色会有卡顿 bug。暂不解决
    setPieChart(type === 'expense' ? expenseData : incomeData)
  }

  // 初始化饼图
  const setPieChart = async (data: ReqMonthCategoryData[]) => {
    try {
      // @ts-ignore
      const pieChart = echarts.init(document.getElementById('pie-chart'))
      const chartData = data.map((item: ReqMonthCategoryData) => {
        return {
          value: item.total_category_amount,
          name: item.category_name
        }
      })

      pieChart.setOption({
        visualMap: {
          show: false,
          min: Math.min(
            ...data.map((item: ReqMonthCategoryData) => item.total_category_amount)
          ),
          max: Math.max(
            ...data.map((item: ReqMonthCategoryData) => item.total_category_amount)
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
              color: curType === 'expense' ? '#39be77' : '#ecbe25',
              borderColor: '#fff',
              borderWidth: 2
            },
            data: chartData,
            label: {
              fontFamily: 'WeChatSans-Regular',
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
    } catch (e) {
      // 捕获“找不到初始化图表的容器节点”的报错
    }
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
          <Button
            className={s.date}
            // @ts-ignore
            onClick={() => popupDateRef.current!.show()}
          >
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
      {curTotal === '0.00' ? (
        <div className={s.empty}>
          <CustomIcon name="icon-empty" className={s.emptyIcon} />
          {`暂无${curType === 'expense' ? '支出' : '收入'}账单`}
          <Button
            size="small"
            className={cx({
              [s.emptyButton]: true,
              [s.expenseBackground]: curType === 'expense',
              [s.incomeBackground]: curType === 'income'
            })}
            onClick={() => navigate('/bill')}
          >
            去记账
          </Button>
        </div>
      ) : (
        <div className={s.structure}>
          <div className={s.title}>
            {curType === 'expense' ? '支出构成' : '收入构成'}
          </div>

          {/* 账单占比饼图 */}
          <div id="pie-chart" style={{ width: '100%', height: '200px' }}></div>

          {/* 账单占比条形图 */}
          <div className={s.proportionBar}>
            {(curType === 'expense' ? expenseData : incomeData).map(
              (item: ReqMonthCategoryData) => (
                <div key={item.category_id} className={s.billItem}>
                  {/* 类型图标和名字 */}
                  <div className={s.typeItem}>
                    <span
                      className={cx(s.iconWrap, {
                        [s.expense]: curType === 'expense',
                        [s.income]: curType === 'income'
                      })}
                    >
                      <CustomIcon
                        name={(typeMap as TypeMap)[item.category_id].icon}
                      />
                    </span>
                    <span className={s.iconName}>{item.category_name}</span>
                  </div>
                  {/* 条形图 */}
                  <span className={s.progress}>
                    <Progress
                      percentage={Number(
                        (item.total_category_amount /
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
                    ￥{Number(item.total_category_amount).toFixed(2) || 0}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
      <PopupDate ref={popupDateRef} onSelect={selectMonth} />
    </>
  )
}

export default Statistic
