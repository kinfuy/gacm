import pkg from '../../package.json';
import { log } from '../../utils/log';

export const version = async () => {
  log.success(`${pkg.version}`);
};
