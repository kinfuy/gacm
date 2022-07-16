import { green } from 'kolorist';
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
  if (userList.users.every((x) => x.name !== name && x.alias !== name))
    return log.error(`${name} not found`);

  const useUser = userList.users.filter(
    (x) => x.alias === name || x.name === name
  );

  let env = 'local';
  if (cmd.system) env = 'system';
  if (cmd.global) env = 'global';
  if (cmd.local) env = 'local';
  await run(`git config --${env} user.name ${useUser[0].name}`);
  await run(`git config --${env} user.email ${useUser[0].email}`);
  log.success(
    `\n   git user changed [${env}]:${
      useUser[0].alias && `(${useUser[0].alias})`
    }${useUser[0].name}\n`
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
      alias: '',
    });
  }

  const length =
    Math.max(
      ...userList.users.map(
        (user) => user.name.length + (user.alias ? user.alias.length : 0)
      )
    ) + 3;
  const prefix = '  ';

  const messages = userList.users.map((user) => {
    const currect =
      user.name === currectUser && user.email === currectEmail
        ? `${green('*')}`
        : '';
    return `${prefix + currect + user.name}${
      user.alias && `(${user.alias})`
    }${geneDashLine(user.name, length)}${user.email}`;
  });

  printMessages(messages);
};

export const addAction = async (cmd: AddCmd) => {
  if (cmd.name && cmd.email) {
    await insertUser(cmd.name, cmd.email, cmd.alias);
  }
};

export const deleteAction = async (
  name: string,
  { alias }: { alias: boolean }
) => {
  let userList = await getFileUser(registriesPath);
  if (!userList) return log.error(`no user`);
  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);
  const useUser = userList.users.filter(
    (x) => x.name === name || (alias && x.alias === name)
  );
  if (useUser.length === 0) return log.error(`${name} not found`);

  for (let i = 0; i < userList.users.length; i++) {
    if (alias && userList.users[i].alias === name) {
      log.success(
        `[delete]: ${
          userList.users[i].alias && `(${userList.users[i].alias})`
        }${userList.users[i].name}`
      );
      userList.users.splice(i, 1);
    } else if (userList.users[i].name === name) {
      if (!userList.users[i].alias) {
        log.success(
          `[delete]: ${
            userList.users[i].alias && `(${userList.users[i].alias})`
          }${userList.users[i].name}`
        );
        userList.users.splice(i, 1);
      } else {
        log.error(
          `${name} has alias, please use gacm delete <alias> -a to delete`
        );
      }
    }
  }
  await writeFileUser(registriesPath, userList);
};

export const aliasAction = async (
  origin: string,
  target: string,
  { alias }: { alias: string }
) => {
  if (!origin || !target) return;
  let userList = await getFileUser(registriesPath);
  if (!userList) userList = { version: gacmVersion, users: [] } as UserInfoJson;

  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);
  let changed = false;
  userList.users.forEach((x) => {
    if (alias) {
      if (x.alias === origin) {
        if (userList && !isExistAlias(userList.users, target)) {
          x.alias = target;
          log.success(`[update]:(${origin}=>${x.alias}) ${x.name}`);
        } else {
          log.error(`${target} is Exist, please enter another one `);
        }
        changed = true;
      }
    } else {
      if (x.name === origin) {
        if (!x.alias) {
          if (userList && !isExistAlias(userList.users, target)) {
            x.alias = target;
            log.success(`[update]:(${origin}=>${x.alias}) ${x.name}`);
          } else {
            log.error(`${target} is Exist, please enter another one `);
          }
        } else {
          log.error(
            `${x.name} has alias, please use gacm alias <alias> <target> -a to alias`
          );
        }
        changed = true;
      }
    }
  });
  if (!changed) return log.error(`${origin} not found`);
  await writeFileUser(registriesPath, userList);
};

// 插入用户
export const insertUser = async (name: string, email: string, alias = '') => {
  let userList = await getFileUser(registriesPath);
  if (!userList) userList = { version: gacmVersion, users: [] } as UserInfoJson;

  if (!userList.version)
    userList = transformData(userList as unknown as UserOldInfoJson);
  if (isExist(userList.users, name, email, alias)) {
    userList.users.forEach((user) => {
      if (
        (user.name === name && user.email === email) ||
        (!alias && !user.alias && user.name === name) ||
        (alias && user.alias === alias)
      ) {
        if (userList && !isExistAlias(userList.users, name)) {
          user.alias = alias || user.alias;
          user.email = email;
          user.name = name;
          log.success(`[update]:${user.alias && `(${user.alias})`} ${name}`);
        } else {
          log.error(`${name} is alias, please enter another one `);
        }
      }
    });
  } else {
    if (userList && !isExistAlias(userList.users, name)) {
      userList.users.push({
        name,
        email,
        alias,
      });
      log.success(`[add]:${alias && `(${alias})`} ${name}`);
    } else {
      log.error(`${name} is alias, please enter another one `);
    }
  }
  userList.users.filter((x) => {
    return (
      userList &&
      userList.users.filter((y) => x.name === y.name && x.email === y.email)
        .length === 1
    );
  });
  userList.users = uniqueFunc(userList.users, (item) => {
    return `${item.name + item.email}`;
  });
  await writeFileUser(registriesPath, userList);
};

export const transformData = (data: UserOldInfoJson): UserInfoJson => {
  const userInfo: UserInfoJson = { version: gacmVersion, users: [] };
  Object.keys(data).forEach((x) => {
    userInfo.users.push({
      name: data[x].name,
      email: data[x].email,
      alias: '',
    });
  });
  return userInfo;
};

export const isExist = (
  users: UserInfo[],
  name: string,
  email: string,
  alias?: string
) => {
  return users.some(
    (x) =>
      (x.name === name && x.email === email) ||
      (!alias && !x.alias && x.name === name) ||
      (alias && x.alias === alias)
  );
};

export const isExistAlias = (users: UserInfo[], alias: string) => {
  return users.some((x) => x.alias === alias);
};

const uniqueFunc = <T>(arr: T[], uniId: (item: T) => string) => {
  const res = new Map();
  return arr.filter(
    (item: T) => !res.has(uniId(item)) && res.set(uniId(item), 1)
  );
};
