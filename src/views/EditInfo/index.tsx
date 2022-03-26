import Header from '@/components/Header'
import { get, imgUrlTrans, post } from '@/utils'
import React, { useEffect, useState } from 'react'
import { Button, Field, Toast, Uploader } from 'react-vant'
import type { UploaderFileListItem } from 'react-vant'
import axios from 'axios'
import { baseUrl } from '@/config'

import s from './style.module.less'
import { useNavigate } from 'react-router-dom'

const EditInfo = () => {
  const [avatar, setAvatar] = useState('')
  const [signature, setSignature] = useState('')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo')
    console.log(data)
    setSignature(data.signature)
    setAvatar(imgUrlTrans(data.avatar))
  }
  // 上传头像
  const uploadAvatar = (file: UploaderFileListItem) => {
    console.log('file', file)
    let formData = new FormData()
    // @ts-ignore
    formData.append('file', file.file)
    // 通过 axios 设置  'Content-Type': 'multipart/form-data', 进行文件上传。

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
      console.log('res', res)
      setAvatar(imgUrlTrans(res.data))
    })
  }
  // 图片超过限定大小
  const onOversize = (file: any) => {
    console.log(file)
    // TODO 调整文件大小限制
    Toast('文件大小不能超过 50KB')
  }

  // 保存修改信息
  const save = async () => {
    const { data } = await post('/api/user/edit_userinfo', {
      avatar,
      signature
    })
    console.log(data)
    Toast.info('修改成功')
    navigate(-1)
  }

  return (
    <>
      <Header title="修改个人信息" />
      <div className={s.info}>
        {/* 头像区域 */}
        <div className={s.item}>
          <h2>头像</h2>
          <div className={s.avatarSection}>
            <img className={s.avatar} src={avatar} alt="avatar" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 50KB!!?? 以内的图片</span>
              <Uploader
                afterRead={uploadAvatar}
                // TODO 调整文件大小限制
                maxSize={50 * 1024}
                onOversize={onOversize}
              >
                <Button block type="primary" round size="small" color="#39be77">
                  上传头像
                </Button>
              </Uploader>
            </div>
          </div>
        </div>
        {/* 个性签名区域 */}
        <div className={s.item}>
          <h2>个性签名</h2>
          <div className={s.signature}>
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
          </div>
        </div>
        <div className={s.btnWrap}>
          <Button onClick={save} type="primary" size="large" color="#39be77">
            保存
          </Button>
        </div>
      </div>
    </>
  )
}

export default EditInfo
