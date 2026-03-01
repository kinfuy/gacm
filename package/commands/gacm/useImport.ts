import { existsSync, promises } from 'fs';
import { registriesPath } from '../../config/path';
import { writeFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';
import type { UserInfoJson } from '../../type/shell.type';

const { readFile } = promises;

export interface ImportCmd {
  file: string
  merge?: boolean
}

export const useImport = async (cmd: ImportCmd) => {
  if (!cmd.file) {
    log.error('Please specify a file to import with --file <path>');
    return;
  }

  if (!existsSync(cmd.file)) {
    log.error(`File not found: ${cmd.file}`);
    return;
  }

  try {
    const fileContent = await readFile(cmd.file, 'utf-8');
    const importedConfig = JSON.parse(fileContent) as UserInfoJson;

    // 验证配置格式
    if (!importedConfig.version || !Array.isArray(importedConfig.users)) {
      log.error('Invalid configuration format');
      return;
    }

    if (cmd.merge) {
      // 合并模式：读取现有配置并合并
      const existingConfig = await readFile(registriesPath, 'utf-8').catch(() => null);
      if (existingConfig) {
        const existing = JSON.parse(existingConfig) as UserInfoJson;
        // 合并用户列表（去重）
        const userMap = new Map();
        [...existing.users, ...importedConfig.users].forEach((user) => {
          const key = `${user.name}:${user.email}`;
          userMap.set(key, user);
        });
        importedConfig.users = Array.from(userMap.values());

        // 合并 registry 列表（去重）
        if (existing.registry && importedConfig.registry) {
          const registryMap = new Map();
          [...existing.registry, ...importedConfig.registry].forEach((reg) => {
            registryMap.set(reg.alias, reg);
          });
          importedConfig.registry = Array.from(registryMap.values());
        }
      }
    }

    await writeFileUser(registriesPath, importedConfig);
    log.success(`Configuration imported from: ${cmd.file}`);
  }
  catch (error: any) {
    log.error(`Failed to import configuration: ${error.message}`);
  }
};
