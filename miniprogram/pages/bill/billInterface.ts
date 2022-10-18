export type Year = number | string

export interface DataItem{
    income: number;
    last: number;
    month: number;
    pay: number;
  }
  
  export interface BillList{
    data: DataItem[];
    total_income: number;
    total_last: number;
    total_pay: number;
    year: Year;
  }
  
  