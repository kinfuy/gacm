import cac from 'cac';
import { useVersion } from './commands/common/useVersion';
import { useAdd, useAlias, useDelete, useLs, useUse } from './commands/gnrm';

const program = cac('gnrm');
program.version(useVersion());

program
  .command('ls', '当前用户列表')
  .option('-p, --packageManager <packageManager>', '查看对应包管理器：默认npm')
  .action(useLs);

program
  .command('use <name>', '切换镜像源')
  .option('-p, --packageManager <packageManager>', '设置对应包管理器：默认npm')
  .action(useUse);

program
  .command('add', '添加镜像')
  .option('-n, --name <name>', '镜像名称')
  .option('-r, --registry <registry>', '镜像地址')
  .option('-a, --alias <alias>', '镜像别名')
  .action(useAdd);

program.command('alias <origin> <target>', '镜像添加别名').action(useAlias);

program.command('delete <name>', '删除镜像').action(useDelete);

program.parse(process.argv);
