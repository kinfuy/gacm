import { registriesPath } from '../config/path';
import { getFileUser, writeFileUser } from './getUserList';
import { log } from './log';
import type {
  UserInfo,
  UserInfoJson,
  UserOldInfoJson,
} from '../type/shell.type';

/**
 * 插入用户
 * @param name
 * @param email
 * @param alias
 */
export const insertUser = async (name: string, email: string, alias = name) => {
  let userList = await getFileUser(registriesPath);
  if (!userList) userList = { version: '', users: [] } as UserInfoJson;
  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);

  if (isExistAlias(userList.users, alias, name, email)) {
    userList.users.forEach((user) => {
      if (
        user.alias === alias ||
        (!user.alias && user.name === alias) ||
        (name && email && user.name === name && user.email === email)
      ) {
        user.alias = alias === name ? (user.alias ? user.alias : alias) : alias;

        user.email = email;

        user.name = name;

        log.success(
          `[update]:${alias} ${user.alias !== name ? `(${user.name})` : ''}`
        );
      }
    });
  } else {
    userList.users.push({
      name,
      email,
      alias,
    });

    log.success(`[add]: ${alias} ${alias !== name ? `(${name})` : ''}`);
  }

  await writeFileUser(registriesPath, userList);
};

export const transformData = (data: UserOldInfoJson): UserInfoJson => {
  const userInfo: UserInfoJson = { version: '', users: [] };
  Object.keys(data).forEach((x) => {
    userInfo.users.push({
      name: data[x].name,
      email: data[x].email,
      alias: data[x].name,
    });
  });

  return userInfo;
};

export const isExistAlias = (
  users: UserInfo[],
  alias: string,
  name?: string,
  email?: string
) => {
  return users.some(
    (x) =>
      x.alias === alias ||
      (!x.alias && x.name === alias) ||
      (name && email && x.name === name && x.email === email)
  );
};
