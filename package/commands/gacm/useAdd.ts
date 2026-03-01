import { insertUser } from '../../utils/helper';
import { log } from '../../utils/log';
import { isValidEmail, isValidUsername } from '../../utils/validator';

export interface AddCmd {
  name: string
  email: string
  alias: string
}

// 相同的情况直接覆盖更新
export const useAdd = async (cmd: AddCmd) => {
  if (!cmd.name || !cmd.email) {
    log.error('name and email are required');
    return;
  }

  if (!isValidUsername(cmd.name)) {
    log.error(`invalid username format: ${cmd.name}`);
    return;
  }

  if (!isValidEmail(cmd.email)) {
    log.error(`invalid email format: ${cmd.email}`);
    return;
  }

  await insertUser(cmd.name, cmd.email, cmd.alias);
};
