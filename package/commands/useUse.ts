import { registriesPath } from '../config/path';
import { getFileUser } from '../utils/getUserList';
import { log } from '../utils/log';
import { run } from '../utils/shell';

export interface UseCmd {
  local?: boolean;
  global?: boolean;
  system?: boolean;
}

export const useUse = async (name: string, cmd: UseCmd) => {
  const userList = await getFileUser(registriesPath);

  if (!userList) return log.error(`${name} not found`);

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
