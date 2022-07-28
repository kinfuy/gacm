import { blue, green, red, yellow } from 'kolorist';
const PREFIX = '[gacm]:';
const success = (msg: string) => console.log(`\n${green(PREFIX + msg)}\n`);
const error = (msg: string) => console.log(`\n${red(PREFIX + msg)}\n`);
const warning = (msg: string) => console.log(`\n${yellow(PREFIX + msg)}\n`);
const info = (msg: string) => console.log(`\n${PREFIX + blue(msg)}\n`);
export const log = {
  success,
  error,
  warning,
  info,
};
