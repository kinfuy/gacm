import { Command } from 'commander';
import { baseAction } from './commands/baseAction';
import {
  addAction,
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
  .option('-n, --name <name>', '当前用户')
  .option('-e, --email <email>', '全局用户')
  .description('添加用户')
  .action(addAction);

program.command('delete <name>').description('删除用户').action(deleteAction);

program.parse(process.argv);
