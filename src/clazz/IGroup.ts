import { IPerson } from './IPerson'

export interface IGroup {
  name: string;
  code: string;
  allChecked?: boolean;
  users: Array<IPerson>;
}
