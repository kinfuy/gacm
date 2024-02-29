import prompts from 'prompts';
import fetch from 'node-fetch';
import { gray, green, red } from 'kolorist';
import type { RegistryInfo, TestCmd } from '../../type/shell.type';
import { checkRegistry } from '../../utils/getUserList';

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
    if (isTimeout)
    // eslint-disable-next-line no-console
      console.log((`\n ${red('【Timeout】')} ping ${registry.alias}${registry.alias === registry.name ? '' : `${gray(`(${registry.name})`)}`}：${registry.registry}`));

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

  if (cmd.registry) {
    const registry = registryList.find(x => x.alias === cmd.registry || x.name === cmd.registry);
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

  await test(registry);
};
