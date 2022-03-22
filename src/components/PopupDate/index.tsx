import dayjs from 'dayjs'
import React, { FC, forwardRef, useRef, useState } from 'react'
import { DatetimePicker, Popup } from 'react-vant'

interface Props {
  // 实在不知道 ref 是什么类型的
  ref: any
  onSelect: (item: Date) => void
}

const PopupDate: FC<Props> = forwardRef(({ onSelect }, ref: any) => {
  const [visible, setVisible] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  /**
   * 请注意不要在模板中直接使用类似minDate="new Date()"的写法
   * 正确的做法是将minDate作为一个数据定义在data函数中。
   * https://3lang3.github.io/react-vant/#/zh-CN/datetime-picker
   */
  const maxDate = useRef(new Date())

  const minDate = new Date(
    new Date().setFullYear(maxDate.current.getFullYear() - 10)
  )

  const selectDate = (item: Date) => {
    setCurrentDate(item)
    onSelect(item)
    setVisible(false)
  }

  if (ref) {
    ref.current = {
      show: () => {
        setVisible(true)
      },
      close: () => {
        setVisible(false)
      }
    }
  }
  return (
    <Popup
      position="bottom"
      round
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <DatetimePicker
        type="year-month"
        // 滑动持续时间调短点，避免赋值跟不上确认事件
        // react-vant 相比于 vant，onChange 改变后才赋值
        swipeDuration={250}
        itemHeight={48}
        minDate={minDate}
        maxDate={maxDate.current}
        value={currentDate}
        onCancel={() => setVisible(false)}
        onChange={(v) => {
          console.log(v)
          setCurrentDate(v)
        }}
        onConfirm={selectDate}
        title="选择年月"
        formatter={(type: string, val: string) => {
          if (type === 'year') {
            return `${val}年`
          }
          if (type === 'month') {
            return `${val}月`
          }
          return val
        }}
      />
    </Popup>
  )
})

export default PopupDate
