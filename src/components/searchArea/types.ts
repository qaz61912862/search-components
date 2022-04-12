import { ElInput, ElSelect } from 'element-plus';

export type IConfigItem = {
  [key in keyof typeof ElInput]?: (typeof ElInput)[key];
} & {
    [key in keyof typeof ElSelect]?: (typeof ElSelect)[key];
  } & {
    name: string;
    component?: 'input' | 'select' | 'datePicker';
    valueName?: string | string[];
    placeholder?: string | string[];
    // 下拉组件options
    options?: {
      [key: string]: string;
    }[];
    // 下拉组件options的label的name
    optionLabel?: string;
    // 下拉组件options的value的name
    optionValue?: string;
    // 日期组件不可用日期
    disabledDate?: (time: Date) => boolean;
  };
