// 基于打包后的路径 dist
import { resolve } from 'path';
export const rootPath = __dirname;
export const outputPath = __dirname;
export const enterPath = resolve(rootPath, 'package');

export const registriesPath = resolve(outputPath, 'registries.json');
