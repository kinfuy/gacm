import { existsSync, promises } from 'fs';
import type { UserInfoJson, UserOldInfoJson } from '../type/shell.type';
import { log } from './log';
import { transformData } from './helper';
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
