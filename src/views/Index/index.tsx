import React from 'react'
import { Button } from 'react-vant'
import s from './style.module.less'

export default function Index() {
  return (
    <div className={s.index}>
      <span>样式</span>
      <Button type="primary">按钮</Button>
    </div>
  )
}
