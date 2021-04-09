#!/usr/bin/env node

import { DisplayAndGraphicsCard, MemoryInfoInterface } from './interfaces/systeminformation';

import os from 'os';
import yargs from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { uptimeInMinutes, returnInPink, yayfetchASCII, printInTwoColumns } from './helpers/helpers';
import {
  getEndianness,
  getDisplaysAndGraphicsCards,
  getMemoryInfo,
  getOsInfo,
  getShellInfo,
} from './helpers/systeminformation';

const promptQuestions = {
  type: 'checkbox',
  name: 'displayedValues',
  message: 'What information do you need?',
  choices: [
    'Platform',
    'Type',
    'Release',
    'Architecture',
    'Uptime',
    'CPUs',
    'GPUs',
    'Displays',
    'Endianness',
    'Memory',
    'Shell',
  ],
};

export interface SystemInformation {
  graphicsInfo: DisplayAndGraphicsCard;
  memoryInfo: MemoryInfoInterface;
  osInfo: {
    username: string;
  };
  shellInfo: string;
}

const getSystemInformation = async (): Promise<SystemInformation> => ({
  graphicsInfo: await getDisplaysAndGraphicsCards(),
  memoryInfo: await getMemoryInfo(),
  osInfo: {
    username: await getOsInfo(),
  },
  shellInfo: await getShellInfo(),
});

const allData = async (): Promise<string> => {
  const allData: SystemInformation = await getSystemInformation();
  return ` ${returnInPink(allData.osInfo.username + '@' + os.platform())} \n -----------------------------\n
  ${returnInPink(`Platform:`)} ${os.platform().toLocaleUpperCase()}\n
  ${returnInPink(`Type:`)} ${os.type()}\n
  ${returnInPink(`Release:`)} ${os.release()}\n
  ${returnInPink(`Architecture:`)} ${os.arch()}\n
  ${returnInPink(`Uptime:`)} ${uptimeInMinutes().toFixed(0)} min\n
  ${returnInPink(`CPU:`)} ${os.cpus()[0].model}\n
  ${returnInPink(`GPU(s):`)} ${allData.graphicsInfo.gpuInfo}\n
  ${returnInPink(`Display(s):`)} ${allData.graphicsInfo.displays}\n
  ${returnInPink(`Endianness:`)} ${getEndianness()}\n
  ${returnInPink(`Memory:`)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
    allData.memoryInfo.total
  } MiB (Free/Used/Total)\n
  ${returnInPink(`Shell:`)} ${allData.shellInfo}`;
};

async function returnPickedData(valuesToDisplay: Array<string>): Promise<string> {
  const allData: SystemInformation = await getSystemInformation();
  const pickedVals = [`${chalk.blue(allData.osInfo.username + '@' + os.platform())} \n -----------------------------`];
  valuesToDisplay.includes('Platform') &&
    pickedVals.push(`${returnInPink('Platform:')} ${os.platform().toLocaleUpperCase()}`);
  valuesToDisplay.includes('Type') && pickedVals.push(`${returnInPink('Type:')} ${os.type()}`);
  valuesToDisplay.includes('Release') && pickedVals.push(`${returnInPink('Release:')} ${os.release()}`);
  valuesToDisplay.includes('Architecture') && pickedVals.push(`${returnInPink('Architecture:')} ${os.arch()}`);
  valuesToDisplay.includes('Uptime') &&
    pickedVals.push(`${returnInPink('Uptime:')} ${uptimeInMinutes().toFixed(0)} min`);
  valuesToDisplay.includes('CPUs') && pickedVals.push(`${returnInPink('CPU:')} ${os.cpus()[0].model}`);
  valuesToDisplay.includes('GPUs') && pickedVals.push(`${returnInPink('GPU(s):')} ${allData.graphicsInfo.gpuInfo}`);
  valuesToDisplay.includes('Displays') &&
    pickedVals.push(`${returnInPink('Display(s):')} ${allData.graphicsInfo.displays}`);
  valuesToDisplay.includes('Endianness') && pickedVals.push(`${returnInPink('Endianness:')} ${getEndianness()}`);
  valuesToDisplay.includes('Memory') &&
    pickedVals.push(
      `${returnInPink('Memory:')} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
        allData.memoryInfo.total
      } MiB (Free/Used/Total)`,
    );
  valuesToDisplay.includes('Shell') && pickedVals.push(`${returnInPink('Shell:')} ${allData.shellInfo}`);
  return pickedVals.join('\n\n');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const args = yargs
  .command('$0', '', async () => {
    if (yargs.argv.p || yargs.argv.pick) {
      const inquirerPrompt = await inquirer.prompt<{ displayedValues: Array<string> }>([promptQuestions]);
      printInTwoColumns(returnInPink(yayfetchASCII), await returnPickedData(inquirerPrompt.displayedValues));
    } else {
      printInTwoColumns(returnInPink(yayfetchASCII), await allData());
    }
  })
  .scriptName('')
  .usage('Usage: npx yayfetch')
  .option('p', {
    alias: 'pick',
    describe: 'Asks you which information you want displayed',
  })
  .help()
  .version()
  .alias('help', 'h')
  .example('npx yayfetch', 'Returns information about your system').argv;
