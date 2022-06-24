/* eslint-disable no-console */
import { resolve } from 'path';
import { green } from 'kolorist';
import { outputPath, registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { execCommand, run } from '../../utils/shell';
import { geneDashLine, printMessages } from '../../utils/tools';
import { log } from '../../utils/log';
import type { AddCmd, UseCmd, UserInfoJson } from '../../type/shell.type';

export const useAction = async (name: string, cmd: UseCmd) => {
  const userList = await getFileUser(registriesPath);
  if (!userList) return;
  if (!userList[name]) return log.error(`${name} not found`);
  let env = 'local';
  if (cmd.system) env = 'system';
  if (cmd.global) env = 'global';
  if (cmd.local) env = 'local';
  await run(`git config --${env} user.name ${userList[name].name}`);
  await run(`git config --${env} user.email ${userList[name].email}`);
  log.success(`\n   git user changed [${env}]:${userList[name].name}\n`);
};

export const lsAction = async () => {
  const userList = await getFileUser(registriesPath);
  if (!userList) return log.info('no user');
  if (Object.keys(userList).length === 0) return log.info('no user');
  const keys = Object.keys(userList);
  const length = Math.max(...keys.map((key) => key.length)) + 3;
  const prefix = '  ';
  const currectUser = await execCommand('git', ['config', 'user.name']);
  const currectEmail = await execCommand('git', ['config', 'user.email']);

  if (!keys.includes(currectUser) && currectUser && currectEmail) {
    // 默认添加本地账户
    await insertUser(currectUser, currectEmail);
    log.success(`[found new user]: ${currectUser}`);
    keys.push(currectUser);
    userList[currectUser] = {
      name: currectUser,
      email: currectEmail,
    };
  }

  const messages = keys.map((key) => {
    const registry = userList[key];
    const currect = registry.name === currectUser ? `${green('*')}` : '';
    return (
      prefix +
      currect +
      registry.name +
      geneDashLine(key, length) +
      registry.email
    );
  });

  printMessages(messages);
};

export const addAction = async (cmd: AddCmd) => {
  if (cmd.name && cmd.email) {
    await insertUser(cmd.name, cmd.email);
    log.success(`[add]: ${cmd.name}`);
  }
};

export const deleteAction = async (name: string) => {
  const userList = await getFileUser(registriesPath);
  if (!userList) return log.error(`no user`);
  if (!userList[name]) return log.error(`${name} not found`);
  delete userList[name];
  await writeFileUser(resolve(outputPath, `registries.json`), userList);
  log.success(`[delete]: ${name}`);
};

// 插入用户 同名覆盖更新
export const insertUser = async (name: string, email: string) => {
  let userList = await getFileUser(registriesPath);
  if (!userList) userList = {} as UserInfoJson;
  userList[name] = {
    name,
    email,
  };
  await writeFileUser(resolve(outputPath, `registries.json`), userList);
};
