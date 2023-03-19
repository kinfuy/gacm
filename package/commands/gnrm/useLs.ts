import { blue, gray, green, red, yellow } from 'kolorist';
import prompts from 'prompts';
import { registriesPath } from '../../config/path';
import { getFileUser, writeFileUser } from '../../utils/getUserList';
import { defaultNpmMirror, defaultPackageManager } from '../../config/registry';
import { execCommand } from '../../utils/shell';
import { geneDashLine, padding, printMessages } from '../../utils/tools';
import { log } from '../../utils/log';
import { insertRegistry } from '../../utils/helper';
import type { NrmCmd, PackageManagertype } from '../../type/shell.type';

const getRegistry = async (pkg: PackageManagertype) => {
  return await execCommand(pkg, [
    'config',
    'get',
    'registry'
  ]).catch(() => {});
};

export const getRegistrys = async (pkgs: PackageManagertype[] = defaultPackageManager) => {
  const registrys: {
    [key in PackageManagertype]: string
  } = {
    npm: '',
    pnpm: '',
    cnpm: '',
    yarn: ''
  };
  const list = pkgs.map(async (pkg) => {
    return {
      pkg,
      handle: await getRegistry(pkg)
    };
  });
  for (const iterator of list) {
    const itme = await iterator;
    registrys[itme.pkg] = itme.handle || '';
  }

  return registrys;
};

export const useLs = async (cmd: NrmCmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registryList = defaultNpmMirror;
  if (userConfig)
    if (!userConfig.registry || userConfig.registry.length === 0) {
      userConfig.registry = registryList;
      writeFileUser(registriesPath, userConfig);
    }
    else { registryList = userConfig.registry; }

  const pkgs: PackageManagertype[] = [];

  if (cmd.packageManager)
    pkgs.push(cmd.packageManager);

  else
    pkgs.push(...defaultPackageManager);

  const currectRegistry = await getRegistrys(pkgs);

  if (registryList.every(x => Object.values(currectRegistry).includes(x.registry)))
  // 默认添加本地源
    try {
      const newRegistry = Object.keys(currectRegistry).map((x) => {
        if (registryList.every(val => currectRegistry[x as PackageManagertype] && val.registry !== currectRegistry[x as PackageManagertype]))
          return currectRegistry[x as PackageManagertype];
        return '';
      });
      Array.from(new Set(newRegistry)).filter(x => x).forEach(async (registry) => {
        const { name } = await prompts({
          type: 'text',
          name: 'name',
          message: `find new registry:${currectRegistry}, please give it a name`
        });
        await insertRegistry(name, name, registry);
        log.info(`[found new registry]: ${currectRegistry}`);
        registryList.push({
          name,
          registry,
          home: '',
          alias: name
        });
      });
    }
    catch (error) {}

  const length
    = Math.max(
      ...registryList.map((x) => {
        return x.alias.length + (x.alias !== x.name ? x.name.length : 0);
      })
    ) + 3;

  const prefix = '';

  const colorMap: Record<string, any> = {
    npm: green,
    cnpm: red,
    yarn: blue,
    pnpm: yellow
  };

  const currentTip = `current: ${Object.keys(currectRegistry).map((key) => {
    if (currectRegistry[key as PackageManagertype])
      return `${key}: ${colorMap[key]('■')}`;
    return '';
  }).filter(i => i).join(' ')}\n\n`;

  const messages = registryList.map((item) => {
    const currect = Object.keys(currectRegistry).map((key) => {
      if (currectRegistry[key as PackageManagertype] && item.registry.includes(currectRegistry[key as PackageManagertype]))
        return colorMap[key]('■');
      return '';
    }).filter(x => x);

    const isSame = item.alias === item.name;
    const str = `${prefix}${
      isSame ? item.alias : `${item.alias}(${gray(item.name)})`
    }${geneDashLine(item.name, length)}${item.registry}`;
    return `${currect.length > 0 ? padding(`${currect.join(' ')}`, 4 - currect.length, 1) : ''} ${padding(str, currect.length > 0 ? 0 : 4, 0)}`;
  });

  messages.unshift(currentTip);

  printMessages(messages);
};
