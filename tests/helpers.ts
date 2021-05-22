import { exec, ExecException } from 'child_process';

interface ExecAsPromiseInterface {
  err: ExecException | null;
  stdout: string;
  stderr: string;
}

export async function execAsPromise(command: string): Promise<ExecAsPromiseInterface> {
  return new Promise(function(resolve, reject) {
    exec(command, (err, stdout, stderr) => {
      resolve({ err, stdout, stderr });
    });
  });
}

export const getYayfetchOutput = async (flags = '') => execAsPromise(`node ./build/yayfetch.js ${flags}`);

export const baseFlags = [
  'Platform:',
  'Type:',
  'Release:',
  'Architecture:',
  'Uptime:',
  'CPU:',
  'GPU(s):',
  'Display(s):',
  'Endianness:',
  'Memory:',
  'Shell:',
];
