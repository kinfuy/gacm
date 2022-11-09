// 基于打包后的路径 dist
import { join, resolve } from 'path';
export const rootPath = __dirname;
export const outputPath = __dirname;
export const enterPath = resolve(rootPath, 'package');
export const HOME =
  process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] || '';
export const registriesPath = join(HOME, '.gacmrc');
