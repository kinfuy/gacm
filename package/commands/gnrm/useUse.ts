import prompts from 'prompts';
import { registriesPath } from '../../config/path';
import { defaultNpmMirror } from '../../config/registry';
import { getFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';
import { execCommand } from '../../utils/shell';
import type { NrmCmd, RegistryInfo } from '../../type/shell.type';

export const useUse = async ([name]: string[], cmd: NrmCmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registrylist = defaultNpmMirror;
  if (userConfig && userConfig.registry) registrylist = userConfig.registry;

  let useRegistry: RegistryInfo | undefined = undefined;
  if (name) {
    useRegistry = registrylist.find((x) => x.alias === name);
  } else {
    const { registry } = await prompts({
      type: 'select',
      name: 'registry',
      message: 'Pick a registry',
      choices: registrylist.map((x) => {
        return {
          title: `${x.alias}${x.alias === x.name ? '' : `(${x.name})`} ${
            x.registry
          }`,
          value: x,
        };
      }),
    });
    if (!registry) {
      log.error(`user cancel operation`);
      return;
    }
    useRegistry = registry;
  }
  if (!useRegistry) return log.error(`${name} not found`);

  let packageManager = 'npm';
  if (cmd.packageManager) packageManager = cmd.packageManager;

  await execCommand(packageManager, [
    'config',
    'set',
    'registry',
    useRegistry.registry,
  ]).catch(() => {
    log.error(`${packageManager} is not found`);
    return;
  });

  log.success(
    `${packageManager} registry changed :${useRegistry.alias}${
      useRegistry.alias !== useRegistry.name ? `(${useRegistry.name})` : ''
    }`
  );
};
