import { gray, green } from 'kolorist';
import prompts from 'prompts';
import { registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { defaultNpmMirror } from '../../config/registry';
import { execCommand } from '../../utils/shell';
import { geneDashLine, printMessages } from '../../utils/tools';
import { log } from '../../utils/log';
import { insertRegistry } from '../../utils/helper';
import type { NrmCmd } from '../../type/shell.type';

export const useLs = async (cmd: NrmCmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registryList = defaultNpmMirror;
  if (userConfig)
    if (!userConfig.registry || userConfig.registry.length === 0) {
      userConfig.registry = registryList;
      writeFileUser(registriesPath, userConfig);
    }
    else { registryList = userConfig.registry; }

  let packageManager = 'npm';
  if (cmd.packageManager)
    packageManager = cmd.packageManager;
  // npm config get registry

  let currectRegistry = '';
  try {
    currectRegistry = await execCommand(packageManager, [
      'config',
      'get',
      'registry'
    ]);
  }
  catch (error) {
    log.error(`${packageManager} is not found`);
    return;
  }

  if (registryList.every(x => x.registry !== currectRegistry))
    // 默认添加本地源
    try {
      const { name } = await prompts({
        type: 'text',
        name: 'name',
        message: `find new registry:${currectRegistry}, please give it a name`
      });
      await insertRegistry(name, name, currectRegistry);

      log.info(`[found new registry]: ${currectRegistry}`);

      registryList.push({
        name,
        registry: currectRegistry,
        home: '',
        alias: name
      });
    }
    catch (error) {}

  const length
    = Math.max(
      ...registryList.map((x) => {
        return x.alias.length + (x.alias !== x.name ? x.name.length : 0);
      })
    ) + 3;
  const prefix = '  ';

  const messages = registryList.map((item) => {
    const currect = item.registry === currectRegistry ? `${green('*')}` : ' ';

    const isSame = item.alias === item.name;

    return `${prefix + currect}${
      isSame ? item.alias : `${item.alias}(${gray(item.name)})`
    }${geneDashLine(item.name, length)}${item.registry}`;
  });

  printMessages(messages);
};
