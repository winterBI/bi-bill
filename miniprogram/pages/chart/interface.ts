interface Category{
  id: number;
  icon: string;
  select_icon: string;
  user_id: number;
  type: number;
  name: string;
}

interface DataItem{
  amount: number;
  category: Category;
}

// 返回的数据格式
export interface chartData{
  ok: boolean;
  msg: string;
  data: DataItem[];
}

// 获取数据的参数
export interface Params {
  year: string | number,
  month: string | number,
  type: 1 | 2,
  dateType: 1 | 2,
}