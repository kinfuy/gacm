import { existsSync, promises } from 'fs';
import { registriesPath } from '../config/path';
import { defaultNpmMirror } from '../config/registry';
import type { UserInfoJson, UserOldInfoJson } from '../type/shell.type';
import { log } from './log';
import { transformData } from './tools';

const { readFile, writeFile } = promises;

/**
 * 获取用户
 * @param path
 * @returns
 */
export const getFileUser = async (rootPath: string) => {
  if (existsSync(rootPath)) {
    const fileBuffer = await readFile(rootPath, 'utf-8');
    let userList = fileBuffer
      ? (JSON.parse(fileBuffer.toString()) as UserInfoJson)
      : null;
    if (userList && !userList.version)
      userList = transformData(userList as unknown as UserOldInfoJson);

    return userList;
  }
  return null;
};

/**
 * 将shell写入文件
 * @param dir
 * @param data
 */
export async function writeFileUser(dir: string, data: UserInfoJson) {
  writeFile(dir, JSON.stringify(data, null, 4)).catch((error) => {
    log.error(error as string);
    process.exit(0);
  });
}

/**
 * 检查是否写入过Registry
 * @returns Registrys
 */
export const checkRegistry = async () => {
  const userConfig = await getFileUser(registriesPath);
  let registryList = defaultNpmMirror;
  if (userConfig)
    if (!userConfig.registry || userConfig.registry.length === 0) {
      userConfig.registry = registryList;
      writeFileUser(registriesPath, userConfig);
    }
    else { registryList = userConfig.registry; }
  return registryList;
};
