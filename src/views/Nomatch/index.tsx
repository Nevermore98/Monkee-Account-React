import React from 'react'
import { Empty, Button } from 'react-vant'
import { useNavigate } from 'react-router-dom'
import s from './style.module.less'
import cx from 'classnames'

const NoMatch = () => {
  const navigate = useNavigate()

  return (
    <div className={s.noMatch}>
      <Empty image="error" description="你似乎来到了未知领域" />
      <Button size="small" className={s.returnButton} onClick={() => navigate('/bill')}>返回首页</Button>
    </div>
  )
}
export default NoMatch
