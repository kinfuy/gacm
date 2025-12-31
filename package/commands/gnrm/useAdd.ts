import { insertRegistry } from '../../utils/helper';
import { log } from '../../utils/log';
import { isValidUrl } from '../../utils/validator';

export interface AddCmd {
  name: string
  registry: string
  alias: string
}

// 相同的情况直接覆盖更新
export const useAdd = async (cmd: AddCmd) => {
  if (!cmd.name || !cmd.registry) {
    log.error('name and registry are required');
    return;
  }

  if (!isValidUrl(cmd.registry)) {
    log.error(`invalid registry URL format: ${cmd.registry}`);
    return;
  }

  const alias = cmd.alias || cmd.name;
  await insertRegistry(cmd.name, alias, cmd.registry);
};
