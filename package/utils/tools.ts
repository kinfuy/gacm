/* eslint-disable no-console */
import { white } from 'kolorist';

export const geneDashLine = (message: string, length: number) => {
  const finalMessage = new Array(Math.max(2, length - message.length + 2)).join(
    '-'
  );
  return padding(white(finalMessage));
};

export const padding = (message = '', before = 1, after = 1) => {
  return (
    new Array(before).fill(' ').join(' ') +
    message +
    new Array(after).fill(' ').join(' ')
  );
};

export const isLowerCaseEqual = (str1: string, str2: string) => {
  if (str1 && str2) {
    return str1.toLowerCase() === str2.toLowerCase();
  } else {
    return !str1 && !str2;
  }
};

export const printMessages = (messages: string[]) => {
  console.log('\n');
  for (const message of messages) {
    console.log(message);
  }
  console.log('\n');
};
