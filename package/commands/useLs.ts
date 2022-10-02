import { gray, green } from 'kolorist';
import { registriesPath } from '../config/path';
import { getFileUser } from '../utils/getUserList';
import { execCommand } from '../utils/shell';
import { log } from '../utils/log';
import { geneDashLine, printMessages } from '../utils/tools';
import { insertUser } from '../utils/helper';
import type { UserInfoJson } from '../type/shell.type';

export const useLs = async () => {
  const userList = (await getFileUser(registriesPath)) || ({} as UserInfoJson);

  const currectUser = await execCommand('git', ['config', 'user.name']);

  const currectEmail = await execCommand('git', ['config', 'user.email']);

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
