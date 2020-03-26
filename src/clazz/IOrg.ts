export interface IOrgNode {
  title: string;
  key: string;
  disabled: boolean; // 是否启用
  children: Array<IOrgNode>;
  isLeaf: boolean; // 是否拥有子组织
  orgId: string;
  orgCode: string;
  disableCheckbox?: boolean; // 是否禁用复选框
}
