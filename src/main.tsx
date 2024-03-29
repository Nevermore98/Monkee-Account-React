import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.less'
import App from './App'
import 'lib-flexible/flexible'

ReactDOM.render(
  <React.StrictMode>
    {/* 路由的根路径 */}
    <BrowserRouter basename="/account-react">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// 非移动端打开页面弹出二维码
if (document.documentElement.clientWidth > 500) {
  const QRCode = document.createElement('img')
  QRCode.src =
    'https://nevermore-picbed-1304219157.cos.ap-guangzhou.myqcloud.com/account-react-qrcode.png'
  QRCode.style.position = 'fixed'
  QRCode.style.left = '50%'
  QRCode.style.top = '50%'
  QRCode.style.transform = 'translate(-50%,-50%)'
  QRCode.style.borderRadius = '20px'
  QRCode.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)'
  document.body.appendChild(QRCode)

  // 点击空白处隐藏二维码
  const app = document.getElementById('root')
  app?.addEventListener('click', () => {
    QRCode.style.display = 'none'
  })
}
