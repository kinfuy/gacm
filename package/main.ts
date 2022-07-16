import { Command } from 'commander';
import { baseAction } from './commands/baseAction';
import {
  addAction,
  aliasAction,
  deleteAction,
  lsAction,
  useAction,
} from './commands/useAction';
const program = new Command();

program
  .option('-v, --version', '查看当前版本')
  .usage('command <option>')
  .description('查看当前版本')
  .action(baseAction);

program.command('ls').description('当前用户列表').action(lsAction);

program
  .command('use <name>')
  .option('-l, --local', '当前用户')
  .option('-g, --global', '全局用户')
  .option('-s, --system', '系统用户')
  .description('切换用户')
  .action(useAction);

program
  .command('add')
  .option('-n, --name <name>', '用户名称')
  .option('-e, --email <email>', '用户邮箱')
  .option('-a, --alias <alias>', '用户别名')
  .description('添加用户')
  .action(addAction);

program
  .command('alias <origin> <target>')
  .option('-a, --alias', '是否有别名')
  .description('添加别名')
  .action(aliasAction);

program
  .command('delete <name>')
  .option('-a, --alias', '按照别名删除')
  .description('删除用户')
  .action(deleteAction);

program.parse(process.argv);
