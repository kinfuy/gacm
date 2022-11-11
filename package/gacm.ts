import cac from 'cac';
import { useAdd, useAlias, useDelete, useLs, useUse } from './commands/gacm';
import { useVersion } from './commands/common/useVersion';

const program = cac('gacm');

program.version(useVersion());

program.command('ls', '当前用户列表').action(useLs);

program
  .command('use [name]', '切换用户')
  .option('-l, --local', '当前用户')
  .option('-g, --global', '全局用户')
  .option('-s, --system', '系统用户')
  .action(useUse);

program
  .command('add', '添加用户')
  .option('-n, --name <name>', '用户名称')
  .option('-e, --email <email>', '用户邮箱')
  .option('-a, --alias <alias>', '用户别名')
  .action(useAdd);

program.command('alias <origin> <target>', '添加别名').action(useAlias);

program.command('delete <name>', '删除用户').action(useDelete);

program.parse(process.argv);
