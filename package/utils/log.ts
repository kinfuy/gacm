/* eslint-disable no-console */
import chalk from 'chalk';

const { green, red, yellowBright, blueBright } = chalk;
const success = (msg: string) => console.log(green(msg));
const error = (msg: string) => console.log(red(msg));
const warning = (msg: string) => console.log(yellowBright(msg));
const info = (msg: string) => console.log(blueBright(msg));
export const log = {
  success,
  error,
  warning,
  info,
};
