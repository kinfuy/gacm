import {
  bgLightBlue,
  bgLightGreen,
  bgLightRed,
  bgLightYellow,
  blue,
  green,
  lightYellow,
  red,
} from 'kolorist';
const PREFIX = 'gacm';
const success = (msg: string) =>
  console.log(`\n   ${bgLightGreen(PREFIX)}:${green(msg)}\n`);
const error = (msg: string) =>
  console.log(`\n   ${bgLightRed(PREFIX)}:${red(msg)}\n`);
const warning = (msg: string) =>
  console.log(`\n   ${bgLightYellow(PREFIX)}:${lightYellow(msg)}\n`);
const info = (msg: string) =>
  console.log(`\n   ${bgLightBlue(PREFIX)}:${blue(msg)}\n`);
export const log = {
  success,
  error,
  warning,
  info,
};
