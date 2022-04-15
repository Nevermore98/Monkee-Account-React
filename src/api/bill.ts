/** 账单类型*/
export interface Category {
  id?: number // 0 表示全部类型
  name?: string
  type?: 1 | 2 // 1 为支出，2 为收入
  user_id?: number // 默认为 0 代表全部用户默认初始的收支种类
}

export type CategoryList = Category[]

/** 单日账单单条记录 */
export interface DayBillItem {
  id?: number // 单条记录的 id
  type?: 1 | 2
  amount?: string
  datetime?: string // 'YYYY-MM-DD HH:mm:ss'
  category_id: number
  category_name: string
  remark?: string
}
/** 单日账单全部记录 */
export type DayBillItems = DayBillItem[]
/** 账单类型*/
export interface BillType {
  id: number // 0 表示全部类型
  name?: string
  type?: 1 | 2 // 1 为支出，2为收入
  user_id?: number
}
export interface CategoryIcon {
  id: number
  name: string
}

export type BillTypeList = BillType[]

/** 某日账单 */
export interface DayBillList {
  date: string // 'YYYY-MM-DD'
  daily_bill: DayBillItems // 单日账单
}

/** 多日账单 */
export type BillList = DayBillList[]

/** 请求到的 单月账单 */
export interface ReqMonthData {
  category_statistics: ReqMonthCategoryData
  total_expense: string
  total_income: string
}

/** 请求到的账单详情数据 */
export interface ReqDetail {
  amount: string // 金额
  datetime: string
  id: number // 账单 id
  type: 1 | 2 // 账单类型 1:支出 2:收入
  remark: string // 备注
  category_id: number // 消费类型 id
  category_name: string // 消费类型名
  user_id?: number // 用户 id
}

/** 请求到的月度收支种类统计数据 */
export interface ReqMonthCategoryData {
  category_id: number
  category_name: string
  type: 1 | 2 // 账单类型 1:支出 2
  total_category_amount: number // 单月该收支种类总金额
}

export type TypeMap = {
  [id: number]: {
    icon: string
  }
}