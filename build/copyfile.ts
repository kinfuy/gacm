import { resolve } from 'path';
import { copyFile } from 'fs/promises';
import { copy } from 'fs-extra';
import { enterPath, outputPath, rootPath } from './utils/path';
export const copyFiles = async () => {
  Promise.all([
    copyFile(
      resolve(enterPath, 'package.json'),
      resolve(outputPath, 'package.json')
    ),
    copy(resolve(enterPath, 'assets'), resolve(outputPath, 'assets'), {
      recursive: true
    }),
    copyFile(resolve(rootPath, 'README.md'), resolve(outputPath, 'README.md'))
  ]);
};
