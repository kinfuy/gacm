import { Command } from 'commander';
import { useAdd, useAlias, useDelete, useVersion } from './commands/gacm';
import { useLs, useUse } from './commands/gnrm';

const program = new Command();

program
  .option('-v, --version', '查看当前版本')
  .usage('command <option>')
  .description('查看当前版本')
  .action(useVersion);

program
  .command('ls')
  .option('-p, --packageManager <packageManager>', '包管理器')
  .description('当前用户列表')
  .action(useLs);

program
  .command('use [name...]')
  .option('-p, --packageManager <packageManager>', '包管理器')
  .description('切换镜像源')
  .action(useUse);

program
  .command('add')
  .option('-n, --name <name>', '用户名称')
  .option('-e, --email <email>', '用户邮箱')
  .option('-a, --alias <alias>', '用户别名')
  .description('添加用户')
  .action(useAdd);

program
  .command('alias <origin> <target>')
  .description('添加别名')
  .action(useAlias);

program.command('delete <name>').description('删除用户').action(useDelete);

program.parse(process.argv);
