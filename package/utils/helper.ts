import { registriesPath } from '../config/path';
import pkg from '../../package.json';
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
  let userConfig = await getFileUser(registriesPath);
  if (!userConfig)
    userConfig = {
      version: pkg.version,
      users: [],
      registry: [],
    } as UserInfoJson;
  if (!userConfig.version)
    userConfig = transformData(userConfig as unknown as UserOldInfoJson);

  if (isExistAlias(userConfig.users, alias, name, email)) {
    userConfig.users.forEach((user) => {
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
    userConfig.users.push({
      name,
      email,
      alias,
    });

    log.success(`[add]: ${alias} ${alias !== name ? `(${name})` : ''}`);
  }

  await writeFileUser(registriesPath, userConfig);
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

export const insertRegistry = async (
  name: string,
  alias: string,
  registry: string,
  home?: string
) => {
  let userConfig = await getFileUser(registriesPath);
  if (!userConfig)
    userConfig = {
      version: pkg.version,
      users: [],
      registry: [],
    } as UserInfoJson;
  if (!userConfig.registry) userConfig.registry = [];
  const isExist = userConfig.registry?.some((x) => x.alias === alias);
  if (isExist) {
    userConfig.registry?.forEach((x) => {
      if (x.alias === alias) {
        x.alias = alias;
        x.name = name;
        x.home = home || '';
        x.registry = registry;
      }
    });
  } else {
    userConfig.registry?.push({
      alias,
      name,
      home: home || '',
      registry,
    });
  }
  await writeFileUser(registriesPath, userConfig);
};
