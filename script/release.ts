import execa from 'execa';
import prompts from 'prompts';

const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

const main = async () => {
  const { tag } = await prompts({
    type: 'text',
    name: 'tag',
    message: '发布的版本',
  });
  try {
    await run('git', ['tag', `v${tag}`]);
    await run('pnpm', ['log']);
    await run('git', ['add', '.']);
    await run('git', ['commit', '-m', `release: v${tag}`]);
    await run('git', ['push', 'github', 'dev']);
    await run('cd', ['dist']);
    await run('npm', ['publish']);
  } catch (error) {
    process.exit(0);
  }
};
main();
