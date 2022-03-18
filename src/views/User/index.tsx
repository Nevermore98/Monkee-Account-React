import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Cell, Dialog, Field, Uploader, Toast } from 'react-vant'
import type { UploaderFileListItem } from 'react-vant'
import axios from 'axios'
import { get, imgUrlTrans, post, typeMap } from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import s from './style.module.less'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '@/config'

const User = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [uid, setUid] = useState(0)
  const [signature, setSignature] = useState('')
  const [avatar, setAvatar] = useState('')
  const [show, setShow] = useState(false)
  const token = localStorage.getItem('token')
  // TODO 头像点击上传，个签点击修改
  useEffect(() => {
    getUserInfo()
  }, [])
  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo')
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

  // 上传头像并保存
  const uploadAvatar = (file: UploaderFileListItem) => {
    console.log('file.file', file.file)
    let formData = new FormData()
    // 生成 form-data 数据类型
    formData.append('file', file.file)
    // 通过 axios 设置  'Content-Type': 'multipart/form-data', 进行文件上传
    // @ts-ignore
    axios({
      method: 'post',
      url: `${baseUrl}/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token
      }
    }).then((res) => {
      // 返回图片地址
      console.log(res)

      setAvatar(imgUrlTrans(res.data))
      // save()
    })
    // .then(() => save())
  }

  // 提交修改信息
  const save = async () => {
    const { data } = await post('/api/user/edit_userinfo', {
      signature,
      avatar
    })
    Toast.info('修改成功')
  }

  const editSignature = () => {
    Dialog.confirm({
      title: '修改个人签名',
      closeOnClickOverlay: true,
      confirmButtonText: '修改',
      message: (
        <Field
          value={signature}
          onChange={setSignature}
          placeholder="请输入"
          // maxlength={20}
          showWordLimit
          clearable
          autosize
          type="textarea"
          rows={2}
        />
      )
      // onConfirm: () => {
      //   setSignature(signature)
      //   save()
      // }
    })
      .then(async () => {
        const { data } = await post('/api/user/edit_userinfo', {
          signature: signature,
          avatar: avatar
        })
        console.log(data)
        Toast.info('修改成功')
      })
      .catch((err) => {
        console.log(err)
        console.log('reject')
      })
  }

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className={s.user}>
      {/* 个人信息卡片 */}
      <div className={s.card}>
        <Uploader afterRead={(file) => uploadAvatar(file)}>
          <img className={s.avatar} src={avatar} alt="avatar" />
        </Uploader>
        <div className={s.info}>
          <div className={s.name}>{beautifyName || ''}</div>
          <div className={s.uid}>UID: {uid}</div>
          <Button className={s.signature} onClick={editSignature}>
            {/* {'红红火火恍恍惚惚或或哈哈哈哈哈哈二十字' || ''} */}
            {signature || ''}
          </Button>
        </div>
      </div>
      {/* 修改签名弹出框 */}
      <Dialog title="个性签名">
        <Field rows={2} />
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
            onClick={() => navigate('/edit_password')}
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
      <Button onClick={save}>dinaji</Button>
    </div>
  )
}

export default User
