/*
 * @Author: DevinShi
 * @Date: 2020-02-05 01:25:05
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-05 01:25:12
 * @Description: file content description
 */
export interface IMenu {
  key: string;
  title: string;
  icon: string;
  img?: any;
  children: Array<IMenu>;
  meta?: any; // 路由跳转所需参数
}
