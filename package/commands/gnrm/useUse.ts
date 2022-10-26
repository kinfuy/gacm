import prompts from 'prompts';
import { registriesPath } from '../../config/path';
import { defaultNpmMirror } from '../../config/registry';
import { getFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';
import { execCommand } from '../../utils/shell';
import type { NrmCmd, RegistryInfo } from '../../type/shell.type';

const defaultPackageManager = ['npm', 'yarn', 'npm', 'pnpm'];

export const useUse = async ([name]: string[], cmd: NrmCmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registrylist = defaultNpmMirror;
  let packageManager = 'npm';
  if (userConfig && userConfig.registry) registrylist = userConfig.registry;

  let useRegistry: RegistryInfo | undefined = undefined;
  if (name) {
    useRegistry = registrylist.find((x) => x.alias === name);
  } else {
    const { registry, pkg } = await prompts([
      {
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
      },
      {
        type: 'select',
        name: 'pkg',
        message: 'Pick a packageManager,and you will set registry for it',
        initial: 0,
        choices: defaultPackageManager.map((x) => ({
          title: x,
          value: x,
        })),
      },
    ]);

    if (pkg) packageManager = pkg;

    if (!registry) {
      log.error(`user cancel operation`);
      return;
    }
    useRegistry = registry;
  }
  if (!useRegistry) return log.error(`${name} not found`);

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
    `${packageManager} registry has been set to:  ${useRegistry.registry}`
  );
};
