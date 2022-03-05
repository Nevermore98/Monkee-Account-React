/** 账单类型*/
export interface Category {
  id?: number // 0 表示全部类型
  name?: string
  type?: 1 | 2 // 1 为支出，2 为收入
  user_id?: number
}

export type CategoryList = Category[]

/** 单日账单单条记录 */
export interface DayBillItem {
  id?: number // 单条记录的 id
  type?: 1 | 2
  amount?: number
  datetime?: string // 'YYYY-MM-DD HH:mm:ss'
  category_id: number
  category_name?: string
  remark?: string
}

/** 单日账单全部记录 */
export type DayBillItems = DayBillItem[]

/** 某日账单 */
export interface DayBillList {
  date: string // 'YYYY-MM-DD'
  daily_bill: DayBillItems
}

/** 多日账单 */
export type BillList = DayBillList[]

/** 请求到的 单月账单 */
export interface RequestMonthData {
  list: BillList
  totalExpense: number
  totalIncome: number
  totalPage: number
}

/** 请求到的账单详情数据 */
export interface ReqDetail {
  amount?: number // 金额
  datetime: string
  id?: number // 账单 id
  type?: 1 | 2 // 账单类型 1:支出 2:收入
  remark?: string // 备注
  category_id?: number // 消费类型 id
  category_name?: string // 消费类型名
  user_id?: number // 用户 id
}

export type TypeMap = {
  [id: string]: {
    icon: string
  }
}
