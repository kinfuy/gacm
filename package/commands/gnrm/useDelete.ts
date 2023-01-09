import { registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';

export const useDelete = async (name: string) => {
  const userConfig = await getFileUser(registriesPath);

  if (!userConfig)
    return log.error('no registry');

  if (!userConfig.registry)
    return log.error('no registry');

  const useRegistry = userConfig.registry.find(x => x.alias === name);

  if (!useRegistry)
    return log.error(`${name} not found`);

  for (let i = 0; i < userConfig.registry.length; i++)
    if (userConfig.registry[i].alias === name) {
      log.success(
        `[delete]: ${userConfig.registry[i].alias}  ${userConfig.registry[i].registry}`
      );
      userConfig.registry.splice(i, 1);
    }

  await writeFileUser(registriesPath, userConfig);
};
