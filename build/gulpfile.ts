import { series } from 'gulp';
import { run, withTask } from '@alqmc/build-utils';
import { copyFiles } from './copyfile';
import { buildBundle } from './build';
export default series(
  withTask('update:version', () => run('pnpm run update:version')),
  withTask('clear', () => run('pnpm run clear')),
  buildBundle,
  copyFiles,
  withTask('link', () => run('pnpm run link'))
);
