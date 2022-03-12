import { BillType } from '@/api/bill'
import BillItem from '@/components/BillItem'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'
import PopupCategory from '@/components/PopupCategory'
import PopupDate from '@/components/PopupDate'
import { get } from '@/utils'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { Button, List, PullRefresh, Toast } from 'react-vant'

import s from './style.module.less'

const Bill = () => {
  const categoryRef = useRef(null) // 账单类型 ref
  const dateRef = useRef(null) // 日期筛选 ref
  const addBillRef = useRef(null) // 添加账单 ref

  const [totalExpense, setTotalExpense] = useState(0) // 总支出
  const [totalIncome, setTotalIncome] = useState(0) // 总收入
  const [currentCategory, setCurrentCategory] = useState<BillType>({ id: 0 }) // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')) // 当前筛选时间

  const [page, setPage] = useState(1) // 分页
  const [totalPage, setTotalPage] = useState(0) // 分页总数
  const [list, setList] = useState([]) // 账单列表
  const [finished, setFinished] = useState(false) // 加载完成状态
  const [loading, setLoading] = useState(false) // 加载完成状态
  const listRef = useRef(null)

  // const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal) // 下拉刷新状态
  // const [loading, setLoading] = useState(LOAD_STATE.normal) // 上拉加载状态

  useEffect(() => {
    getBillList() // 初始化
    console.log('categoryRef', categoryRef)
    console.log('dateRef', dateRef)
    console.log('currentTime', currentTime)
  }, [page, currentCategory, currentTime])

  // 获取账单方法
  const getBillList = async () => {
    try {
      const { data } = await get(
        `/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
          currentCategory.id || 'all'
        }`
      )
      console.log(data)
      // 下拉刷新，重置数据
      if (page === 1) {
        setList(data.list)
      } else {
        setList(list.concat(data.list))
      }
      setTotalExpense(data.totalExpense.toFixed(2))
      setTotalIncome(data.totalIncome.toFixed(2))
      setTotalPage(data.totalPage)
      // 上滑加载状态
      setFinished(true)
      // setLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      if (page < totalPage) {
        setPage(page + 1)
      } else {
        setFinished(true)
      }
      setLoading(false)
    }
  }
  // TODO 下拉刷新延迟一会
  const onRefresh = async () => {
    setLoading(true)
    setFinished(false)

    if (page !== 1) {
      setPage(1)
    } else {
      await getBillList()
    }
    // listRef.current?.check()
  }

  const loadData = () => {
    if (page < totalPage) {
      setPage(page + 1)
    }
  }

  const handleSelectCategory = (item: BillType) => {
    setLoading(true)
    setPage(1)
    setCurrentCategory(item)
  }
  // TODO 存在过期闭包的 bug
  const handleSelectDate = (item: Date) => {
    setPage(1)
    setCurrentTime(dayjs(item).format('YYYY-MM'))
  }

  return (
    <div className={s.bill}>
      {/* 账单顶部筛选总览区域 */}
      <div className={s.header}>
        <Button
          size="small"
          type="primary"
          className={s.typeWrap}
          onClick={() => categoryRef.current!.show()}
        >
          <span className={s.allType}>
            {currentCategory.name || '全部类型'}
          </span>
          <CustomIcon name="icon-type" />
        </Button>

        <div className={s.dataWrap}>
          <Button
            className={s.time}
            size="mini"
            onClick={() => dateRef.current!.show()}
          >
            <span className={s.time}>
              <span>{currentTime}</span>
              <CustomIcon name="icon-sort-down" />
            </span>
          </Button>
          <span className={s.expense}>总支出 ￥{totalExpense}</span>
          <span className={s.income}>总收入 ￥{totalIncome}</span>
        </div>
      </div>
      {/* 账单列表 */}
      <div className={s.contentWrap}>
        <PullRefresh onRefresh={onRefresh}>
          <List
            finished={finished}
            loading={loading}
            onLoad={loadData}
            finishedText="没有更多了~"
            ref={listRef}
          >
            {list.length
              ? list.map((item, index) => <BillItem bill={item} key={index} />)
              : null}
          </List>
        </PullRefresh>
      </div>
      {/* 添加账单按钮 */}
      <Button
        round
        type="primary"
        className={s.addWrap}
        onClick={() => addBillRef.current!.show()}
      >
        <CustomIcon name="icon-add-bill" className={s.addIcon} />
        记一笔
      </Button>

      <PopupCategory ref={categoryRef} onSelect={handleSelectCategory} />
      <PopupDate ref={dateRef} onSelect={handleSelectDate} />
      <PopupAddBill ref={addBillRef} />
    </div>
  )
}

export default Bill
