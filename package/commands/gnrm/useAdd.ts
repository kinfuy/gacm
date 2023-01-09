import { insertRegistry } from '../../utils/helper';

export interface AddCmd {
  name: string
  registry: string
  alias: string
}
// 相同的情况直接覆盖更新
export const useAdd = async (cmd: AddCmd) => {
  if (cmd.name && cmd.registry) {
    const alias = cmd.alias || cmd.name;
    await insertRegistry(cmd.name, alias, cmd.registry);
  }
};
