import { executionAsyncId } from 'async_hooks';
import chalk from 'chalk';
import { exec } from 'child_process';
import { assert } from 'console';
import { baseFlags, execAsPromise, getYayfetchOutput } from '../helpers';

describe('yayfetch', () => {
  it('returns info w/o flags', async () => {
    const output = await getYayfetchOutput();
    baseFlags.forEach(val => {
      expect(output.stdout).toContain(val);
    });
  });
  it('returns info in green', async () => {
    const output = await getYayfetchOutput('--color green');
    baseFlags.forEach(val => {
      expect(output.stdout).toContain(chalk.green(val));
    });
  });
});
