import { promises } from 'fs';
import { log } from './log';
import type { UserInfoJson } from '../type/shell.type';
const { readFile, writeFile } = promises;

/**
 * 获取用户
 * @param path
 * @returns
 */
export const getFileUser = async (rootPath: string) => {
  const fileBuffer = await readFile(rootPath, 'utf-8');
  const userList = fileBuffer
    ? (JSON.parse(fileBuffer.toString()) as UserInfoJson)
    : null;
  return userList;
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
