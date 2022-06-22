import { resolve } from 'path';
import { buildTypescriptLib } from '@alqmc/build-ts';
import { enterPath, outputPath, rootPath } from './utils/path';
import type { DefineLibConfig } from '@alqmc/build-ts';

const buildConfig: DefineLibConfig = {
  baseOptions: {
    input: resolve(enterPath, 'main.ts'),
    outPutPath: outputPath,
    enterPath,
    pkgPath: resolve(enterPath, 'package.json'),
    tsConfigPath: resolve(rootPath, 'tsconfig.json'),
    preserveModules: false,
    extraOptions: {
      banner: '#!/usr/bin/env node',
    },
  },
  buildProduct: ['lib'],
  pureOutput: true,
};

export const buildBundle = async () => {
  return buildTypescriptLib(buildConfig);
};
