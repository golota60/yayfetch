import { exec, ExecException } from 'child_process';

interface ExecAsPromiseInterface {
  err: ExecException | null;
  stdout: string;
  stderr: string;
}

export async function execAsPromise(
  command: string
): Promise<ExecAsPromiseInterface> {
  return new Promise((resolve) => {
    exec(
      command,
      (error: ExecException | null, stdout: string, stderr: string) => {
        resolve({ err: error, stdout, stderr });
      }
    );
  });
}

export const getYayfetchOutput = async (flags = '') =>
  // For testing, use the CJS version
  execAsPromise(`node ./dist/yayfetch.js ${flags}`);

export const baseFlags = [
  'OS:',
  'Type:',
  'Release:',
  'Model:',
  'Architecture:',
  'Uptime:',
  'CPU:',
  'GPU(s):',
  'Display(s):',
  'Endianness:',
  'Memory:',
  'Shell:',
];
