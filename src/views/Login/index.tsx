import React, { useCallback, useState } from 'react'
import { Button, Field, Checkbox, Toast, Typography } from 'react-vant'
import Captcha from 'react-captcha-code'
import { EyeO, ClosedEye, Down } from '@react-vant/icons'

import s from './style.module.less'
import { post } from '@/utils'

const Login = () => {
  const [type, setType] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [verify, setVerify] = useState('')
  const [checked, setChecked] = useState(false)
  const [hidden, setHidden] = useState(true)

  const changeCaptcha = useCallback((captcha) => {
    // console.log('captcha', captcha)
    setCaptcha(captcha)
  }, [])
  // 判断输入框是否未全部填充，赋值给提交按钮的禁用状态
  const judgeUndone = () => {
    if (type === 'login' && username && password) {
      return false
    } else if (type === 'register' && username && password && verify) {
      return false
    } else {
      return true
    }
  }

  const onSubmit = async () => {
    if (!username) {
      Toast.info('请输入账号')
      return
    }
    if (!password) {
      Toast.info('请输入密码')
      return
    }
    if (!checked) {
      Toast.info('请先勾选同意《萌奇记账用户协议》、《萌奇记账隐私政策》')
      return
    }
    try {
      if (type === 'login') {
        const { data } = await post('/api/user/login', {
          username,
          password
        })
        localStorage.setItem('account_react_token', data.token)
        // 刷新重新请求数据后再跳转
        window.location.href = './bill'
      } else {
        if (!verify) {
          Toast.info('请输入验证码')
          return
        }
        if (verify !== captcha) {
          Toast.info('验证码错误')
          return
        }
        const { data } = await post('/api/user/register', {
          username,
          password
        })
        Toast.info('注册成功')
        setType('login')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={s.auth}>
      <div className={s.name}>萌奇记账</div>
      {/* 注意相对路径 */}
      <img className={s.logo} src="./monkee.png" alt="logo" />
      <div className={s.title}>
        {type === 'login' ? (
          <span>使用账号密码登录</span>
        ) : (
          <span>新用户注册</span>
        )}
      </div>

      <div className={s.formWrap}>
        <Field
          value={username}
          onChange={(value) => setUsername(value)}
          clearable
          border={false}
          placeholder="测试账号：admin"
        />
        <Field
          value={password}
          type={hidden ? 'password' : 'text'}
          onChange={(value) => setPassword(value)}
          rightIcon={hidden ? <ClosedEye /> : <EyeO />}
          border={false}
          onClickRightIcon={() => setHidden(!hidden)}
          placeholder="测试密码：123456"
        />
        {type === 'register' ? (
          <Field
            value={verify}
            onChange={setVerify}
            placeholder="请输入验证码"
            border={false}
            clearable
            button={<Captcha charNum={4} onChange={changeCaptcha} />}
          />
        ) : null}
      </div>

      <div className={s.submit}>
        <Button
          type="primary"
          onClick={onSubmit}
          icon={<Down rotate={-90} />}
          disabled={judgeUndone()}
          color="#39be77"
        ></Button>
      </div>

      <div className={s.changeType}>
        {type === 'login' ? (
          <span onClick={() => setType('register')}>没有账号？前往注册</span>
        ) : (
          <span onClick={() => setType('login')}>登录已有账号</span>
        )}
      </div>

      <div className={s.terms}>
        <Checkbox
          checked={checked}
          onChange={setChecked}
          checkedColor="#39be77"
        />
        <div className={s.termsText}>
          <Typography.Text size="xs">
            我已阅读并同意{' '}
            <Typography.Text
              size="xs"
              underline
              onClick={() => {
                Toast.info('祝您体验愉快~')
              }}
            >
              《萌奇记账用户协议》
            </Typography.Text>
            、
            <br />
            <Typography.Text
              size="xs"
              underline
              onClick={() => {
                Toast.info('个人学习项目，请不要存放重要信息')
              }}
            >
              《萌奇记账隐私政策》
            </Typography.Text>
          </Typography.Text>
        </div>
      </div>
    </div>
  )
}

export default Login
