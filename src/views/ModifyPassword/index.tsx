import React, { useState } from 'react'
import { Button, Toast, Field, Form } from 'react-vant'
import { EyeO, ClosedEye } from '@react-vant/icons'
import Header from '@/components/Header'
import { put } from '@/utils'

import s from './style.module.less'
import { useNavigate } from 'react-router-dom'

const ModifyPassword = () => {
  const navigate = useNavigate()
  const [hidden1, setHidden1] = useState(true)
  const [hidden2, setHidden2] = useState(true)
  const [hidden3, setHidden3] = useState(true)

  // 提交修改
  const [form] = Form.useForm()
  const onFinish = async (values: any) => {
    console.log(values)
    if (values.newPassword != values.newPassword2) {
      Toast.info('新密码输入不一致')
      return
    }
    await put('/api/user/password', {
      old_pass: values.oldPassword,
      new_pass: values.newPassword,
      new_pass2: values.newPassword2
    })
    Toast.info('修改成功')
    navigate(-1)
  }

  return (
    <>
      <Header title="重置密码" />
      <div className={s.modify}>
        <Form
          form={form}
          showValidateMessage={false}
          onFinish={onFinish}
          footer={
            <div style={{ margin: '30px 16px 16px 0' }}>
              <Button
                round
                nativeType="submit"
                type="primary"
                block
                color="#39be77"
              >
                提交
              </Button>
            </div>
          }
        >
          <Form.Item
            tooltip="本项目暂无找回密码功能，请慎重！"
            rules={[{ required: true, message: '请输入原密码' }]}
            name="oldPassword"
            label="原密码"
          >
            <Field
              placeholder="请输入原密码"
              clearable
              type={hidden1 ? 'password' : 'text'}
              rightIcon={hidden1 ? <ClosedEye /> : <EyeO />}
              onClickRightIcon={() => setHidden1(!hidden1)}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '请输入新密码' }]}
            name="newPassword"
            label="新密码"
          >
            <Field
              placeholder="请输入新密码"
              clearable
              type={hidden2 ? 'password' : 'text'}
              rightIcon={hidden2 ? <ClosedEye /> : <EyeO />}
              onClickRightIcon={() => setHidden2(!hidden2)}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '请再次输入新密码' }]}
            name="newPassword2"
            label="确认密码"
          >
            <Field
              placeholder="请再次输入新密码"
              clearable
              type={hidden3 ? 'password' : 'text'}
              rightIcon={hidden3 ? <ClosedEye /> : <EyeO />}
              onClickRightIcon={() => setHidden3(!hidden3)}
            />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default ModifyPassword
