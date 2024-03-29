import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import TabBar from '@/components/TabBar'
import Bill from '@/views/Bill'
import Statistic from '@/views/Statistic'
import User from '@/views/User'
import Nomatch from '@/views/Nomatch'
import Detail from '@/views/Detail'
import Login from '@/views/Login'
import EditInfo from '@/views/EditInfo'
import ModifyPassword from '@/views/ModifyPassword'
import About from '@/views/About'

function App() {
  // 此处 / 不可省略
  const showTabbarRouteList = ['/', '/bill', '/statistic', '/user']
  const location = useLocation()
  console.log(location.pathname)

  return (
    // Router 包裹某组件，才能在该组件使用 useLocation
    <>
      <Routes>
        <Route path="/" element={<Navigate to="bill" />} />
        <Route path="bill" element={<Bill />} />
        <Route path="statistic" element={<Statistic />} />
        <Route path="user" element={<User />} />
        <Route path="detail" element={<Detail />} />
        <Route path="edit_info" element={<EditInfo />} />
        <Route path="login" element={<Login />} />
        <Route path="modify_password" element={<ModifyPassword />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Nomatch />} />
      </Routes>

      {/* 条件渲染，根据路径是否渲染标签栏 */}
      {showTabbarRouteList.includes(location.pathname) ? <TabBar /> : null}
    </>
  )
}

export default App
