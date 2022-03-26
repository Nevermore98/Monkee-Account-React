import { BillType } from '@/api/bill'
import BillItem from '@/components/BillItem'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'
import PopupCategory from '@/components/PopupCategory'
import PopupDate from '@/components/PopupDate'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Empty } from 'react-vant'
import cx from 'classnames'

import s from './style.module.less'
import { ActivityIndicator, Pull } from 'zarm'
import { SuccessCircle } from '@zarm-design/icons'

const Bill = () => {
  // 搞不定 react-vant 的 PullRefresh、List 组件。使用 zarm 的 Pull 组件
  const categoryRef = useRef(null) // 账单类型 ref
  const dateRef = useRef(null) // 日期筛选 ref
  const addBillRef = useRef(null) // 添加账单 ref

  const [totalExpense, setTotalExpense] = useState(0) // 总支出
  const [totalIncome, setTotalIncome] = useState(0) // 总收入
  const [currentCategory, setCurrentCategory] = useState<BillType>({ id: 0 }) // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')) // 当前筛选时间
  const [page, setPage] = useState(1) // 分页
  const [totalPage, setTotalPage] = useState(1) // 分页总数
  const [list, setList] = useState([]) // 账单列表
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal) // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal) // 上拉加载状态

  useEffect(() => {
    getBillList()
  }, [page, currentCategory, currentTime])

  const getBillList = async () => {
    const { data } = await get(
      `/api/bill/list?date=${currentTime}&type_id=${
        currentCategory.id || 'all'
      }&page=${page}&page_size=5`
    )
    // 初始化时，分页为 1，设置一页。其他情况，连接旧 list。
    if (page === 1) {
      setList(data.list)
    } else {
      setList(list.concat(data.list))
    }
    setTotalExpense(data.totalExpense.toFixed(2))
    setTotalIncome(data.totalIncome.toFixed(2))
    setTotalPage(data.totalPage)
    // 上滑加载成功状态
    setLoading(LOAD_STATE.success)
    // 下拉刷新成功状态
    setRefreshing(REFRESH_STATE.success)
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page !== 1) {
      setPage(1)
    } else {
      getBillList()
    }
  }

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    } else {
      setLoading(LOAD_STATE.complete)
    }
  }

  const handleSelectCategory = (item: BillType) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentCategory(item)
  }

  const handleSelectDate = (item: Date) => {
    if (currentTime === dayjs(item).format('YYYY-MM')) {
      return
    }
    setRefreshing(REFRESH_STATE.loading)
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
          // @ts-ignore
          onClick={() => categoryRef.current!.show()}
        >
          <span className={s.allType}>
            {currentCategory.name || '全部类型'}
          </span>
          <CustomIcon name="icon-type" />
        </Button>

        <div className={s.dataWrap}>
          <Button
            className={s.timeButton}
            size="mini"
            // @ts-ignore
            onClick={() => dateRef.current!.show()}
          >
            <div className={s.time}>
              <span>{currentTime}</span>
              <CustomIcon name="icon-sort-down" />
            </div>
          </Button>
          <span className={cx(s.expense)}>总支出 ￥{totalExpense}</span>
          <span className={cx(s.income)}>总收入 ￥{totalIncome}</span>
        </div>
      </div>
      {/* 账单列表 */}
      <div className={s.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
              render: (
                refreshState: unknown,
                percent: number
              ) => {
                const cls = 'custom-control'
                switch (refreshState) {
                  case REFRESH_STATE.pull:
                    return (
                      <div className={cls}>
                        <ActivityIndicator loading={false} percent={percent} />
                        <span>下拉刷新</span>
                      </div>
                    )

                  case REFRESH_STATE.drop:
                    return (
                      <div className={cls}>
                        <ActivityIndicator loading={false} percent={100} />
                        <span>释放立即刷新</span>
                      </div>
                    )

                  case REFRESH_STATE.loading:
                    return (
                      <div className={cls}>
                        <ActivityIndicator type="spinner" />
                        <span>加载中</span>
                      </div>
                    )

                  case REFRESH_STATE.success:
                    return (
                      <div className={cls}>
                        <SuccessCircle theme="success" size="sm" />
                        <span>加载成功</span>
                      </div>
                    )
                  default:
                }
              }
            }}
            load={{
              state: loading,
              distance: 300,
              handler: loadData,
              render: (loadState: any) => {
                const cls = 'custom-control'
                switch (loadState) {
                  case LOAD_STATE.loading:
                    return (
                      <div className={cls}>
                        <ActivityIndicator type="spinner" />
                        加载中...
                      </div>
                    )

                  case LOAD_STATE.complete:
                    return <div className={cls}>没有更多了~</div>
                }
              }
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : (
          <Empty image="search" description="暂无账单" />
        )}
      </div>
      {/* 添加账单按钮 */}
      <Button
        round
        type="primary"
        className={s.addWrap}
        // @ts-ignore
        onClick={() => addBillRef.current!.show()}
      >
        <CustomIcon name="icon-add-bill" className={s.addIcon} />
        记一笔
      </Button>

      <PopupCategory ref={categoryRef} onSelect={handleSelectCategory} />
      <PopupDate ref={dateRef} onSelect={handleSelectDate} />
      <PopupAddBill ref={addBillRef} onReload={refreshData} />
    </div>
  )
}

export default Bill
