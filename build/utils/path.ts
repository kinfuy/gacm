import { resolve } from 'path';
export const rootPath = resolve(__dirname, '..', '..');
export const outputPath = resolve(rootPath, 'dist');
export const enterPath = resolve(rootPath, 'package');

export const libsEnterPath = resolve(enterPath, 'libs');
export const libsoutputPath = resolve(outputPath, 'libs');
