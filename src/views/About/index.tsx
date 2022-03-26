import Header from '@/components/Header'
import React from 'react'
import { Button, Typography } from 'react-vant'

import s from './style.module.less'

const About = () => {
  return (
    <div className={s.about}>
      <Header title="关于项目" />
      <Typography.Title level={3}>项目介绍</Typography.Title>
      <div className={s.content}>
        <Typography.Text>
          本项目是我在付费学习掘金小册{' '}
          <a href="https://juejin.cn/book/6966551262766563328">
            《Node + React 实战：从 0 到 1 实现记账本》
          </a>{' '}
          实战课程过程中，加上一些自己的思考，自己动手实践完成的项目，
          <a href="https://github.com/Nevermore98/Monkee-Account-React">
            仓库地址
          </a>
          。
        </Typography.Text>
        <br />
        <Typography.Text>
          本项目的大部分页面设计是对《微信官方记账本小程序》的拙劣模仿。如有雷同，纯属致敬😝
        </Typography.Text>
        <br />
        <Typography.Text>
          另外，本人此前也写过类似的项目{' '}
          <a href="https://github.com/Nevermore98/Monkee-Account">
            《萌奇记账 Vue3 版》
          </a>
          。
        </Typography.Text>
      </div>

      <Typography.Title level={3}>技术栈</Typography.Title>
      <div className={s.content}>
        <Typography.Text>
          前端：
          <strong>React17 + TSX + Vite2 + React Vant2 + Echarts5</strong>
          <br />
          后端：
          <strong>Node.js(Egg.js) + MySQL</strong>
        </Typography.Text>
        <br />
        <Typography.Text>
          插件：
          <ul>
            <li>postcss-pxtorem：将 px 转化为 rem，适配移动端；</li>
            <li>less：css 预编译器，编写简洁优雅的样式代码；</li>
            <li>commitizen：规范代码提交风格。</li>
          </ul>
        </Typography.Text>
        <br />
      </div>

      <Typography.Title level={3}>关于名字</Typography.Title>
      <div className={s.content}>
        <Typography.Text>
          萌奇是 monkee 的音译，是对猴子（monkey）的昵称。
        </Typography.Text>
      </div>
    </div>
  )
}
export default About
