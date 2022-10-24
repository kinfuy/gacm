import { registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';
import type { UserInfoJson } from '../../type/shell.type';

export const useAlias = async (origin: string, target: string) => {
  if (!origin || !target) return;

  let useConfig = await getFileUser(registriesPath);

  if (!useConfig)
    useConfig = { version: '', users: [], registry: [] } as UserInfoJson;
  if (!useConfig.registry) useConfig.registry = [];

  let changed = false;

  useConfig.registry?.forEach((x) => {
    if (x.alias === origin) {
      if (useConfig && useConfig.registry?.every((x) => x.alias !== target)) {
        x.alias = target;
        log.success(`[update]: ${origin}=>${x.alias} (${x.name})`);
      } else {
        log.error(`${target} is exist, please enter another one `);
      }

      changed = true;
    }
  });

  if (!changed) return log.error(`${origin} not found`);

  await writeFileUser(registriesPath, useConfig);
};
