
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

export interface DetailParam extends BillItem {
    date: string,
    year: Year,
    month: Month,
    day: number,
    week: string
}
