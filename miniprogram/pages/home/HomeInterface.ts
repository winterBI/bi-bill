
import { Type } from "../add/addInterface"

export type Year = string | number
export type Month = string | number

export interface Category {
    type: Type;
    id: number;
    icon: string;
    select_icon: string;
    user_id: number;
}

export interface BillItem {
    id: number;
    description: string;
    type: Type;
    amount: number;
    category: Category;
}

export interface BillList {
    year: Year;
    month: Month;
    day: number;
    week: string;
    income: number;
    pay: number;
    item: BillItem[];
}

export interface BillData {
    year: Year;
    month: Month;
    total_income: number;
    total_pay: number;
    data: BillList[];
}

export interface DateParam {
    year: Year;
    month: Month;
}

// 查看订单的参数
export interface DetailParam extends BillItem {
    date: string,
    year: Year,
    month: Month,
    day: number,
    week: string
}

// 通知
export interface Notice{
    id: number;
    title: string;
    content: string;
    start_time: null | number;
    expired_tme: null | number;
    continued_time: number;
    type: number;
    status: number;
  }
  
  