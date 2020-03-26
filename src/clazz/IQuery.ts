export interface IQueryItem {
  label: string;
  code: string;
  compare: string; // 查询条件
  modelType: string; // 组件的类型
  inputType: string; // 输入值的类型
  inputValue: Array<any>; // 输入框的值
  disable: boolean; // 是否禁用
  // extraInfo?: IQuerySelectExtra | IQuerySwitchExtra;
  extraInfo?: any;
  isPlaceholder?: boolean; // 是否是用来占位的空对象
}

export interface IQuerySelectExtra {
  option: Array<IQuerySelectOption>;
  dsType: string;
  modelCode: string; // 数据模型编码
  fieldCode: string; // 数据模型的字段编码
  ds: string | Array<any>;
}

export interface IQuerySelectOption {
  code: string;
  meaning: string;
}

export interface IQuerySwitchExtra {
  switchOpenName: string;
  switchCloseName: string;
}

export interface IDataFilterItem {
  connector: string;
  field: string;
  operation: string;
  params: Array<any>;
  type: string;
}
