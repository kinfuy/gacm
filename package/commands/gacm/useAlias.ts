import { registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';
import { isExistAlias } from '../../utils/helper';
import type { UserInfoJson } from '../../type/shell.type';

export const useAlias = async (origin: string, target: string) => {
  if (!origin || !target)
    return;

  let userList = await getFileUser(registriesPath);

  if (!userList)
    userList = { version: '', users: [] } as UserInfoJson;

  let changed = false;

  userList.users.forEach((x) => {
    if (x.alias === origin) {
      if (userList && !isExistAlias(userList?.users, target)) {
        x.alias = target;

        log.success(`[update]: ${origin}=>${x.alias} (${x.name})`);
      }
      else {
        log.error(`${target} is exist, please enter another one `);
      }

      changed = true;
    }
  });

  if (!changed)
    return log.error(`${origin} not found`);

  await writeFileUser(registriesPath, userList);
};
