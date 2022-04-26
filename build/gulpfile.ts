import { series } from 'gulp';
import { copyFiles } from './copyfile';
import { buildBundle } from './build';
import { run, withTask } from './process';
export default series(
  withTask('update:version', () => run('pnpm run update:version')),
  withTask('clear', () => run('pnpm run clear')),
  buildBundle,
  copyFiles
);
