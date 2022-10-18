
// 分类 1：支出 2：收入
export type Type = 1 | 2

// 键盘每个按键的键值
export type KeybordKeys = '7' | '8' | '9' | 'today' | '4' | '5' | '6' | 'add' | '1' | '2' | '3' | 'sub' | 'point' | '0' | 'del' | 'submit'

// 分类item
export interface CategoryItem{
    icon: string;
    id: number;
    name?: string;
    select_icon: string;
    theme_id?: number;
    type: Type;
    user_id: number;
  }
  
  // 关键词列表
  export type KeywordList = string[]

  // 键盘相关的data数据
  export interface KeybordOperateObj {
    kbRemark?: string
    kbAmount?: string
    kbSumOrSubmit?: boolean
    date?: string
    dateSelect?: string
  }

  // 创建订单的参数
  export interface SubmitParams{
    id?: number;
    amount: number;
    category_id: number;
    day: number;
    description: string;
    month: number;
    timestamp: number;
    type: Type;
    week: string;
    year: number;
  }
  