import { insertUser } from '../../utils/helper';

export interface AddCmd {
  name: string;
  email: string;
  alias: string;
}
// 相同的情况直接覆盖更新
export const useAdd = async (cmd: AddCmd) => {
  if (cmd.name && cmd.email) {
    await insertUser(cmd.name, cmd.email, cmd.alias);
  }
};
