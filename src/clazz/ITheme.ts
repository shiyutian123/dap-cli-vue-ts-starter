/*
 * @Author: DevinShi
 * @Date: 2020-02-05 06:43:07
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-05 06:54:01
 * @Description: file content description
 */
export interface ITheme {
  navTheme: 'dark' | 'light';
  primaryColor: string;
  contentWidth: 'fixed' | 'fluid';
  layout: 'horizontal' | 'vertical';
  siderWidth: number;
  headerFixed: boolean;
  siderFixed: boolean;
  mutliTab: boolean;
  production: boolean; // process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
}
