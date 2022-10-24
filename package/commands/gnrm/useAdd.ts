import { insertRegistry } from '../../utils/helper';

export interface AddCmd {
  name: string;
  registry: string;
  alias: string;
}
// 相同的情况直接覆盖更新
export const useAdd = async (cmd: AddCmd) => {
  if (cmd.name && cmd.registry) {
    await insertRegistry(cmd.name, cmd.registry, cmd.alias);
  }
};
