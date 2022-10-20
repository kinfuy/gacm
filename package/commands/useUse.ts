import prompts from 'prompts';
import { registriesPath } from '../config/path';
import { getFileUser } from '../utils/getUserList';
import { log } from '../utils/log';
import { run } from '../utils/shell';
import type { UserInfo } from '../type/shell.type';

export interface UseCmd {
  local?: boolean;
  global?: boolean;
  system?: boolean;
}

export const useUse = async ([name]: string[], cmd: UseCmd) => {
  const userList = await getFileUser(registriesPath);

  if (!userList) return log.error(`no user exists`);

  let useUser: UserInfo | undefined = undefined;
  if (name) {
    useUser = userList.users.find((x) => x.alias === name);
  } else {
    const { user } = await prompts({
      type: 'select',
      name: 'user',
      message: 'Pick a account',
      choices: userList.users.map((x) => {
        return {
          title: `${x.alias}${x.alias === x.name ? '' : `(${x.name})`} ${
            x.email
          }`,
          value: x,
        };
      }),
    });
    if (!user) {
      log.error(`user cancels operation`);
      return;
    }
    useUser = user;
  }

  if (!useUser) return log.error(`${name} not found`);

  let env = 'local';

  if (cmd.system) env = 'system';

  if (cmd.global) env = 'global';

  if (cmd.local) env = 'local';

  await run(`git config --${env} user.name ${useUser.name}`);

  await run(`git config --${env} user.email ${useUser.email}`);

  log.success(
    `git user changed [${env}]:${useUser.alias}${
      useUser.alias !== useUser.name ? `(${useUser.name})` : ''
    }`
  );
};
