import React from 'react'
import Header from '@/components/Header'

import s from './style.module.less'

const Detail = () => {
  return (
    <>
      <Header title="账单详情" />
      <div className={s.detail}></div>
    </>
  )
}

export default Detail
