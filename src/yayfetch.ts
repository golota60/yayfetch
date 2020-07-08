#!/usr/bin/env node

import { SystemInformation } from './interfaces/systeminformation';

import os from 'os';
import yargs from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { uptimeInMinutes, returnInPink, yayfetchASCII } from './helpers/helpers';
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

const getSystemInformation = async (): Promise<SystemInformation> => ({
  graphicsInfo: await getDisplaysAndGraphicsCards(),
  memoryInfo: await getMemoryInfo(),
  osInfo: {
    username: await getOsInfo(),
  },
  shellInfo: await getShellInfo(),
});

async function displayAllData(): Promise<void> {
  const allData: SystemInformation = await getSystemInformation();
  allData
    ? console.log(
        ` ${returnInPink(allData.osInfo.username + '@' + os.platform())} \n -----------------------------\n`,
        `${returnInPink(`Platform:`)} ${os.platform().toLocaleUpperCase()}\n`,
        `${returnInPink(`Type:`)} ${os.type()}\n`,
        `${returnInPink(`Release:`)} ${os.release()}\n`,
        `${returnInPink(`Architecture:`)} ${os.arch()}\n`,
        `${returnInPink(`Uptime:`)} ${uptimeInMinutes().toFixed(0)} min\n`,
        `${returnInPink(`CPU:`)} ${os.cpus()[0].model}\n`, //supports only one cpu
        `${returnInPink(`GPU(s):`)} ${allData.graphicsInfo.gpuInfo}\n`,
        `${returnInPink(`Display(s):`)} ${allData.graphicsInfo.displays}\n`,
        `${returnInPink(`Endianness:`)} ${getEndianness()}\n`,
        `${returnInPink(`Memory:`)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
          allData.memoryInfo.total
        } MiB (Free/Used/Total)\n`,
        `${returnInPink(`Shell:`)} ${allData.shellInfo}`,
      )
    : null;
}

async function displayPickedData(valuesToDisplay: Array<string>): Promise<void> {
  const allData: SystemInformation = await getSystemInformation();
  console.log(` ${chalk.blue(allData.osInfo.username + '@' + os.platform())} \n -----------------------------`);
  valuesToDisplay.includes('Platform') && console.log(`Platform: ${os.platform().toLocaleUpperCase()}`);
  valuesToDisplay.includes('Type') && console.log(`Type: ${os.type()}`);
  valuesToDisplay.includes('Release') && console.log(`Release: ${os.release()}`);
  valuesToDisplay.includes('Architecture') && console.log(`Architecture: ${os.arch()}`);
  valuesToDisplay.includes('Uptime') && console.log(`Uptime: ${uptimeInMinutes().toFixed(0)} min`);
  valuesToDisplay.includes('CPUs') && console.log(`CPU: ${os.cpus()[0].model}`);
  valuesToDisplay.includes('GPUs') && console.log(`GPU(s): ${allData.graphicsInfo.gpuInfo}`);
  valuesToDisplay.includes('Displays') && console.log(`Display(s): ${allData.graphicsInfo.displays}`);
  valuesToDisplay.includes('Endianness') && console.log(`Endianness: ${getEndianness()}`);
  valuesToDisplay.includes('Memory') &&
    console.log(
      `Memory: ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${allData.memoryInfo.total} MiB (Free/Used/Total)`,
    );
  valuesToDisplay.includes('Shell') && console.log(`Shell: ${allData.shellInfo}`);
  return;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const args = yargs
  .command('$0', '', async () => {
    if (yargs.argv.p || yargs.argv.pick) {
      const inquirerPrompt = await inquirer.prompt<{ displayedValues: Array<string> }>([promptQuestions]);
      console.log(returnInPink(yayfetchASCII));
      displayPickedData(inquirerPrompt.displayedValues);
    } else {
      const splitlogo = yayfetchASCII.split('\n');
      console.log(returnInPink(yayfetchASCII));
      displayAllData();
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
