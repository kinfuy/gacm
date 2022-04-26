import { readFile, writeFile } from 'fs/promises';
import readline from 'readline';
import { resolve } from 'path';
import chalk from 'chalk';

import pkg from '../../package/package.json';
import { enterPath, rootPath } from './path';

const pkgPaths = [
  resolve(enterPath, 'package.json'),
  resolve(rootPath, 'package.json'),
];

/**
 * 修改version
 * @param {string} version
 * @param {string} source
 */
const changeVersion = (version: string, source: string) => {
  readFile(source)
    .then((data) => {
      const pkg = JSON.parse(data.toString());
      pkg.version = version;
      writeFile(source, JSON.stringify(pkg, null, 2))
        .then(() => {
          // eslint-disable-next-line no-console
          console.log(chalk.green(`${source}文件，version更改为:${version}`));
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

/**
 * 获取输入版本号
 * @param rl
 */
const getVersion = (rl: readline.Interface): Promise<string> => {
  return new Promise((resolve) => {
    rl.question('请输入版本号：', async (version) => {
      const reg = /^([0-9]\d|[0-9])(\.([0-9]\d|\d)){2}$/;
      if (reg.test(version)) {
        rl.close();
        resolve(version);
      } else {
        // eslint-disable-next-line no-console
        console.log(chalk.red(`请输入正确的版本号!`));
        resolve(await getVersion(rl));
      }
    });
  });
};

(() => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `是否需要修改(当前:${pkg.version})版本号(Y/N)：`,
    async (answer) => {
      if (answer === 'Y' || answer === 'y') {
        const version = await getVersion(rl);
        pkgPaths.forEach((pkg) => {
          changeVersion(version, pkg);
        });
      } else {
        rl.close();
      }
    }
  );
})();
