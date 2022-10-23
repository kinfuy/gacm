import { resolve } from 'path';
import { buildTypescriptLib } from '@alqmc/build-ts';
import { enterPath, outputPath, rootPath } from './utils/path';
import type { DefineLibConfig } from '@alqmc/build-ts';

const buildGacmConfig: DefineLibConfig = {
  baseOptions: {
    input: resolve(enterPath, 'gacm.ts'),
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

const buildGnrmConfig: DefineLibConfig = {
  baseOptions: {
    input: resolve(enterPath, 'gnrm.ts'),
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
  await buildTypescriptLib(buildGacmConfig);
  await buildTypescriptLib(buildGnrmConfig);
};
