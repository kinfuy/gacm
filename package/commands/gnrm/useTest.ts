import prompts from 'prompts';
import fetch from 'node-fetch';
import { gray, green } from 'kolorist';
import type { RegistryInfo, TestCmd } from '../../type/shell.type';
import { checkRegistry } from '../../utils/getUserList';
import { log } from '../../utils/log';

const testRegistry = async (registry: string) => {
  const start = Date.now();
  const options = {
    timeout: 5000
  };
  let status = false;
  let isTimeout = false;
  try {
    const response = await fetch(registry, {
      ...options
    });
    status = response.ok;
  }
  catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error);
    isTimeout = error.type === 'request-timeout';
  }
  return {
    status,
    isTimeout,
    start
  };
};

export const useTest = async (cmd: TestCmd) => {
  const registryList = await checkRegistry();

  const test = async (registry: RegistryInfo) => {
    const { status, start, isTimeout } = await testRegistry(new URL('', registry.registry).href);
    if (isTimeout) log.error('timeout');
    if (status) {
      const end = Date.now();
      // eslint-disable-next-line no-console
      console.log((`\n ${green(`【${end - start}ms】`)} ping ${registry.alias}${registry.alias === registry.name ? '' : `${gray(`(${registry.name})`)}`}：${registry.registry}`));
    }
  };

  if (cmd.all) {
    const list = registryList.map(async (r) => {
      return {
        handle: await test(r)
      };
    });
    for (const iterator of list)
      await iterator;

    return;
  }

  if (cmd.packageManager) {
    const registry = registryList.find(x => x.alias === cmd.packageManager);
    if (registry)
      await test(registry);

    return;
  }

  const { registry } = await prompts([
    {
      type: 'select',
      name: 'registry',
      message: 'Pick a registry',
      choices: registryList.map((x) => {
        return {
          title: `${x.alias}${x.alias === x.name ? '' : `(${x.name})`} ${
            x.registry
          }`,
          value: x
        };
      })
    }
  ]);

  await test(registry.registry);
};
