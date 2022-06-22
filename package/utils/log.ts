import chalk from 'kolorist';
const { green, red, lightYellow, blue } = chalk;
const success = (msg: string) => console.log(green(msg));
const error = (msg: string) => console.log(red(msg));
const warning = (msg: string) => console.log(lightYellow(msg));
const info = (msg: string) => console.log(blue(msg));
export const log = {
  success,
  error,
  warning,
  info,
};
