import { blue, green, red, yellow } from 'kolorist';
const success = (msg: string) => console.log(`\n${green(msg)}\n`);
const error = (msg: string) => console.log(`\n${red(msg)}\n`);
const warning = (msg: string) => console.log(`\n${yellow(msg)}\n`);
const info = (msg: string) => console.log(`\n${blue(msg)}\n`);
export const log = {
  success,
  error,
  warning,
  info,
};
