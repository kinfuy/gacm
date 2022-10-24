import { Command } from 'commander';
import {
  useAdd,
  useAlias,
  useDelete,
  useLs,
  useUse,
  useVersion,
} from './commands/gacm';

const program = new Command();

program
  .option('-v, --version', '查看当前版本')
  .usage('command <option>')
  .description('查看当前版本')
  .action(useVersion);

program.command('ls').description('当前用户列表').action(useLs);

program
  .command('use [name...]')
  .option('-l, --local', '当前用户')
  .option('-g, --global', '全局用户')
  .option('-s, --system', '系统用户')
  .description('切换用户')
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
