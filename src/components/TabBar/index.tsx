import React, { useEffect, useState } from 'react'
import { Tabbar } from 'react-vant'
import { useNavigate, useLocation } from 'react-router-dom'
import CustomIcon from '@/components/CustomIcon'

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [name, setName] = useState('/bill')

  // 实现类似 vue-router afterEach，直接修改 url，同步改变标签栏高亮图标
  useEffect(() => {
    setName(location.pathname)
  }, [location.pathname])

  return (
    <Tabbar
      value={name}
      onChange={(value) => {
        setName(value as string)
        navigate(value as string)
      }}
      activeColor="#39be77"
    >
      <Tabbar.Item icon={<CustomIcon name="icon-bill" />} name="/bill">
        账单
      </Tabbar.Item>
      <Tabbar.Item
        icon={<CustomIcon name="icon-statistic" />}
        name="/statistic"
      >
        统计
      </Tabbar.Item>
      <Tabbar.Item icon={<CustomIcon name="icon-user" />} name="/user">
        我的
      </Tabbar.Item>
    </Tabbar>
  )
}

export default NavBar
