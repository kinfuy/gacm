import { Command } from 'commander';
import { useVersion } from './commands/gacm';
import { useAdd, useAlias, useDelete, useLs, useUse } from './commands/gnrm';

const program = new Command();

program
  .option('-v, --version', '查看当前版本')
  .usage('command <option>')
  .description('查看当前版本')
  .action(useVersion);

program
  .command('ls')
  .option('-p, --packageManager <packageManager>', '查看对应包管理器：默认npm')
  .description('当前用户列表')
  .action(useLs);

program
  .command('use [name...]')
  .option('-p, --packageManager <packageManager>', '设置对应包管理器：默认npm')
  .description('切换镜像源')
  .action(useUse);

program
  .command('add')
  .option('-n, --name <name>', '镜像名称')
  .option('-r, --registry <registry>', '镜像地址')
  .option('-a, --alias <alias>', '镜像别名')
  .description('添加镜像')
  .action(useAdd);

program
  .command('alias <origin> <target>')
  .description('镜像添加别名')
  .action(useAlias);

program.command('delete <name>').description('删除镜像').action(useDelete);

program.parse(process.argv);
