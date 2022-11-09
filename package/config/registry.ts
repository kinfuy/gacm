import type { RegistryInfo } from '../type/shell.type';

export const defaultNpmMirror: RegistryInfo[] = [
  {
    name: 'npm',
    alias: 'npm',
    home: 'https://www.npmjs.org',
    registry: 'https://registry.npmjs.org/',
  },
  {
    name: 'yarn',
    alias: 'yarn',
    home: 'https://yarnpkg.com',
    registry: 'https://registry.yarnpkg.com/',
  },
  {
    name: 'tencent',
    alias: 'tencent',
    home: 'https://mirrors.cloud.tencent.com/npm/',
    registry: 'https://mirrors.cloud.tencent.com/npm/',
  },
  {
    name: 'cnpm',
    alias: 'cnpm',
    home: 'https://cnpmjs.org',
    registry: 'https://r.cnpmjs.org/',
  },
  {
    name: 'taobao',
    alias: 'taobao',
    home: 'https://npmmirror.com',
    registry: 'https://registry.npmmirror.com/',
  },
  {
    name: 'npmMirror',
    alias: 'npmMirror',
    home: 'https://skimdb.npmjs.com/',
    registry: 'https://skimdb.npmjs.com/registry/',
  },
];
