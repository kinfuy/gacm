import { gray, green } from 'kolorist';
import { registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { execCommand, run } from '../../utils/shell';
import { geneDashLine, printMessages } from '../../utils/tools';
import { log } from '../../utils/log';
import { version as gacmVersion } from '../../package.json';
import type {
  AddCmd,
  UseCmd,
  UserInfo,
  UserInfoJson,
  UserOldInfoJson,
} from '../../type/shell.type';

export const useAction = async (name: string, cmd: UseCmd) => {
  let userList = await getFileUser(registriesPath);
  if (!userList) return log.error(`${name} not found`);
  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);
  if (userList.users.every((x) => x.alias !== name))
    return log.error(`${name} not found`);

  const useUser = userList.users.filter((x) => x.alias === name);

  let env = 'local';
  if (cmd.system) env = 'system';
  if (cmd.global) env = 'global';
  if (cmd.local) env = 'local';
  await run(`git config --${env} user.name ${useUser[0].name}`);
  await run(`git config --${env} user.email ${useUser[0].email}`);

  log.success(
    `git user changed [${env}]:${useUser[0].alias}${
      useUser[0].alias !== useUser[0].name ? `(${useUser[0].name})` : ''
    }`
  );
};

export const lsAction = async () => {
  let userList = (await getFileUser(registriesPath)) || ({} as UserInfoJson);
  const currectUser = await execCommand('git', ['config', 'user.name']);
  const currectEmail = await execCommand('git', ['config', 'user.email']);
  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);

  if (userList.users.length === 0 && (!currectUser || !currectEmail)) {
    return log.info('no user');
  }

  if (
    !userList.users.some((x) => x.name === currectUser) &&
    currectUser &&
    currectEmail
  ) {
    // 默认添加本地账户
    await insertUser(currectUser, currectEmail);
    log.info(`[found new user]: ${currectUser}`);
    userList.users.push({
      name: currectUser,
      email: currectEmail,
      alias: currectUser,
    });
  }

  const length =
    Math.max(
      ...userList.users.map(
        (user) =>
          user.alias.length + (user.alias !== user.name ? user.name.length : 0)
      )
    ) + 3;
  const prefix = '  ';

  const messages = userList.users.map((user) => {
    const currect =
      user.name === currectUser && user.email === currectEmail
        ? `${green('*')}`
        : '';
    const isSame = user.alias === user.name;
    return `${prefix + currect}${
      isSame ? user.alias : `${user.alias}(${gray(user.name)})`
    }${geneDashLine(user.name, length)}${user.email}`;
  });

  printMessages(messages);
};

export const addAction = async (cmd: AddCmd) => {
  if (cmd.name && cmd.email) {
    await insertUser(cmd.name, cmd.email, cmd.alias);
  }
};

export const deleteAction = async (name: string) => {
  let userList = await getFileUser(registriesPath);
  if (!userList) return log.error(`no user`);
  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);
  const useUser = userList.users.filter(
    (x) => x.alias === name || (!x.alias && x.name === name)
  );
  if (useUser.length === 0) return log.error(`${name} not found`);

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

export const aliasAction = async (origin: string, target: string) => {
  if (!origin || !target) return;
  let userList = await getFileUser(registriesPath);
  if (!userList) userList = { version: gacmVersion, users: [] } as UserInfoJson;

  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);

  let changed = false;
  userList.users.forEach((x) => {
    if (x.alias === origin) {
      if (userList && !isExistAlias(userList?.users, target)) {
        x.alias = target;
        log.success(`[update]: ${origin}=>${x.alias} (${x.name})`);
      } else {
        log.error(`${target} is exist, please enter another one `);
      }
      changed = true;
    }
  });
  if (!changed) return log.error(`${origin} not found`);
  await writeFileUser(registriesPath, userList);
};

// 插入用户
export const insertUser = async (name: string, email: string, alias = name) => {
  let userList = await getFileUser(registriesPath);
  if (!userList) userList = { version: gacmVersion, users: [] } as UserInfoJson;

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
  const userInfo: UserInfoJson = { version: gacmVersion, users: [] };
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
