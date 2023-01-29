import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Cell, Dialog, Field, Uploader, Toast } from 'react-vant'
import { get, put, imgUrlTrans } from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import s from './style.module.less'
import { useNavigate } from 'react-router-dom'

const User = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [uid, setUid] = useState(0)
  const [signature, setSignature] = useState('')
  const [avatar, setAvatar] = useState('')
  const [visible, setVisible] = useState(false)
  const token = localStorage.getItem('account_react_token')

  useEffect(() => {
    getUserInfo()
  }, [])
  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/info')
    console.log(data)
    setUsername(data.username)
    setUid(data.id)
    setSignature(data.signature)
    setAvatar(data.avatar)
  }

  // 用户名首字母大写
  const beautifyName = useMemo(
    () => username.slice(0, 1).toUpperCase() + username.slice(1),
    [username]
  )
  // 暂时无法实现点击头像上传图片后，再提交 post 请求
  // 修改签名
  const modifySignature = async () => {
    const { data } = await put('/api/user/info', {
      avatar,
      signature
    })
    setVisible(false)
    Toast.info('修改个性签名成功')
  }

  // 退出登录
  const logout = () => {
    localStorage.removeItem('account_react_token')
    navigate('/login')
  }

  return (
    <div className={s.user}>
      {/* 个人信息卡片 */}
      <div className={s.card}>
        <img className={s.avatar} src={avatar} alt="avatar" />
        <div className={s.info}>
          <div className={s.name}>{beautifyName || ''}</div>
          <div className={s.uid}>UID: {uid}</div>
          <Button className={s.signature} onClick={() => setVisible(true)}>
            {signature || ''}
          </Button>
        </div>
      </div>

      {/* 修改签名弹出框 */}
      <Dialog
        visible={visible}
        title="个性签名"
        onCancel={() => setVisible(false)}
        closeOnClickOverlay={true}
        showCancelButton
        onConfirm={modifySignature}
        confirmButtonText="修改"
      >
        <Field
          rows={1}
          type="textarea"
          autosize
          value={signature}
          placeholder="请输入个性签名"
          onChange={setSignature}
          maxlength={25}
          showWordLimit
        />
      </Dialog>

      {/* 各种操作的单元格 */}
      <div className={s.operation}>
        <Cell.Group>
          <Cell
            title="修改信息"
            size="large"
            icon={<CustomIcon name="icon-edit" />}
            isLink
            center
            onClick={() => navigate('/edit_info')}
          />
          <Cell
            title="修改密码"
            size="large"
            icon={<CustomIcon name="icon-modify-password" />}
            isLink
            center
            onClick={() => navigate('/modify_password')}
          />
          <Cell
            title="关于项目"
            size="large"
            icon={<CustomIcon name="icon-about" />}
            isLink
            center
            onClick={() => navigate('/about')}
          />
        </Cell.Group>
      </div>
      {/* 退出登录 */}
      <div className={s.btnWrap}>
        <Button
          className={s.logout}
          type="danger"
          size="large"
          onClick={logout}
        >
          退出登录
        </Button>
      </div>
    </div>
  )
}

export default User
