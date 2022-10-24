import { registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';

export const useDelete = async (name: string) => {
  const userList = await getFileUser(registriesPath);

  if (!userList) return log.error(`no user`);

  const useUser = userList.users.find(
    (x) => x.alias === name || (!x.alias && x.name === name)
  );

  if (!useUser) return log.error(`${name} not found`);

  for (let i = 0; i < userList.users.length; i++) {
    if (
      (!userList.users[i].alias && userList.users[i].name === name) ||
      userList.users[i].alias === name
    ) {
      log.success(
        `[delete]: ${userList.users[i].alias}${
          userList.users[i].alias !== userList.users[i].name
            ? `(${userList.users[i].name})`
            : ''
        }`
      );

      userList.users.splice(i, 1);
    }
  }

  await writeFileUser(registriesPath, userList);
};
