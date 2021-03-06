import React, { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'query-string'
import { changeConfirmButtonColor, get, post, typeMap } from '@/utils'
import cx from 'classnames'

import s from './style.module.less'
import CustomIcon from '@/components/CustomIcon'
import { ReqDetail, TypeMap } from '@/api/bill'
import { Button, Dialog, Field, Skeleton, Toast } from 'react-vant'
import dayjs from 'dayjs'
import PopupAddBill from '@/components/PopupAddBill'
import axios from 'axios'

const Detail = () => {
  //@ts-ignore
  const [detail, setDetail] = useState<ReqDetail>({})
  const location = useLocation()
  const navigate = useNavigate()
  // 查询字符串解析插件
  const { id } = qs.parse(location.search)
  const editRef = useRef()

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`)
    console.log(data)
    setDetail(data)
  }

  const deleteDetail = () => {
    Dialog.confirm({
      message: '删除后无法恢复，是否删除？',
      closeOnClickOverlay: true,
      confirmButtonText: '删除'
    })
      .then(async () => {
        const { data } = await axios.delete('/api/bill/detail', { data: { id }})
        Toast.success('删除成功')
        setTimeout(() => {
          navigate(-1)
        }, 200)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const editBill = () => {
    // @ts-ignore
    editRef.current!.show()
    // 异步执行，因为弹出层弹出需要时间，同步执行就获取不到 button
    setTimeout(() => {
      changeConfirmButtonColor(detail.type === 1 ? 'expense' : 'income')
    }, 0)
  }

  return (
    <>
      <Header title="账单详情" />
      <div className={s.detail}>
        {Object.keys(detail).length === 0 ? (
          <div className={s.skeletonWrap}>
            <Skeleton title round row={3} />
          </div>
        ) : (
          <div className={s.card}>
            {/* 收支类型图标和名称  */}
            <div className={s.typeWrap}>
              <span
                className={cx({
                  [s.iconWrap]: true,
                  [s.expense]: detail.type === 1,
                  [s.income]: detail.type === 2
                })}
              >
                <CustomIcon
                  name={
                    detail.category_id
                      ? (typeMap as TypeMap)[detail.category_id].icon
                      : '0'
                  }
                />
              </span>
              <span className={s.typeName}>{detail.category_name || ''}</span>
            </div>
            {/* 收支金额 */}
            <div className={s.amount}>
              {detail.type === 1 ? (
                <div className={cx(s.expense)}>-{detail.amount}</div>
              ) : (
                <div className={cx(s.income)}>+{detail.amount}</div>
              )}
            </div>
            {/* 记录时间和备注 */}
            <div className={s.info}>
              <Field
                label="记录时间"
                value={dayjs(detail.datetime).format(
                  'YYYY年MM月DD日 HH:mm'
                )}
                readonly
              />
              <Field label="备注" value={detail.remark || '-'} readonly />
            </div>
            {/* 删除和编辑按钮 */}
            <div className={cx(s.operation, 'rv-hairline--top')}>
              <Button className={s.deleteButton} onClick={deleteDetail}>
                <>
                  <span className={s.operationIcon}>
                    <CustomIcon name="icon-delete" />
                  </span>
                </>
                删除
              </Button>
              <Button className={s.editButton} onClick={() => editBill()}>
                <>
                  <span className={s.operationIcon}>
                    <CustomIcon name="icon-edit" />
                  </span>
                </>
                编辑
              </Button>
            </div>
            <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
          </div>
        )}
      </div>
    </>
  )
}

export default Detail
