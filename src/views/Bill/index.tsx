import BillItem from '@/components/BillItem'
import CustomIcon from '@/components/CustomIcon'
import { get } from '@/utils'
import React, { useState } from 'react'
import { Button, PullRefresh, Toast } from 'react-vant'

import s from './style.module.less'

const Bill = () => {
  const [currentSelect, setCurrentSelect] = useState({})
  const [list, setList] = useState([
    {
      daily_bill: [
        {
          amount: 25.0,
          datetime: '2022-03-25 02:58:17',
          id: 222,
          type: 1,
          remark: '备注',
          category_id: 1,
          category_name: '餐饮'
        }
      ],
      date: '2021-06-1'
    }
  ])

  // 获取账单方法
  // const getBillList = async () => {
  //   const { data } = await get(
  //     `/api/bill/list?page=${page}&page_size=5&date=${currentTime}`
  //   )
  //   // 下拉刷新，重制数据
  //   if (page == 1) {
  //     setList(data.list)
  //   } else {
  //     setList(list.concat(data.list))
  //   }
  //   setTotalPage(data.totalPage)
  //   // 上滑加载状态
  //   setLoading(LOAD_STATE.success)
  //   setRefreshing(REFRESH_STATE.success)
  // }

  const onRefresh = (showToast) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (showToast) {
          Toast.info('刷新成功')
        }
        resolve(true)
      }, 1000)
    })
  }

  const getBillList = async () => {
    const { data } = await get(
      `/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
        currentSelect.id || 'all'
      }`
    )
    // 下拉刷新，重制数据
    // if (page == 1) {
    //   setList(data.list)
    // } else {
    //   setList(list.concat(data.list))
    // }
    // setTotalExpense(data.totalExpense.toFixed(2))
    // setTotalIncome(data.totalIncome.toFixed(2))
    // setTotalPage(data.totalPage)
    // // 上滑加载状态
    // setLoading(LOAD_STATE.success)
    // setRefreshing(REFRESH_STATE.success)
  }
  return (
    <div className={s.bill}>
      {/* 账单顶部筛选总览区域 */}
      <div className={s.header}>
        <Button size="small" type="primary" className={s.typeWrap}>
          <span className={s.allType}>全部类型</span>
          <CustomIcon name="icon-type" />
        </Button>

        <div className={s.dataWrap}>
          <Button className={s.time} size="mini">
            <span className={s.time}>
              <span>2022-06</span>
              <CustomIcon name="icon-sort-down" />
            </span>
          </Button>
          <span className={s.expense}>总支出 ￥100.00</span>
          <span className={s.income}>总收入 ￥100.00</span>
        </div>
      </div>
      {/* 账单列表 */}
      <div className={s.contentWrapper}>
        {/* <PullRefresh onRefresh={() => onRefresh(true)}>
          {list.map((item, index) => (
            <BillItem bills={item} key={index} />
          ))}
        </PullRefresh> */}
        {list.map((item, index) => (
          <BillItem bill={item} key={index} />
        ))}
      </div>
    </div>
  )
}

export default Bill
