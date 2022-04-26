/* eslint-disable no-console */
import { resolve } from 'path';
import { outputPath, registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { run } from '../../utils/shell';
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
  const messages = keys.map((key) => {
    const registry = userList[key];
    return prefix + registry.name + geneDashLine(key, length) + registry.email;
  });
  printMessages(messages);
};

export const addAction = async (cmd: AddCmd) => {
  let userList = await getFileUser(registriesPath);
  if (!userList) userList = {} as UserInfoJson;
  userList[cmd.name] = {
    name: cmd.name,
    email: cmd.email,
  };
  await writeFileUser(resolve(outputPath, `registries.json`), userList);
  log.success(`[add]: ${cmd.name}`);
};

export const deleteAction = async (name: string) => {
  const userList = await getFileUser(registriesPath);
  if (!userList) return log.error(`no user`);
  if (!userList[name]) return log.error(`${name} not found`);
  delete userList[name];
  await writeFileUser(resolve(outputPath, `registries.json`), userList);
  log.success(`[delete]: ${name}`);
};
