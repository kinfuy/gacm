import { spawn } from 'child_process';
import { rootPath } from './utils/path';
import type { TaskFunction } from 'gulp';
export const run = (command: string, dir: string = rootPath) => {
  const [cmd, ...args] = command.split(' ');
  return new Promise<void>((resolve, reject) => {
    const app = spawn(cmd, args, {
      cwd: dir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    const processExit = () => app.kill('SIGHUP');

    app.on('close', (code) => {
      process.removeListener('exit', processExit);
      if (code === 0) resolve();
      else
        reject(new Error(`command failed: \n command:${cmd} \n code:${code}`));
    });
    process.on('exit', processExit);
  });
};

export const withTask = <T extends TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, {
    displayName: name,
  });
