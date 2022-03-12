import React from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from 'react-vant'
import s from './style.module.less'

interface Props {
  title: string
}

const Header = (props: Props) => {
  const { title } = props
  const navigate = useNavigate()

  return (
    <div>
      {/* NavBar fixed 脱离标准流，需要 block 占位 */}
      <div className={s.block}></div>

      <NavBar
        className={s.header}
        title={title}
        // leftText="返回"
        // rightText="按钮"
        onClickLeft={() => navigate(-1)}
        // onClickRight={() => Toast('按钮')}
      />
    </div>
  )
}

export default Header
