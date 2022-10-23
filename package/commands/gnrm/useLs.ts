import { gray, green } from 'kolorist';
import { registriesPath } from '../../config/path';
import { getFileUser } from '../../utils/getUserList';
import { defaultNpmMirror } from '../../config/registry';
import { execCommand } from '../../utils/shell';
import { geneDashLine, printMessages } from '../../utils/tools';
import { log } from '../../utils/log';
import type { NrmCmd } from '../../type/shell.type';

export const useLs = async (cmd: NrmCmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registry = defaultNpmMirror;
  if (userConfig && userConfig.registry) registry = userConfig.registry;

  let packageManager = 'npm';
  if (cmd.packageManager) packageManager = cmd.packageManager;
  // npm config get registry

  let currectRegistry = '';
  try {
    currectRegistry = await execCommand(packageManager, [
      'config',
      'get',
      'registry',
    ]);
  } catch (error) {
    log.error(`${packageManager} is not found`);
    return;
  }

  const length =
    Math.max(
      ...registry.map((x) => {
        return x.alias.length + (x.alias !== x.name ? x.name.length : 0);
      })
    ) + 3;
  const prefix = '  ';

  const messages = registry.map((item) => {
    const currect = item.registry === currectRegistry ? `${green('*')}` : '';

    const isSame = item.alias === item.name;

    return `${prefix + currect}${
      isSame ? item.alias : `${item.alias}(${gray(item.name)})`
    }${geneDashLine(item.name, length)}${item.registry}`;
  });

  printMessages(messages);
};
